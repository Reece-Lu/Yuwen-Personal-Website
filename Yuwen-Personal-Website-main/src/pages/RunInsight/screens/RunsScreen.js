import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CountUp from '../components/CountUp';
import MetricChip from '../components/MetricChip';

const ranges = ['Week', 'Month', 'Year', 'All'];
const types = ['All', 'Outdoor', 'Indoor'];

const data = {
    Week:   { dist: 5.42,  dur: '0:48:12', pace: '8:54', cal: 412,  runs: 2 },
    Month:  { dist: 19.96, dur: '2:44:14', pace: '8:14', cal: 1460, runs: 5 },
    Year:   { dist: 128.4, dur: '17:22:08', pace: '8:08', cal: 9430, runs: 32 },
    All:    { dist: 254.7, dur: '34:51:00', pace: '8:12', cal: 18920, runs: 64 },
};

function Dropdown({ label, value, options, color, onSelect }) {
    const [open, setOpen] = useState(false);
    return (
        <Box sx={{ position: 'relative' }}>
            <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setOpen(!open)}
                style={{
                    background: 'rgba(0,122,255,0.08)',
                    color,
                    border: 'none',
                    borderRadius: 8,
                    padding: '5px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                }}
            >
                <Box component="span" sx={{ fontSize: 11, opacity: 0.85 }}>{label}:</Box>
                <Box component="span">{value}</Box>
                <ExpandMoreRoundedIcon sx={{ fontSize: 14 }} />
            </motion.button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            position: 'absolute',
                            top: '110%',
                            left: 0,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: 10,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            zIndex: 30,
                            minWidth: 100,
                            overflow: 'hidden',
                        }}
                    >
                        {options.map((opt) => (
                            <div
                                key={opt}
                                onClick={() => { onSelect(opt); setOpen(false); }}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: 12,
                                    color: opt === value ? color : '#1C1C1E',
                                    fontWeight: opt === value ? 700 : 500,
                                    cursor: 'pointer',
                                    background: opt === value ? 'rgba(0,122,255,0.06)' : 'transparent',
                                }}
                            >
                                {opt}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}

export default function RunsScreen() {
    const [range, setRange] = useState('Month');
    const [type, setType] = useState('All');
    const d = data[range];

    return (
        <Box sx={{ padding: '8px 16px 90px', fontFamily: 'inherit' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                    }}
                >
                    <RefreshRoundedIcon sx={{ fontSize: 18, color: '#1C1C1E' }} />
                </motion.div>
            </Box>
            <Box sx={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', mb: 1.2, letterSpacing: -0.5 }}>RunInsight</Box>

            {/* Filter Chips */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <Dropdown label="Range" value={range} options={ranges} color="#007AFF" onSelect={setRange} />
                <Dropdown label="Type" value={type} options={types} color="#007AFF" onSelect={setType} />
            </Box>

            {/* Distance Card */}
            <motion.div
                key={range + type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    padding: 14,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    marginBottom: 10,
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Box sx={{ fontSize: 11.5, color: '#8E8E93', mb: 0.3 }}>Last {range}</Box>
                        <Box sx={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', lineHeight: 1.1 }}>
                            <CountUp end={d.dist} decimals={2} /> km
                        </Box>
                        <Box sx={{ fontSize: 11, color: '#8E8E93', mt: 0.3 }}>Total Distance</Box>
                    </Box>
                    <motion.div
                        whileHover={{ scale: 1.08, rotate: -8 }}
                        whileTap={{ scale: 0.92 }}
                        style={{
                            width: 38, height: 38, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF9F45, #FF6B00)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(255,107,0,0.3)',
                        }}
                    >
                        <DirectionsRunRoundedIcon sx={{ fontSize: 22, color: 'white' }} />
                    </motion.div>
                </Box>

                {/* Sub Metrics */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.5 }}>
                    <MetricChip
                        icon={<AccessTimeRoundedIcon sx={{ fontSize: 14 }} />}
                        color="#007AFF" bg="rgba(0,122,255,0.15)"
                        label="Total Duration" value={d.dur} delay={0.05}
                    />
                    <MetricChip
                        icon={<SpeedRoundedIcon sx={{ fontSize: 14 }} />}
                        color="#34C759" bg="rgba(52,199,89,0.15)"
                        label="Average Pace" value={`${d.pace} /km`} delay={0.1}
                    />
                    <MetricChip
                        icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 14 }} />}
                        color="#FF3B30" bg="rgba(255,59,48,0.15)"
                        label="Calories" value={`${d.cal} kcal`} delay={0.15}
                    />
                    <MetricChip
                        icon={<ListAltRoundedIcon sx={{ fontSize: 14 }} />}
                        color="#AF52DE" bg="rgba(175,82,222,0.15)"
                        label="Run Count" value={`${d.runs} runs`} delay={0.2}
                    />
                </Box>
            </motion.div>

            {/* Map Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 1.5, mb: 0.8 }}>
                <Box sx={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E' }}>Run Start Points</Box>
                <Box sx={{ fontSize: 11, color: '#8E8E93' }}>Follows filters</Box>
            </Box>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    height: 170,
                    borderRadius: 14,
                    overflow: 'hidden',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #DDF0E0 0%, #C7E5D0 30%, #BFD7E8 60%, #A8C8E0 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                {/* Stylized map: water + roads */}
                <svg viewBox="0 0 200 140" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {/* Water bodies */}
                    <path d="M0 80 Q30 70 60 85 T120 90 L120 140 L0 140 Z" fill="#9FC5E8" opacity="0.6" />
                    <path d="M0 0 L0 50 Q40 45 70 30 T140 20 L200 0 Z" fill="#B3D5E8" opacity="0.4" />
                    {/* Green park areas */}
                    <ellipse cx="40" cy="30" rx="35" ry="20" fill="#A3D9A5" opacity="0.5" />
                    <ellipse cx="170" cy="55" rx="30" ry="25" fill="#A3D9A5" opacity="0.45" />
                    {/* Roads */}
                    <path d="M0 70 L200 65" stroke="white" strokeWidth="1" opacity="0.7" />
                    <path d="M50 0 L55 140" stroke="white" strokeWidth="0.8" opacity="0.6" />
                    <path d="M120 0 L125 140" stroke="white" strokeWidth="0.8" opacity="0.6" />
                    <path d="M0 100 L200 110" stroke="white" strokeWidth="0.8" opacity="0.6" />
                    {/* City labels */}
                    <text x="55" y="60" fontSize="6" fill="#5A5A5A" fontWeight="600">North Vancouver</text>
                    <text x="50" y="82" fontSize="7" fill="#3A3A3A" fontWeight="700">Vancouver</text>
                    <text x="140" y="78" fontSize="5.5" fill="#5A5A5A">Coquitlam</text>
                    <text x="170" y="95" fontSize="5.5" fill="#5A5A5A">Maple Ridge</text>
                    <text x="60" y="115" fontSize="5.5" fill="#5A5A5A">Richmond</text>
                </svg>

                {/* Pulsing pin */}
                <Box sx={{ position: 'absolute', top: '42%', left: '46%', transform: 'translate(-50%,-50%)' }}>
                    <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            inset: -10,
                            borderRadius: '50%',
                            background: '#007AFF',
                            zIndex: 0,
                        }}
                    />
                    <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            position: 'relative',
                            width: 28, height: 28, borderRadius: '50%',
                            background: '#007AFF',
                            border: '3px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,122,255,0.4)',
                            zIndex: 1,
                        }}
                    >
                        <DirectionsRunRoundedIcon sx={{ fontSize: 14, color: 'white' }} />
                    </motion.div>
                </Box>

                {/* Date label */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: '#1C1C1E',
                }}>
                    May 3, 2026
                </Box>
            </motion.div>
        </Box>
    );
}
