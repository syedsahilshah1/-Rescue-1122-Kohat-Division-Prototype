import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
    BarChart3,
    Map as MapIcon,
    Settings,
    LogOut,
    AlertTriangle,
    Truck,
    Hospital,
    ShieldCheck,
    ClipboardList
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', icon: BarChart3, label: 'Analytics', roles: ['admin'] },
        { id: 'incidents', icon: AlertTriangle, label: 'Live Incidents', roles: ['admin', 'operator', 'responder'] },
        { id: 'map', icon: MapIcon, label: 'GPS Dispatch', roles: ['admin', 'operator', 'responder'] },
        { id: 'fleet', icon: Truck, label: 'Fleet Status', roles: ['admin', 'operator', 'responder'] },
        { id: 'hospitals', icon: Hospital, label: 'Hospitals', roles: ['admin', 'operator', 'hospital'] },

        { id: 'audit', icon: ShieldCheck, label: 'Audit Logs', roles: ['admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="glass-card" style={{
            width: '280px',
            height: 'calc(100vh - 2rem)',
            margin: '1rem',
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            zIndex: 100
        }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <AlertTriangle color="white" size={24} />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>SERMS</h1>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rescue 1122 Management</p>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                {filteredItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            background: activeTab === item.id ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
                            color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            marginBottom: '0.5rem',
                            transition: 'all 0.2s',
                            fontWeight: 500
                        }}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155' }}></div>
                    <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
