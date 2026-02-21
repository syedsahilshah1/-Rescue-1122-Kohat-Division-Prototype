import React, { useState, useEffect } from 'react';
import { Clipboard, User, Activity, ArrowRightLeft, Search, Filter } from 'lucide-react';

const AuditLogs = () => {
    const [logs, setLogs] = useState([
        {
            id: 'KHT-LOG-992',
            timestamp: '2026-02-21 10:15:22',
            ambulance: 'KHT-1122-01',
            patient_status: 'Critical (Cardiac)',
            taken_from: 'Patient Home (Direct)',
            doctor_in_charge: 'Dr. Arshad (Rescuer)',
            transfer_to: 'DHQ Hospital KDA',
            status: 'Transfer Complete'
        },
        {
            id: 'KHT-LOG-991',
            timestamp: '2026-02-21 09:45:10',
            ambulance: 'KHT-1122-02',
            patient_status: 'Referral (Inter-hospital)',
            taken_from: 'Liaquat Memorial (Doctor)',
            doctor_in_charge: 'Dr. Faheem (LMH)',
            transfer_to: 'CMH Kohat',
            status: 'In Transit'
        },
        {
            id: 'KHT-LOG-990',
            timestamp: '2026-02-21 08:30:15',
            ambulance: 'KHT-1122-01',
            patient_status: 'Stabilized',
            taken_from: 'Road Accident (Site)',
            doctor_in_charge: 'Dr. Sara (Trauma)',
            transfer_to: 'Liaquat Memorial',
            status: 'Verified'
        }
    ]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Chain of Custody & Audit Logs</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kohat Division Rescue 1122 - Patient Transfer Verification</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="glass-card"
                            placeholder="Patient/DR/Hosp..."
                            style={{ padding: '0.6rem 1rem 0.6rem 3rem', border: 'none', color: 'white', width: '220px' }}
                        />
                    </div>
                    <button className="glass-card" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', color: 'white' }}>
                        <Filter size={18} /> Export PDF
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', fontSize: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem' }}>AUDIT ID & TIME</th>
                            <th style={{ padding: '1.25rem' }}>AMBULANCE</th>
                            <th style={{ padding: '1.25rem' }}>TAKEN FROM (PATIENT/DR)</th>
                            <th style={{ padding: '1.25rem' }}>DOCTOR IN CHARGE</th>
                            <th style={{ padding: '1.25rem' }}>TRANSFER TO (HOSPITAL)</th>
                            <th style={{ padding: '1.25rem' }}>LOG STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row">
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.id}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.timestamp}</div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--primary)' }}>
                                        <Activity size={14} /> {log.ambulance}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <User size={14} color="var(--text-muted)" />
                                        {log.taken_from}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.patient_status}</div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ fontSize: '0.85rem' }}>{log.doctor_in_charge}</div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <ArrowRightLeft size={14} color="#6366f1" />
                                        {log.transfer_to}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        background: log.status.includes('Complete') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                        color: log.status.includes('Complete') ? '#10b981' : '#6366f1'
                                    }}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .table-row:hover { background: rgba(255, 255, 255, 0.03); }
            `}</style>
        </div>
    );
};

export default AuditLogs;
