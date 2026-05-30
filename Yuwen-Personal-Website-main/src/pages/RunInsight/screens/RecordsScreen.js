import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import BarChart from '../components/BarChart';

const runs = [
    { id: 1, day: 'Sunday', date: 'May 17', time: '19:14 – 19:47', dist: 4.38, dur: '33:06', pace: '7:33', cal: 292, type: 'Indoor' },
    { id: 2, day: 'Saturday', date: 'May 9', time: '18:59 – 19:51', dist: 4.19, dur: '51:56', pace: '12:24', cal: 423, type: 'Indoor' },
    { id: 3, day: 'Thursday', date: 'May 7', time: '19:57 – 20:32', dist: 3.46, dur: '34:35', pace: '9:59', cal: 245, type: 'Outdoor' },
    { id: 4, day: 'Tuesday', date: 'May 5', time: '18:10 – 18:55', dist: 5.12, dur: '44:50', pace: '8:45', cal: 380, type: 'Outdoor' },
];

const shoesList = ['No shoes assigned', 'Nike Pegasus 42', 'Nike Pegasus Plus', 'Nike ZoomX Vaporfly Next% 3'];

function ShoesAssigner({ runId }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState('No shoes assigned');
    return (
        <Box sx={{ position: 'relative', mt: 1 }}>
            <motion.div
                whileHover={{ x: 2 }}
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                style={{
                    color: '#FF9500',
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    cursor: 'pointer',
                }}
            >
                {current}
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 14 }} />
            </motion.div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        style={{
                            position: 'absolute',
                            top: '110%',
                            left: -8,
                            background: 'rgba(255,255,255,0.97)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: 10,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                            zIndex: 40,
                            minWidth: 170,
                            overflow: 'hidden',
                        }}
                    >
                        {shoesList.map((s) => (
                            <div
                                key={s}
                                onClick={(e) => { e.stopPropagation(); setCurrent(s); setOpen(false); }}
                                style={{
                                    padding: '9px 12px',
                                    fontSize: 12,
                                    color: s === current ? '#007AFF' : '#1C1C1E',
                                    fontWeight: s === current ? 700 : 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                }}
                            >
                                {s === current && <span style={{ color: '#007AFF' }}>✓</span>}
                                <span style={{ marginLeft: s === current ? 0 : 14 }}>{s}</span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </Box>
    );
}

function RunCard({ run, onOpen }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.07)' }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onOpen(run)}
            style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 14,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                marginBottom: 10,
                cursor: 'pointer',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
                    <Box sx={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,149,0,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <DirectionsRunRoundedIcon sx={{ fontSize: 18, color: '#FF9500' }} />
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{run.day}, {run.date}</Box>
                        <Box sx={{ fontSize: 11, color: '#8E8E93' }}>{run.time}</Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.3 }}>
                            <HomeRoundedIcon sx={{ fontSize: 11, color: '#8E8E93' }} />
                            <Box sx={{ fontSize: 11, color: '#8E8E93' }}>{run.type}</Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ fontSize: 19, fontWeight: 800, color: '#1C1C1E' }}>{run.dist} km</Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, paddingX: 0.5 }}>
                {[
                    { icon: <AccessTimeRoundedIcon sx={{ fontSize: 11 }} />, label: 'Duration', value: run.dur },
                    { icon: <SpeedRoundedIcon sx={{ fontSize: 11 }} />, label: 'Pace', value: `${run.pace} /km` },
                    { icon: <LocalFireDepartmentRoundedIcon sx={{ fontSize: 11 }} />, label: 'Burn', value: `${run.cal} kcal` },
                ].map((m, i) => (
                    <Box key={i}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, color: '#8E8E93' }}>
                            {m.icon}
                            <Box sx={{ fontSize: 10.5 }}>{m.label}</Box>
                        </Box>
                        <Box sx={{ fontSize: 12.5, fontWeight: 700, color: '#1C1C1E', mt: 0.2 }}>{m.value}</Box>
                    </Box>
                ))}
            </Box>

            <ShoesAssigner runId={run.id} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, paddingTop: 1, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: '#FF9500', fontSize: 11.5, fontWeight: 600 }}>
                    <MapOutlinedIcon sx={{ fontSize: 14 }} />
                    View Route and Details
                </Box>
                <ChevronRightRoundedIcon sx={{ fontSize: 16, color: '#C7C7CC' }} />
            </Box>
        </motion.div>
    );
}

function MetricSection({ icon, iconColor, iconBg, title, sub, rangeLabel, color, seed, peakAt }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45 }}
            style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 12,
                marginBottom: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {React.cloneElement(icon, { sx: { fontSize: 14, color: iconColor } })}
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E', lineHeight: 1 }}>{title}</Box>
                        <Box sx={{ fontSize: 11, color, fontWeight: 600, mt: 0.4 }}>{sub}</Box>
                    </Box>
                </Box>
                <Box sx={{ fontSize: 10, color: '#8E8E93' }}>{rangeLabel}</Box>
            </Box>
            <BarChart color={color} seed={seed} peakAt={peakAt} height={48} bars={56} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Box sx={{ fontSize: 9, color: '#C7C7CC' }}>0:00</Box>
                <Box sx={{ fontSize: 9, color: '#C7C7CC' }}>Elapsed: 23:52</Box>
            </Box>
        </motion.div>
    );
}

function DetailView({ run, onBack }) {
    return (
        <motion.div
            key="detail"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '8px 16px 90px' }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={onBack}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer',
                    }}
                >
                    <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 22, color: '#1C1C1E' }} />
                </motion.div>
                <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{run.dist} km</Box>
                <Box sx={{ width: 32 }} />
            </Box>

            <Box sx={{ fontSize: 22, fontWeight: 800, color: '#1C1C1E', mb: 1.2, letterSpacing: -0.3 }}>Performance</Box>

            <MetricSection
                icon={<TerrainRoundedIcon />}
                iconColor="#34C759" iconBg="rgba(52,199,89,0.15)"
                title="Elevation" sub="14 m gain" rangeLabel="2 – 11 m"
                color="#34C759" seed={3} peakAt={0.45}
            />
            <MetricSection
                icon={<FavoriteRoundedIcon />}
                iconColor="#FF3B30" iconBg="rgba(255,59,48,0.15)"
                title="Heart Rate" sub="Average 133 bpm" rangeLabel="65 – 165"
                color="#FF3B30" seed={7} peakAt={0.55}
            />
            <MetricSection
                icon={<SpeedRoundedIcon />}
                iconColor="#007AFF" iconBg="rgba(0,122,255,0.15)"
                title="Pace" sub="Average 7:21 /km" rangeLabel="4:29 – 9:18"
                color="#5AC8FA" seed={11} peakAt={0.4}
            />
            <MetricSection
                icon={<BoltRoundedIcon />}
                iconColor="#FF9500" iconBg="rgba(255,149,0,0.15)"
                title="Power" sub="Average 191 W" rangeLabel="55 – 247"
                color="#FFCC00" seed={15} peakAt={0.5}
            />
            <MetricSection
                icon={<RestartAltRoundedIcon />}
                iconColor="#AF52DE" iconBg="rgba(175,82,222,0.15)"
                title="Cadence" sub="Average 159 spm" rangeLabel="23 – 374"
                color="#AF52DE" seed={19} peakAt={0.3}
            />
            <MetricSection
                icon={<HeightRoundedIcon />}
                iconColor="#5AC8FA" iconBg="rgba(90,200,250,0.15)"
                title="Vertical Oscillation" sub="Average 9.3 cm" rangeLabel="7.7 – 10.3"
                color="#5AC8FA" seed={23} peakAt={0.55}
            />
            <MetricSection
                icon={<HourglassEmptyRoundedIcon />}
                iconColor="#FF9500" iconBg="rgba(255,149,0,0.15)"
                title="Ground Contact Time" sub="Average 259 ms" rangeLabel="214 – 311"
                color="#FF9500" seed={27} peakAt={0.6}
            />
        </motion.div>
    );
}

function ListView({ onOpen }) {
    return (
        <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '8px 16px 90px' }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer',
                    }}
                >
                    <RefreshRoundedIcon sx={{ fontSize: 18, color: '#1C1C1E' }} />
                </motion.div>
            </Box>
            <Box sx={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', mb: 1.2, letterSpacing: -0.5 }}>Records</Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                <Box sx={{ fontSize: 15, fontWeight: 700, color: '#1C1C1E' }}>Synced Runs</Box>
                <Box sx={{ fontSize: 10.5, color: '#8E8E93' }}>Auto-detect outdoor/indoor</Box>
            </Box>
            {runs.map((r) => (
                <RunCard key={r.id} run={r} onOpen={onOpen} />
            ))}
        </motion.div>
    );
}

export default function RecordsScreen() {
    const [selected, setSelected] = useState(null);
    return (
        <AnimatePresence mode="wait">
            {selected
                ? <DetailView key="d" run={selected} onBack={() => setSelected(null)} />
                : <ListView key="l" onOpen={setSelected} />}
        </AnimatePresence>
    );
}
