import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import TerrainRoundedIcon from '@mui/icons-material/TerrainRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import HeightRoundedIcon from '@mui/icons-material/HeightRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import styles from '../RunInsight.module.css';
import BarChart from '../components/BarChart';
import { useT } from '../i18n/LangContext';

const METRICS = [
    { icon: <TerrainRoundedIcon />, color: '#34C759', bg: 'rgba(52,199,89,0.12)',
      key: 'elevation', value: '14', unitKey: 'mGain', range: '2 – 11 m', seed: 3, peak: 0.45 },
    { icon: <FavoriteRoundedIcon />, color: '#FF3B30', bg: 'rgba(255,59,48,0.12)',
      key: 'heartRate', value: '133', unitKey: 'avgBpm', range: '65 – 165', seed: 7, peak: 0.55 },
    { icon: <SpeedRoundedIcon />, color: '#5AC8FA', bg: 'rgba(90,200,250,0.12)',
      key: 'pace', value: '7:21', unitKey: 'perKm', range: '4:29 – 9:18', seed: 11, peak: 0.4 },
    { icon: <BoltRoundedIcon />, color: '#FF9500', bg: 'rgba(255,149,0,0.12)',
      key: 'power', value: '191', unitKey: 'avgW', range: '55 – 247', seed: 15, peak: 0.5 },
    { icon: <RestartAltRoundedIcon />, color: '#AF52DE', bg: 'rgba(175,82,222,0.12)',
      key: 'cadence', value: '159', unitKey: 'avgSpm', range: '23 – 374', seed: 19, peak: 0.3 },
    { icon: <HeightRoundedIcon />, color: '#0066D6', bg: 'rgba(0,102,214,0.12)',
      key: 'vo', value: '9.3', unitKey: 'avgCm', range: '7.7 – 10.3', seed: 23, peak: 0.55 },
    { icon: <HourglassEmptyRoundedIcon />, color: '#FF9500', bg: 'rgba(255,149,0,0.12)',
      key: 'gct', value: '259', unitKey: 'avgMs', range: '214 – 311', seed: 27, peak: 0.6 },
    { icon: <StraightenRoundedIcon />, color: '#007AFF', bg: 'rgba(0,122,255,0.12)',
      key: 'stride', value: '1.18', unitKey: 'avgM', range: '0.84 – 1.52', seed: 31, peak: 0.5 },
    { icon: <LocalFireDepartmentRoundedIcon />, color: '#FF3B30', bg: 'rgba(255,59,48,0.12)',
      key: 'calories', value: '292', unitKey: 'kcal', rangeKey: 'perSession', seed: 35, peak: 0.5 },
];

function BigMetric({ m, i }) {
    const { t } = useT();
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={`${styles.solidCard} ${styles.bigMetricCard}`}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box sx={{
                        width: 40, height: 40, borderRadius: 12,
                        background: m.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {React.cloneElement(m.icon, { sx: { fontSize: 22, color: m.color } })}
                    </Box>
                    <Box sx={{ fontSize: 13.5, fontWeight: 700, color: '#1C1C1E' }}>{t(`metrics.items.${m.key}`)}</Box>
                </Box>
                <Box sx={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 600 }}>{m.rangeKey ? t(`metrics.${m.rangeKey}`) : m.range}</Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6 }}>
                <Box sx={{ fontSize: 28, fontWeight: 700, color: '#1C1C1E', letterSpacing: -0.8, lineHeight: 1 }}>{m.value}</Box>
                <Box sx={{ fontSize: 12.5, color: '#8E8E93', fontWeight: 600 }}>{t(`metrics.units.${m.unitKey}`)}</Box>
            </Box>

            <BarChart color={m.color} seed={m.seed} bars={56} height={64} peakAt={m.peak} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#C7C7CC', fontWeight: 600 }}>
                <span>0:00</span>
                <span>{t('metrics.elapsed')}</span>
            </Box>
        </motion.div>
    );
}

export default function MetricsSection() {
    const { t } = useT();
    return (
        <section className={styles.section} id="metrics">
            <Box className={styles.sectionHeader}>
                <Box className={styles.sectionMarker}>{t('metrics.marker')}</Box>
                <h2 className={styles.sectionTitle}>{t('metrics.title')}</h2>
                <p className={styles.sectionSub}>{t('metrics.subtitle')}</p>
            </Box>
            <Box className={styles.metricsGrid}>
                {METRICS.map((m, i) => <BigMetric key={m.key} m={m} i={i} />)}
            </Box>
        </section>
    );
}
