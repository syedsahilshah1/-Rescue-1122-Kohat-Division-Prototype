import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { publicApi } from '../services/api';
import { Truck, Hospital as HospIcon, AlertTriangle, Navigation, Info, Shield } from 'lucide-react';

// Custom Marker Icons
const ambulanceIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1042/1042614.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const hospitalIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3225/3225133.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const incidentIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

// Component to handle map center updates
const RecenterMap = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            // First invalidate size to ensure map knows its current dimensions
            map.invalidateSize();
            // Then center the map
            map.setView(center, zoom || 14, { animate: true });

            // Re-invalidate after a short delay for good measure (handles late CSS/transitions)
            const timeout = setTimeout(() => map.invalidateSize(), 300);
            return () => clearTimeout(timeout);
        }
    }, [center, zoom, map]);
    return null;
};


const MapViewer = () => {
    const [center, setCenter] = useState([33.5889, 71.4429]); // Kohat
    const [userLoc, setUserLoc] = useState(null);
    const [zoom, setZoom] = useState(13);
    const [incidents, setIncidents] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [showTraffic, setShowTraffic] = useState(true);

    // Get User Location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error('Geo Loc Error:', err)
            );
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [incRes, vehRes, hospRes] = await Promise.all([
                    publicApi.getIncidents(),
                    publicApi.getVehicles(),
                    publicApi.getHospitals()
                ]);
                setIncidents(incRes.data);
                setVehicles(vehRes.data);
                setHospitals(hospRes.data);
            } catch (err) {
                console.error('Map Data Fail:', err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Live sync every 10s
        return () => clearInterval(interval);
    }, []);

    // Listen for "track" requests from other components via custom event
    useEffect(() => {
        const handleTrack = (e) => {
            const { lat, lng, zoom: newZoom } = e.detail;
            setCenter([lat, lng]);
            setZoom(newZoom || 16);
        };
        window.addEventListener('track-location', handleTrack);
        return () => window.removeEventListener('track-location', handleTrack);
    }, []);

    return (
        <div style={{ height: 'calc(100vh - 120px)', position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            {/* Map UI Overlay */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                    onClick={() => setShowTraffic(!showTraffic)}
                    className="glass-card"
                    style={{ padding: '0.75rem', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: showTraffic ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0,0,0,0.5)' }}
                >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: showTraffic ? '#10b981' : '#94a3b8' }}></div>
                    {showTraffic ? 'Live Traffic On' : 'Traffic Off'}
                </button>
                <div className="glass-card" style={{ padding: '0.75rem', fontSize: '0.7rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%' }}></div> Your Location
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px' }}></div> Congestion Area
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px' }}></div> Safe Route
                    </div>
                </div>
            </div>

            <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                <RecenterMap center={center} zoom={zoom} />

                {/* User Active Location Marker */}
                {userLoc && (
                    <>
                        <CircleMarker center={userLoc} radius={8} pathOptions={{ fillColor: 'var(--primary)', fillOpacity: 0.8, color: 'white', weight: 2 }}>
                            <Popup>You are here</Popup>
                        </CircleMarker>
                        {/* Interactive Routing Line (Simulated) */}
                        {center && (userLoc[0] !== center[0] || userLoc[1] !== center[1]) && (
                            <Polyline
                                positions={[userLoc, center]}
                                pathOptions={{ color: '#6366f1', weight: 4, dashArray: '10, 10', opacity: 0.6 }}
                            />
                        )}
                    </>
                )}

                {/* Simulated Traffic Circles (Danger zones) */}
                {showTraffic && (
                    <>
                        <Circle center={[33.5850, 71.4500]} radius={400} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }} />
                        <Circle center={[33.5750, 71.4400]} radius={300} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.1 }} />
                    </>
                )}

                {/* Hospital Markers */}
                {hospitals.map((hosp) => hosp.lat && (
                    <Marker
                        key={`hosp-${hosp.id}`}
                        position={[hosp.lat, hosp.lng]}
                        icon={hospitalIcon}
                        eventHandlers={{
                            click: () => {
                                setCenter([hosp.lat, hosp.lng]);
                                setZoom(17);
                            }
                        }}
                    >
                        <Popup>

                            <div style={{ padding: '0.5rem' }}>
                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary)' }}>{hosp.name}</h4>
                                <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <span>Beds: {hosp.beds_occupied}/{hosp.beds_total}</span>
                                    <span>Critical: {hosp.critical_cases}</span>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Vehicle Markers */}
                {vehicles.map((vh) => vh.lat && (
                    <Marker
                        key={`veh-${vh.id}`}
                        position={[vh.lat, vh.lng]}
                        icon={ambulanceIcon}
                        eventHandlers={{
                            click: () => {
                                setCenter([vh.lat, vh.lng]);
                                setZoom(17);
                            }
                        }}
                    >
                        <Popup>

                            <div style={{ width: '200px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 800 }}>{vh.unit_id}</span>
                                    <span style={{ fontSize: '0.7rem', background: '#10b981', padding: '1px 6px', borderRadius: '10px', color: 'white' }}>{vh.status}</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', borderTop: '1px solid #eee', paddingTop: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                                        <Shield size={14} color="var(--primary)" />
                                        <strong>Driver: {vh.driver_name}</strong>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                                        <Navigation size={14} />
                                        <span>{vh.driver_contact}</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Incident Markers */}
                {incidents.map((inc) => inc.lat && (
                    <Marker key={`inc-${inc.id}`} position={[inc.lat, inc.lng]} icon={incidentIcon}>
                        <Popup>
                            <div style={{ padding: '0.5rem' }}>
                                <strong style={{ color: '#ef4444' }}>{inc.type}</strong>
                                <p style={{ margin: '0.2rem 0', fontSize: '0.75rem' }}>{inc.location}</p>
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>Severity: {inc.severity}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapViewer;
