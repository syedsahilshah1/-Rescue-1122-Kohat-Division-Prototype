import React from 'react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const lineData = {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [
            {
                label: 'Incident Volume',
                data: [12, 8, 45, 32, 54, 38],
                borderColor: '#e11d48',
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
    };

    const stats = [
        { label: 'Total Incidents', value: '1,284', change: '+12%', icon: AlertTriangle, color: '#e11d48' },
        { label: 'Avg. Response Time', value: '4.2 min', change: '-45s', icon: Clock, color: '#fbbf24' },
        { label: 'Resolved Cases', value: '1,192', change: '92.4%', icon: CheckCircle, color: '#10b981' },
        { label: 'Active Fleet', value: '42', change: 'Live', icon: TrendingUp, color: '#6366f1' },
    ];

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: `${stat.color}15`, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: stat.color
                            }}>
                                <stat.icon size={20} />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stat.color === '#10b981' ? '#34d399' : '#94a3b8' }}>{stat.change}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Incident Frequency (24h)</h3>
                    <div style={{ height: '300px' }}>
                        <Line data={lineData} options={chartOptions} />
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Resource Allocation</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Distribution across sectors</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['Medical', 'Fire', 'Rescue', 'Other'].map((type, i) => (
                            <div key={type}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                    <span>{type}</span>
                                    <span>{75 - (i * 15)}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                                    <div style={{ height: '100%', width: `${75 - (i * 15)}%`, background: i === 0 ? 'var(--primary)' : '#6366f1', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
