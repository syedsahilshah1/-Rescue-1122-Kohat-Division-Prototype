import React, { useState, useEffect } from 'react';
import { Truck, Activity, Share2, Map, Navigation, ShieldCheck, User, Phone, CheckCircle2 } from 'lucide-react';
import { publicApi, resourceApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FleetStatus = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingUnit, setUpdatingUnit] = useState(null);


    useEffect(() => {
        publicApi.getVehicles()
            .then(res => {
                setFleet(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const filteredFleet = fleet.filter(unit => {
        const s = searchTerm.toLowerCase();
        return (
            unit.unit_id.toLowerCase().includes(s) ||
            unit.driver_name.toLowerCase().includes(s) ||
            unit.type.toLowerCase().includes(s) ||
            unit.status.toLowerCase().includes(s)
        );
    });

    const trackOnMap = (unit) => {
        // ... same logic ...
        window.dispatchEvent(new CustomEvent('track-location', {
            detail: { lat: parseFloat(unit.lat), lng: parseFloat(unit.lng), zoom: 17 }
        }));
        window.dispatchEvent(new CustomEvent('change-tab', { detail: 'map' }));
    };

    const shareDetails = (unit) => {
        const text = `Rescue 1122 Kohat Unit ${unit.unit_id}\nDriver: ${unit.driver_name}\nContact: ${unit.driver_contact}\nLocation: https://www.google.com/maps?q=${unit.lat},${unit.lng}`;
        navigator.clipboard.writeText(text);
        alert('Unit details copied to clipboard! You can share them now.');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Fleet Operations Monitor (Kohat)</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Live GPS Tracker Stream & Driver Assignment</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="glass-card"
                            placeholder="Search fleet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.6rem 1rem 0.6rem 3rem', border: 'none', color: 'white', width: '220px' }}
                        />
                        <Share2 size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                    <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>GPS LINK</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1/-1' }}>Initializing GPS modules...</div>
                ) : filteredFleet.length === 0 ? (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', gridColumn: '1/-1', color: 'var(--text-muted)' }}>No units found matching "{searchTerm}"</div>
                ) : filteredFleet.map((unit, i) => (

                    <div key={i} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        {unit.status === 'On Call' && (
                            <div style={{ position: 'absolute', top: 0, right: 0, padding: '0.25rem 0.75rem', background: 'var(--primary)', color: 'white', fontSize: '0.6rem', fontWeight: 800 }}>LIVE TRACKING</div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem', borderRadius: '12px' }}>
                                <Truck size={24} color={unit.status === 'In Service' ? '#10b981' : unit.status === 'On Call' ? '#fbbf24' : '#ef4444'} />
                            </div>
                            <span className={`status-badge ${unit.status === 'In Service' ? 'status-success' : unit.status === 'On Call' ? 'status-warning' : 'status-critical'}`}>
                                {unit.status}
                            </span>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px' }}>{unit.unit_id}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{unit.type}</p>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                <User size={16} color="var(--primary)" />
                                <span style={{ fontSize: '0.85rem' }}>Driver: <strong style={{ color: 'white' }}>{unit.driver_name}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contact: {unit.driver_contact}</span>
                            </div>
                        </div>

                        {/* Smart Metrics */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                                <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Oxygen Level</span>
                                <span style={{ fontWeight: 700, color: unit.oxygen_level < 30 ? '#ef4444' : 'white' }}>{unit.oxygen_level}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${unit.oxygen_level}%`,
                                    background: unit.oxygen_level < 30 ? 'var(--primary)' : '#10b981',
                                    borderRadius: '10px'
                                }}></div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Standard Equipment</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {unit.equipment?.split(',').map((tool, ti) => (
                                    <span key={ti} style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.6rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                        {tool.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>


                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <Map size={14} /> Lat {unit.lat}, Lng {unit.lng}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.5rem', borderRadius: '8px', color: 'white', cursor: 'pointer' }} title="Emergency Contact">
                                    <ShieldCheck size={18} />
                                </button>
                                <button
                                    onClick={() => shareDetails(unit)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '0.5rem', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                                    title="Share Location"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                            {user?.role === 'responder' ? (
                                <button
                                    onClick={async () => {
                                        setUpdatingUnit(unit.id);
                                        await resourceApi.updateVehicle(unit.id, { oxygen_level: 100 });
                                        const res = await publicApi.getVehicles();
                                        setFleet(res.data);
                                        setUpdatingUnit(null);
                                    }}
                                    style={{ background: '#10b981', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                                    disabled={updatingUnit === unit.id}
                                >
                                    <Activity size={14} /> {updatingUnit === unit.id ? 'Refilling...' : 'REFILL OXYGEN'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => trackOnMap(unit)}
                                    style={{ background: 'var(--primary)', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: 'white', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                                >
                                    <Navigation size={14} /> TRACK UNIT
                                </button>
                            )}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default FleetStatus;
