import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, MoreVertical, Plus, Search, X, Loader2, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

import { publicApi, resourceApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Incidents = () => {
    const { user } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // ... modal states ...
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastComplete, setBroadcastComplete] = useState(false);


    // Form State
    const [formData, setFormData] = useState({
        type: 'Medical Emergency',
        location: '',
        severity: 'Moderate'
    });

    useEffect(() => {
        fetchIncidents();
        fetchVehicles();
    }, []);

    const fetchIncidents = () => {
        publicApi.getIncidents()
            .then(res => {
                setIncidents(res.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const fetchVehicles = () => {
        publicApi.getVehicles()
            .then(res => setVehicles(res.data))
            .catch(err => console.error(err));
    };

    const handleQuickAssign = (incident) => {
        setSelectedIncident(incident);
        setShowAssignModal(true);
    };

    const confirmAssignment = async (vehicleId) => {
        setIsAssigning(true);
        try {
            // 1. Update Incident
            await resourceApi.updateIncident(selectedIncident.id, {
                status: 'On Route',
                vehicle_id: vehicleId
            });

            // 2. Update Vehicle Status
            await resourceApi.updateVehicle(vehicleId, {
                status: 'On Call'
            });

            setShowAssignModal(false);
            fetchIncidents();
            fetchVehicles();
            alert('Emergency unit successfully dispatched to location.');

        } catch (err) {
            console.error('Assign Fail:', err);
            alert('Failed to assign unit. Ensure you are logged in with appropriate permissions.');
        } finally {
            setIsAssigning(false);
        }
    };


    const filteredIncidents = incidents.filter(inc => {
        const s = searchTerm.toLowerCase();
        return (
            inc.type.toLowerCase().includes(s) ||
            inc.location.toLowerCase().includes(s) ||
            inc.status.toLowerCase().includes(s) ||
            inc.severity.toLowerCase().includes(s) ||
            `#INC-${inc.id}`.toLowerCase().includes(s)
        );
    });

    const handleReport = async (e) => {
        e.preventDefault();

        if (!formData.location.trim()) {
            alert('Please provide a specific location in Kohat.');
            return;
        }

        setIsBroadcasting(true);

        try {
            // 1. Save to DB (Actually POST to backend)
            await resourceApi.createIncident({
                ...formData,
                status: 'Dispatching',
                lat: (33.58 + (Math.random() - 0.5) * 0.02).toFixed(4), // Random Kohat coord
                lng: (71.44 + (Math.random() - 0.5) * 0.02).toFixed(4)
            });

            // 2. Simulate broadcasting delay
            setTimeout(() => {
                setBroadcastComplete(true);
                setTimeout(() => {
                    setShowModal(false);
                    setIsBroadcasting(false);
                    setBroadcastComplete(false);
                    fetchIncidents(); // Refresh list
                    setFormData({ type: 'Medical Emergency', location: '', severity: 'Moderate' }); // Reset
                }, 2000);
            }, 3000);

        } catch (err) {
            console.error('Report Fail:', err);
            setIsBroadcasting(false);

            const errorMessage = err.response?.data?.message || err.message;
            if (err.response?.status === 401) {
                alert('Session expired. Please logout and login again to authorize broadcasting.');
            } else if (err.response?.status === 422) {
                alert(`Validation Error: ${JSON.stringify(err.response.data.errors)}`);
            } else {
                alert(`Broadcast Error: ${errorMessage}. Check backend connection.`);
            }
        }
    };


    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Live Incident Queue</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Broadcasting to Kohat Division Rescue Units</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="glass-card"
                            placeholder="Search incidents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.6rem 1rem 0.6rem 3rem', border: 'none', color: 'white', width: '250px' }}
                        />
                    </div>
                    {['admin', 'operator'].includes(user?.role) && (
                        <button className="btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={18} /> New Report
                        </button>
                    )}
                </div>
            </div>

            {/* Incident Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.8rem', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem' }}>ID & TIME</th>
                            <th style={{ padding: '1.25rem' }}>INCIDENT TYPE</th>
                            <th style={{ padding: '1.25rem' }}>LOCATION (KOHAT)</th>
                            <th style={{ padding: '1.25rem' }}>STATUS</th>
                            <th style={{ padding: '1.25rem' }}>SEVERITY</th>
                            <th style={{ padding: '1.25rem' }}>{user?.role === 'responder' ? 'MY ACTION' : 'DISPATCH'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center' }}>Loading live feeds...</td></tr>
                        ) : filteredIncidents.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</td></tr>
                        ) : filteredIncidents.map((incident, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row">
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ fontWeight: 600 }}>#INC-{incident.id}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Clock size={12} /> {new Date(incident.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {incident.vehicle_id && (
                                        <div style={{ fontSize: '0.65rem', color: '#10b981', marginTop: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', width: 'fit-content', fontWeight: 700 }}>
                                            Assigned: Unit {vehicles.find(v => v.id === incident.vehicle_id)?.unit_id || incident.vehicle_id}
                                        </div>
                                    )}
                                </td>

                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: incident.severity === 'Critical' ? 'var(--primary)' : '#fbbf24' }}></div>
                                        {incident.type}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                        <MapPin size={14} color="var(--text-muted)" />
                                        {incident.location}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span className={`status-badge ${incident.status === 'Completed' ? 'status-success' :
                                        incident.status === 'Dispatching' ? 'status-critical' : 'status-warning'
                                        }`}>
                                        {incident.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        color: incident.severity === 'Critical' ? '#fb7185' : '#fbbf24',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {incident.severity}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    {['admin', 'operator'].includes(user?.role) ? (
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                                            onClick={() => handleQuickAssign(incident)}
                                            disabled={incident.status === 'Completed' || incident.status === 'On Route'}
                                        >
                                            {incident.status === 'On Route' ? 'Assigned' : 'Quick Assign'}
                                        </button>
                                    ) : user?.role === 'responder' ? (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', background: '#10b981' }}
                                                onClick={async () => {
                                                    await resourceApi.updateIncident(incident.id, { status: 'Completed' });
                                                    fetchIncidents();
                                                }}
                                                disabled={incident.status === 'Completed'}
                                            >
                                                Mark Complete
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Read Only</span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* New Report Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', margin: 'auto' }}
                        >
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Broadcast Emergency</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Notify all nearby Kohat 1122 units immediately.</p>

                            {isBroadcasting ? (
                                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                    {broadcastComplete ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
                                            <h4 style={{ color: '#10b981', fontSize: '1.2rem' }}>Units Responding!</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ambulance unit near Bannu Road accepted the call.</p>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <div className="broadcast-wave" style={{ margin: '0 auto 2rem' }}>
                                                <Send size={32} color="var(--primary)" />
                                            </div>
                                            <h4 style={{ marginBottom: '0.5rem' }}>Broadcasting to Units...</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Searching for closest available ambulance in Kohat Division.</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleReport}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Incident Type</label>
                                        <select
                                            className="input-field"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>Medical Emergency</option>
                                            <option>Road Traffic Accident</option>
                                            <option>Fire Outbreak</option>
                                            <option>Natural Disaster</option>
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Exact Location in Kohat</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g. Near KDA Gate or Bannu Road"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Initial Severity</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {['Moderate', 'High', 'Critical'].map(level => (
                                                <label key={level} style={{ flex: 1, cursor: 'pointer' }}>
                                                    <input
                                                        type="radio"
                                                        name="severity"
                                                        hidden
                                                        checked={formData.severity === level}
                                                        onChange={() => setFormData({ ...formData, severity: level })}
                                                    />
                                                    <div style={{
                                                        padding: '0.75rem',
                                                        textAlign: 'center',
                                                        borderRadius: '8px',
                                                        border: '1px solid',
                                                        borderColor: formData.severity === level ? 'var(--primary)' : 'var(--border)',
                                                        background: formData.severity === level ? 'rgba(225, 29, 72, 0.1)' : 'transparent',
                                                        fontSize: '0.75rem',
                                                        color: formData.severity === level ? 'var(--primary)' : 'var(--text-muted)'
                                                    }}>
                                                        {level}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
                                        Initialize Broadcast
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}

                {showAssignModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card"
                            style={{ width: '100%', maxWidth: '550px', padding: '2.5rem', position: 'relative' }}
                        >
                            <button onClick={() => setShowAssignModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Rapid Unit Assignment</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                                Assigning to: <span style={{ color: 'white', fontWeight: 600 }}>#INC-{selectedIncident?.id} - {selectedIncident?.type}</span>
                            </p>

                            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                {vehicles.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No units configured in system.</div>
                                ) : vehicles.filter(v => v.status === 'In Service').length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', color: '#fb7185', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                        <AlertTriangle size={32} style={{ margin: '0 auto 1rem' }} />
                                        <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>No Units Available</h4>
                                        <p style={{ fontSize: '0.8rem' }}>All rescue units are currently on assignment or out of service.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Available Units ({vehicles.filter(v => v.status === 'In Service').length})</p>
                                        {vehicles.filter(v => v.status === 'In Service').map(v => (
                                            <div key={v.id} className="glass-card" style={{
                                                padding: '1.25rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid var(--border)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <CheckCircle2 size={20} color="#10b981" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{v.unit_id}</div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.type} • {v.driver_name}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem', borderRadius: '8px' }}
                                                    onClick={() => confirmAssignment(v.id)}
                                                    disabled={isAssigning}
                                                >
                                                    {isAssigning ? 'Dispatching...' : 'Dispatch'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>


                            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Loader2 size={14} className="animate-spin" />
                                Ensuring encrypted GPS link with unit...
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <style>{`
                .broadcast-wave {
                    width: 80px;
                    height: 80px;
                    background: rgba(225, 29, 72, 0.1);
                    border-radius: 50%;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(225, 29, 72, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
                }
                .table-row:hover { background: rgba(255, 255, 255, 0.03); }
            `}</style>
        </div>
    );
};

export default Incidents;
