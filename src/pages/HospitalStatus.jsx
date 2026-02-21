import React, { useState, useEffect } from 'react';
import { Bed, UserPlus, MapPin, ExternalLink, Hospital, Loader2, Activity } from 'lucide-react';


import { motion } from 'framer-motion';
import { publicApi, resourceApi } from '../services/api';
import { useAuth } from '../context/AuthContext';



const HospitalStatus = () => {
    const { user } = useAuth();
    const [hospitals, setHospitals] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingHosp, setUpdatingHosp] = useState(null);


    useEffect(() => {
        publicApi.getHospitals()
            .then(res => {
                setHospitals(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredHospitals = hospitals.filter(h => {
        const s = searchTerm.toLowerCase();
        return (
            h.name.toLowerCase().includes(s) ||
            h.beds_total.toString().includes(s) ||
            h.critical_cases.toString().includes(s)
        );
    });

    const viewOnMap = (hosp) => {
        if (hosp.lat && hosp.lng) {
            window.dispatchEvent(new CustomEvent('track-location', {
                detail: { lat: parseFloat(hosp.lat), lng: parseFloat(hosp.lng), zoom: 17 }
            }));
            window.dispatchEvent(new CustomEvent('change-tab', { detail: 'map' }));
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Hospital Capability Matrix</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time bed availability and facility locations in Kohat Division</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className="glass-card"
                        placeholder="Search hospitals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.75rem 1rem 0.75rem 3.5rem', border: 'none', color: 'white', width: '300px', borderRadius: '12px' }}
                    />
                    <MapPin size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>
                {loading ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1' }}>
                        <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
                        <p style={{ color: 'var(--text-muted)' }}>Syncing regional facility data...</p>
                    </div>
                ) : filteredHospitals.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)' }}>
                        No facilities found matching "{searchTerm}"
                    </div>
                ) : filteredHospitals.map((hosp, i) => {
                    const availability = hosp.beds_total - hosp.beds_occupied;
                    const percentage = (hosp.beds_occupied / hosp.beds_total) * 100;
                    const isCriticalLoad = percentage > 85;

                    return (
                        <div key={i} className="glass-card" style={{
                            padding: '2rem',
                            position: 'relative',
                            border: isCriticalLoad ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)',
                            transition: 'transform 0.3s ease'
                        }}>
                            {/* Header Section */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            padding: '0.4rem',
                                            background: 'rgba(225, 29, 72, 0.1)',
                                            borderRadius: '8px',
                                            display: 'flex'
                                        }}>
                                            <Hospital size={18} color="var(--primary)" />
                                        </div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            {hosp.specialization}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.2 }}>{hosp.name}</h3>
                                </div>

                                {user?.role === 'hospital' && user?.hospital_id === hosp.id ? (
                                    <button
                                        onClick={async () => {
                                            setUpdatingHosp(hosp.id);
                                            const newOccupied = Math.max(0, hosp.beds_occupied + (Math.floor(Math.random() * 5) - 2));
                                            await resourceApi.updateHospital(hosp.id, { beds_occupied: newOccupied });
                                            const res = await publicApi.getHospitals();
                                            setHospitals(res.data);
                                            setUpdatingHosp(null);
                                        }}
                                        className="btn-primary"
                                        style={{ padding: '0.6rem 1rem', fontSize: '0.7rem', background: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                        disabled={updatingHosp === hosp.id}
                                    >
                                        <Activity size={14} className={updatingHosp === hosp.id ? 'animate-spin' : ''} />
                                        {updatingHosp === hosp.id ? 'Updating...' : 'Sync Capacity'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => viewOnMap(hosp)}
                                        className="btn-primary"
                                        style={{ padding: '0.6rem 1rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid transparent' }}
                                    >
                                        <ExternalLink size={14} /> GPS
                                    </button>
                                )}


                            </div>

                            {/* Occupancy Indicator */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Bed Utilization</span>
                                    <span style={{ fontWeight: 700, color: isCriticalLoad ? '#ef4444' : 'white' }}>
                                        {hosp.beds_occupied} / {hosp.beds_total} ({percentage.toFixed(0)}%)
                                    </span>
                                </div>
                                <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        style={{
                                            height: '100%',
                                            background: isCriticalLoad
                                                ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                                : percentage > 70
                                                    ? 'linear-gradient(90deg, #fbbf24, #fcd34d)'
                                                    : 'linear-gradient(90deg, #10b981, #34d399)',
                                            borderRadius: '20px',
                                            boxShadow: isCriticalLoad ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <UserPlus size={14} /> ICU Patients
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                        <p style={{ fontWeight: 800, color: '#fb7185', fontSize: '1.5rem' }}>{hosp.critical_cases}</p>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Reserved</span>
                                    </div>
                                    {hosp.critical_cases > 10 && (
                                        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                                            <div className="pulse-dot" style={{ background: '#ef4444' }}></div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Bed size={14} /> Available Beds
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.5rem' }}>
                                        <p style={{ fontWeight: 800, color: '#10b981', fontSize: '1.5rem' }}>{availability}</p>
                                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Units</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Activity size={12} color="#fbbf24" />
                                        <span>Ventilators: <strong>{hosp.ventilators_available}</strong></span>
                                    </div>
                                </div>

                            </div>

                            {/* Footer/Meta */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '1.25rem',
                                borderTop: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>ICU Active</span>
                                    <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>Emergency 24/7</span>
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} className="pulse-mini"></div>
                                    Sync Live
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: pulse-red 1.5s infinite;
                }
                .pulse-mini {
                    animation: pulse-green 2s infinite;
                }
                @keyframes pulse-red {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { transform: scale(1.2); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                @keyframes pulse-green {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};


export default HospitalStatus;
