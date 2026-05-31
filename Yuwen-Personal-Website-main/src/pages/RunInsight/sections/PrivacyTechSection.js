import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import styles from '../RunInsight.module.css';
import { useT } from '../i18n/LangContext';

const TECH = [
    { name: 'SwiftUI', color: '#3B86F6' },
    { name: 'SwiftData', color: '#FF6B00' },
    { name: 'HealthKit', color: '#FF3B30' },
    { name: 'MapKit', color: '#34C759' },
    { name: 'PhotosUI', color: '#AF52DE' },
    { name: 'Keychain', color: '#5AC8FA' },
    { name: 'OpenAI', color: '#10A37F' },
    { name: 'Qwen', color: '#FF9500' },
];

const GUARANTEE_ICONS = [
    <LockRoundedIcon sx={{ fontSize: 26, color: '#5AC8FA' }} />,
    <CloudOffRoundedIcon sx={{ fontSize: 26, color: '#FF9500' }} />,
    <ShieldRoundedIcon sx={{ fontSize: 26, color: '#34C759' }} />,
    <LanguageRoundedIcon sx={{ fontSize: 26, color: '#AF52DE' }} />,
];

export default function PrivacyTechSection() {
    const { t } = useT();
    const guarantees = t('privacy.items');
    const headline = t('cta.headline');

    return (
        <>
            {/* Privacy / Guarantees */}
            <section className={styles.section} id="privacy">
                <Box className={styles.sectionHeader}>
                    <Box className={styles.sectionMarker}>{t('privacy.marker')}</Box>
                    <h2 className={styles.sectionTitle}>{t('privacy.title')}</h2>
                    <p className={styles.sectionSub}>{t('privacy.subtitle')}</p>
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2.5,
                }}>
                    {guarantees.map((g, i) => (
                        <motion.div
                            key={g.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                            whileHover={{ y: -4 }}
                            className={styles.solidCard}
                            style={{ padding: 28, display: 'flex', gap: 18, alignItems: 'flex-start' }}
                        >
                            <Box sx={{
                                width: 52, height: 52, borderRadius: 16,
                                background: 'rgba(0,122,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                {GUARANTEE_ICONS[i]}
                            </Box>
                            <Box>
                                <Box sx={{ fontSize: 15, fontWeight: 700, color: '#1C1C1E', mb: 0.6 }}>{g.title}</Box>
                                <Box sx={{ fontSize: 13, color: '#6A6A6C', lineHeight: 1.6 }}>{g.text}</Box>
                            </Box>
                        </motion.div>
                    ))}
                </Box>
            </section>

            {/* Tech stack */}
            <section className={styles.section} id="tech" style={{ paddingTop: 40 }}>
                <Box className={styles.sectionHeader}>
                    <Box className={styles.sectionMarker}>{t('tech.marker')}</Box>
                    <h2 className={styles.sectionTitle}>{t('tech.title')}</h2>
                </Box>
                <Box className={styles.techGrid}>
                    {TECH.map((tech, i) => (
                        <motion.div
                            key={tech.name}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                            whileHover={{ y: -4 }}
                            className={styles.techCard}
                        >
                            <Box className={styles.techDot} sx={{ background: tech.color }} />
                            <Box sx={{ fontSize: 13.5, fontWeight: 700, color: '#1C1C1E' }}>{tech.name}</Box>
                            <Box sx={{ fontSize: 11, color: '#8E8E93', mt: 0.4 }}>{t(`tech.descs.${tech.name}`)}</Box>
                        </motion.div>
                    ))}
                </Box>
            </section>

            {/* Final CTA */}
            <section className={styles.section} style={{ paddingBottom: 100, paddingTop: 40 }}>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className={styles.ctaBanner}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: '#5AC8FA', textTransform: 'uppercase', mb: 2 }}>
                            {t('cta.eyebrow')}
                        </Box>
                        <Box sx={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.15, mb: 1.8, whiteSpace: 'pre-line' }}>
                            {headline}
                        </Box>
                        <Box sx={{ fontSize: 14.5, color: 'rgba(255,255,255,0.7)', maxWidth: 500, mx: 'auto', mb: 3.5, lineHeight: 1.55 }}>
                            {t('cta.sub')}
                        </Box>
                        <motion.a
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            href="https://github.com/Reece-Lu/RunInsight"
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                background: 'white',
                                color: '#1C1C1E',
                                padding: '14px 28px',
                                borderRadius: 999,
                                fontSize: 15,
                                fontWeight: 700,
                                textDecoration: 'none',
                                boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                            }}
                        >
                            <GitHubIcon sx={{ fontSize: 18 }} />
                            {t('cta.button')}
                        </motion.a>
                    </Box>
                </motion.div>
            </section>
        </>
    );
}
