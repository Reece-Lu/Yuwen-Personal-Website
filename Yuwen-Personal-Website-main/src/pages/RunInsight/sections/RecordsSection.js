import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import styles from '../RunInsight.module.css';
import BarChart from '../components/BarChart';
import { useT } from '../i18n/LangContext';

const RUNS = [
    { id: 1, time: '19:14 – 19:47', dist: 4.38, dur: '33:06', pace: '7:33', cal: 292, type: 'indoor', hr: 133, elev: 14, seed: 7 },
    { id: 2, time: '18:59 – 19:51', dist: 4.19, dur: '51:56', pace: '12:24', cal: 423, type: 'indoor', hr: 121, elev: 6, seed: 13 },
    { id: 3, time: '19:57 – 20:32', dist: 3.46, dur: '34:35', pace: '9:59', cal: 245, type: 'outdoor', hr: 142, elev: 42, seed: 21 },
    { id: 4, time: '18:10 – 18:55', dist: 5.12, dur: '44:50', pace: '8:45', cal: 380, type: 'outdoor', hr: 138, elev: 38, seed: 29 },
];

function RunListCard({ run, active, onClick }) {
    const { t } = useT();
    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className={`${styles.solidCard} ${styles.runListItem} ${active ? styles.runListItemActive : ''}`}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Box sx={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: 'rgba(255,149,0,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <DirectionsRunRoundedIcon sx={{ fontSize: 22, color: '#FF9500' }} />
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{t(`runEntries.r${run.id}.day`)}</Box>
                        <Box sx={{ fontSize: 11.5, color: '#8E8E93' }}>{run.time}</Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.4 }}>
                            <HomeRoundedIcon sx={{ fontSize: 13, color: '#8E8E93' }} />
                            <Box sx={{ fontSize: 11.5, color: '#8E8E93', fontWeight: 600 }}>{t(`common.${run.type}`)}</Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ fontSize: 19, fontWeight: 700, color: '#1C1C1E', letterSpacing: -0.4 }}>{run.dist}</Box>
                    <Box sx={{ fontSize: 11, color: '#8E8E93', fontWeight: 600 }}>km</Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.6, paddingTop: 1.4, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                {[
                    { icon: <AccessTimeRoundedIcon sx={{ fontSize: 13 }} />, value: run.dur },
                    { icon: <SpeedRoundedIcon sx={{ fontSize: 13 }} />, value: `${run.pace} /km` },
                    { icon: <LocalFireDepartmentRoundedIcon sx={{ fontSize: 13 }} />, value: `${run.cal} kcal` },
                ].map((m, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.4, color: '#5A5A5C' }}>
                        {m.icon}
                        <Box sx={{ fontSize: 12, fontWeight: 600 }}>{m.value}</Box>
                    </Box>
                ))}
            </Box>
        </motion.div>
    );
}

function BigStat({ label, value, suffix, color }) {
    return (
        <Box>
            <Box sx={{ fontSize: 11, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 0.6 }}>
                <Box sx={{ fontSize: 24, fontWeight: 700, color: color || '#1C1C1E', letterSpacing: -0.6, lineHeight: 1 }}>{value}</Box>
                {suffix && <Box sx={{ fontSize: 12.5, color: '#8E8E93', fontWeight: 600 }}>{suffix}</Box>}
            </Box>
        </Box>
    );
}

export default function RecordsSection() {
    const { t } = useT();
    const [activeId, setActiveId] = useState(1);
    const active = RUNS.find(r => r.id === activeId);

    return (
        <section className={styles.section} id="records">
            <Box className={styles.sectionHeader}>
                <Box className={styles.sectionMarker}>{t('records.marker')}</Box>
                <h2 className={styles.sectionTitle}>{t('records.title')}</h2>
                <p className={styles.sectionSub}>{t('records.subtitle')}</p>
            </Box>

            <Box className={styles.recordsLayout}>
                {/* Left: run list */}
                <Box className={styles.runList}>
                    {RUNS.map((run) => (
                        <RunListCard
                            key={run.id}
                            run={run}
                            active={run.id === activeId}
                            onClick={() => setActiveId(run.id)}
                        />
                    ))}
                </Box>

                {/* Right: detail */}
                <Box className={`${styles.solidCard} ${styles.runDetailCard}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                                <Box>
                                    <Box sx={{ fontSize: 11.5, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>{t(`common.${active.type}`)} {t('records.runSuffix')}</Box>
                                    <Box sx={{ fontSize: 22, fontWeight: 700, color: '#1C1C1E', mt: 0.6, letterSpacing: -0.5 }}>{t(`runEntries.r${active.id}.day`)}</Box>
                                    <Box sx={{ fontSize: 12.5, color: '#8E8E93', mt: 0.4 }}>{active.time}</Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Box sx={{ fontSize: 40, fontWeight: 700, color: '#1C1C1E', letterSpacing: -1.5, lineHeight: 1 }}>{active.dist}</Box>
                                    <Box sx={{ fontSize: 12, color: '#8E8E93', fontWeight: 600 }}>{t('records.kilometers')}</Box>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, mt: 4, mb: 4 }}>
                                <BigStat label={t('records.duration')} value={active.dur} />
                                <BigStat label={t('records.pace')} value={active.pace} suffix={t('records.perKm')} />
                                <BigStat label={t('records.calories')} value={active.cal} suffix="kcal" />
                                <BigStat label={t('records.elevation')} value={active.elev} suffix={t('records.mGain')} />
                            </Box>

                            {/* Mini visual: pace + heart rate */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box sx={{ background: '#F2F2F7', borderRadius: '16px', padding: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
                                        <SpeedRoundedIcon sx={{ fontSize: 16, color: '#5AC8FA' }} />
                                        <Box sx={{ fontSize: 12.5, fontWeight: 700, color: '#1C1C1E' }}>{t('records.paceChart')}</Box>
                                        <Box sx={{ fontSize: 11, color: '#8E8E93', ml: 'auto' }}>{t('records.avg')} {active.pace} /km</Box>
                                    </Box>
                                    <BarChart color="#5AC8FA" seed={active.seed} bars={42} height={56} peakAt={0.45} />
                                </Box>
                                <Box sx={{ background: '#F2F2F7', borderRadius: '16px', padding: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
                                        <FavoriteRoundedIcon sx={{ fontSize: 16, color: '#FF3B30' }} />
                                        <Box sx={{ fontSize: 12.5, fontWeight: 700, color: '#1C1C1E' }}>{t('records.hrChart')}</Box>
                                        <Box sx={{ fontSize: 11, color: '#8E8E93', ml: 'auto' }}>{t('records.avg')} {active.hr} {t('records.bpm')}</Box>
                                    </Box>
                                    <BarChart color="#FF3B30" seed={active.seed + 5} bars={42} height={56} peakAt={0.55} />
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 3.5, color: '#FF9500', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                                <MapOutlinedIcon sx={{ fontSize: 16 }} />
                                {t('records.viewRoute')}
                                <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
                            </Box>
                        </motion.div>
                    </AnimatePresence>
                </Box>
            </Box>
        </section>
    );
}
