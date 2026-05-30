import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import styles from '../RunInsight.module.css';
import CountUp from '../components/CountUp';
import { useT } from '../i18n/LangContext';

const RANGES = ['Week', 'Month', 'Year', 'All'];
const TYPES = ['All', 'Outdoor', 'Indoor'];

const DATA = {
    Week:  { dist: 5.42,   dur: '0:48:12',   pace: '8:54', cal: 412,   runs: 2 },
    Month: { dist: 19.96,  dur: '2:44:14',   pace: '8:14', cal: 1460,  runs: 5 },
    Year:  { dist: 128.40, dur: '17:22:08',  pace: '8:08', cal: 9430,  runs: 32 },
    All:   { dist: 254.70, dur: '34:51:00',  pace: '8:12', cal: 18920, runs: 64 },
};

function FilterGroup({ groupId, label, options, value, onChange, labelFor }) {
    return (
        <Box className={styles.filterGroup}>
            <Box sx={{ alignSelf: 'center', px: 1.4, fontSize: 12, color: '#8E8E93', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {label}
            </Box>
            {options.map((opt) => (
                <motion.button
                    key={opt}
                    whileTap={{ scale: 0.94 }}
                    className={`${styles.filterChip} ${value === opt ? styles.filterChipActive : ''}`}
                    onClick={() => onChange(opt)}
                >
                    {value === opt && (
                        <motion.span
                            layoutId={`pill-${groupId}`}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'white',
                                borderRadius: 999,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                zIndex: -1,
                            }}
                        />
                    )}
                    {labelFor(opt)}
                </motion.button>
            ))}
        </Box>
    );
}

function MetricCard({ icon, color, bg, label, value, suffix, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className={`${styles.solidCard} ${styles.metricCard}`}
        >
            <Box className={styles.metricIcon} sx={{ background: bg }}>
                {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
            </Box>
            <Box className={styles.metricLabel}>{label}</Box>
            <Box className={styles.metricValue}>
                {value}
                {suffix && <Box component="span" className={styles.metricValueSub}>{suffix}</Box>}
            </Box>
        </motion.div>
    );
}

export default function RunsSection() {
    const { t } = useT();
    const [range, setRange] = useState('Month');
    const [type, setType] = useState('All');
    const d = DATA[range];

    const rangeLabel = range === 'All' ? t('runs.allTime') : `${t('runs.lastWord')} ${t(`runs.ranges.${range}`)}`;
    const typeLabel = t(`runs.types.${type}`);

    return (
        <section className={styles.section} id="runs">
            <Box className={styles.sectionHeader}>
                <Box className={styles.sectionMarker}>{t('runs.marker')}</Box>
                <h2 className={styles.sectionTitle}>{t('runs.title')}</h2>
                <p className={styles.sectionSub}>{t('runs.subtitle')}</p>
            </Box>

            <Box className={styles.filtersRow}>
                <FilterGroup groupId="range" label={t('runs.rangeLabel')} options={RANGES} value={range} onChange={setRange} labelFor={(o) => t(`runs.ranges.${o}`)} />
                <FilterGroup groupId="type" label={t('runs.typeLabel')} options={TYPES} value={type} onChange={setType} labelFor={(o) => t(`runs.types.${o}`)} />
            </Box>

            <Box className={styles.runsLayout}>
                {/* Big distance card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6 }}
                    className={`${styles.glassCard} ${styles.distanceCard}`}
                >
                    <Box className={styles.distanceLabel}>{rangeLabel} · {typeLabel}</Box>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={range + type}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className={styles.distanceNumber}
                        >
                            <CountUp end={d.dist} decimals={2} duration={1} />
                            <Box component="span" className={styles.distanceUnit}>km</Box>
                        </motion.div>
                    </AnimatePresence>
                    <Box className={styles.distanceSub}>{t('runs.subLine', { runs: d.runs, dur: d.dur })}</Box>

                    {/* Decorative runner */}
                    <motion.div
                        animate={{ y: [0, -6, 0], rotate: [0, -4, 4, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute',
                            top: 30, right: 30,
                            width: 72, height: 72,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF9F45, #FF6B00)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 14px 30px rgba(255,107,0,0.32)',
                        }}
                    >
                        <DirectionsRunRoundedIcon sx={{ fontSize: 40, color: 'white' }} />
                    </motion.div>
                </motion.div>

                {/* 4 metric cards */}
                <Box className={styles.metricGrid}>
                    <MetricCard icon={<AccessTimeRoundedIcon />} color="#007AFF" bg="rgba(0,122,255,0.12)"
                        label={t('runs.mDuration')} value={d.dur} delay={0.05} />
                    <MetricCard icon={<SpeedRoundedIcon />} color="#34C759" bg="rgba(52,199,89,0.12)"
                        label={t('runs.mPace')} value={d.pace} suffix={t('runs.perKm')} delay={0.1} />
                    <MetricCard icon={<LocalFireDepartmentRoundedIcon />} color="#FF3B30" bg="rgba(255,59,48,0.12)"
                        label={t('runs.mCalories')} value={d.cal.toLocaleString()} suffix={t('runs.kcal')} delay={0.15} />
                    <MetricCard icon={<ListAltRoundedIcon />} color="#AF52DE" bg="rgba(175,82,222,0.12)"
                        label={t('runs.mRunCount')} value={d.runs} suffix={t('runs.runsUnit')} delay={0.2} />
                </Box>
            </Box>

            {/* Map */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className={styles.mapBox}
            >
                <svg viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {/* Water */}
                    <path d="M0 220 Q150 200 300 230 T600 240 L600 320 L0 320 Z" fill="#9FC5E8" opacity="0.55" />
                    <path d="M0 0 L0 130 Q200 110 350 80 T700 60 L1200 0 Z" fill="#B3D5E8" opacity="0.4" />
                    {/* Parks */}
                    <ellipse cx="200" cy="90" rx="120" ry="50" fill="#A3D9A5" opacity="0.5" />
                    <ellipse cx="950" cy="150" rx="140" ry="65" fill="#A3D9A5" opacity="0.45" />
                    <ellipse cx="600" cy="80" rx="60" ry="30" fill="#A3D9A5" opacity="0.4" />
                    {/* Roads */}
                    <path d="M0 190 L1200 175" stroke="white" strokeWidth="2" opacity="0.7" />
                    <path d="M0 250 L1200 245" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    <path d="M280 0 L300 320" stroke="white" strokeWidth="1.5" opacity="0.65" />
                    <path d="M620 0 L640 320" stroke="white" strokeWidth="1.5" opacity="0.65" />
                    <path d="M880 0 L900 320" stroke="white" strokeWidth="1.5" opacity="0.6" />
                    {/* Labels */}
                    <text x="280" y="160" fontSize="14" fill="#3A3A3C" fontWeight="700">Vancouver</text>
                    <text x="290" y="100" fontSize="11" fill="#5A5A5C">North Vancouver</text>
                    <text x="650" y="200" fontSize="12" fill="#5A5A5C">Coquitlam</text>
                    <text x="900" y="220" fontSize="11" fill="#5A5A5C">Maple Ridge</text>
                    <text x="370" y="280" fontSize="11" fill="#5A5A5C">Richmond</text>
                </svg>
                {/* Pin */}
                <Box sx={{ position: 'absolute', top: '52%', left: '30%' }}>
                    <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.45, 0, 0.45] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                        style={{
                            position: 'absolute', inset: -18,
                            borderRadius: '50%',
                            background: '#007AFF',
                        }}
                    />
                    <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'relative',
                            width: 44, height: 44, borderRadius: '50%',
                            background: '#007AFF',
                            border: '5px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(0,122,255,0.4)',
                        }}
                    >
                        <DirectionsRunRoundedIcon sx={{ fontSize: 22, color: 'white' }} />
                    </motion.div>
                </Box>
                {/* Secondary pins */}
                <Box sx={{ position: 'absolute', top: '38%', left: '62%' }}>
                    <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0, 0.35] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
                        style={{
                            position: 'absolute', inset: -12,
                            borderRadius: '50%',
                            background: '#34C759',
                        }}
                    />
                    <Box sx={{
                        position: 'relative',
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#34C759',
                        border: '3px solid white',
                        boxShadow: '0 4px 10px rgba(52,199,89,0.4)',
                    }} />
                </Box>
                <Box sx={{ position: 'absolute', top: '60%', left: '78%' }}>
                    <Box sx={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: '#FF9500',
                        border: '3px solid white',
                        boxShadow: '0 4px 10px rgba(255,149,0,0.4)',
                    }} />
                </Box>
                {/* Caption */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 18, left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    padding: '6px 14px',
                    borderRadius: 999,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#1C1C1E',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                }}>
                    {t('runs.mapCaption')}
                </Box>
            </motion.div>
        </section>
    );
}
