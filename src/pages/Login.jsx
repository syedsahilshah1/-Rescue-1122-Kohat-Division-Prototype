import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle, Loader2, CheckCircle2, XCircle, Hospital } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { publicApi } from '../services/api';

const Login = () => {
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState('admin');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState('');
    const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'

    const roles = [
        { id: 'admin', label: 'Administrator', icon: Shield },
        { id: 'operator', label: 'Dispatch Operator', icon: AlertCircle },
        { id: 'responder', label: 'Field Responder', icon: AlertCircle },
        { id: 'hospital', label: 'Medical Facility', icon: Hospital },

    ];

    useEffect(() => {
        const checkBackend = async () => {
            try {
                await publicApi.getIncidents();
                setBackendStatus('online');
            } catch (err) {
                console.error('Backend check failed:', err);
                setBackendStatus('offline');
            }
        };
        checkBackend();
    }, []);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        setError('');

        try {
            await login(selectedRole);
            // If login succeeds, the App component will automatically switch to the dashboard
        } catch (err) {
            console.error('Login Error:', err);
            if (err.response) {
                setError(`Auth Error (${err.response.status}): ${err.response.data?.message || 'Invalid Credentials'}`);
            } else {
                setError('Network error. Ensure XAMPP is running and backend is started.');
            }
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
            padding: '1rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '450px', padding: '3rem', position: 'relative' }}
            >
                {/* Backend Status Badge */}
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontSize: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: backendStatus === 'online' ? '#34d399' : backendStatus === 'offline' ? '#f87171' : '#94a3b8'
                }}>
                    {backendStatus === 'online' ? <CheckCircle2 size={12} /> : backendStatus === 'offline' ? <XCircle size={12} /> : <Loader2 size={12} className="animate-spin" />}
                    System {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking'}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--primary)',
                        borderRadius: '16px',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(225, 29, 72, 0.4)'
                    }}>
                        <Shield size={32} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>SERMS Access</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Secure Emergency Response Management System</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#f87171',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1.5rem',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Access Level</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {roles.map(role => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                disabled={isLoggingIn}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '0.75rem',
                                    border: '1px solid',
                                    borderColor: selectedRole === role.id ? 'var(--primary)' : 'var(--border)',
                                    background: selectedRole === role.id ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
                                    color: selectedRole === role.id ? 'var(--primary)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    opacity: isLoggingIn ? 0.7 : 1
                                }}
                            >
                                <role.icon size={18} />
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                        <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Agency Identifier"
                            style={{ paddingLeft: '3rem' }}
                            value={
                                selectedRole === 'admin' ? 'admin@rescue1122.pk' :
                                    selectedRole === 'operator' ? 'op1@rescue1122.pk' :
                                        selectedRole === 'responder' ? 'responder@rescue1122.pk' :
                                            'dhq@hospital.pk'
                            }
                            readOnly
                            disabled={isLoggingIn}

                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Access Key"
                            style={{ paddingLeft: '3rem' }}
                            defaultValue="password"
                            disabled={isLoggingIn}
                        />
                    </div>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleLogin}
                    disabled={isLoggingIn || backendStatus === 'offline'}
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        padding: '1rem',
                        fontSize: '1rem',
                        opacity: (isLoggingIn || backendStatus === 'offline') ? 0.6 : 1,
                        cursor: (isLoggingIn || backendStatus === 'offline') ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoggingIn ? (
                        <>
                            <Loader2 className="animate-spin" size={20} style={{ marginRight: '0.5rem' }} />
                            Authenticating...
                        </>
                    ) : backendStatus === 'offline' ? 'System Offline' : 'Secure Authorization'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Unauthorized access is strictly monitored and logged. <br />
                    By logging in, you agree to the protocols of Rescue 1122.
                </p>
            </motion.div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;
