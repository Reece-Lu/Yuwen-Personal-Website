import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import styles from './RunInsight.module.css';
import { LangProvider, LangToggle, useT } from './i18n/LangContext';
import HeroVisual from './sections/HeroVisual';
import RunsSection from './sections/RunsSection';
import RecordsSection from './sections/RecordsSection';
import MetricsSection from './sections/MetricsSection';
import ShoesSection from './sections/ShoesSection';
import CoachSection from './sections/CoachSection';
import PrivacyTechSection from './sections/PrivacyTechSection';

const TECH = [
    { label: 'SwiftUI', color: '#3B86F6' },
    { label: 'SwiftData', color: '#FF6B00' },
    { label: 'HealthKit', color: '#FF3B30' },
    { label: 'MapKit', color: '#34C759' },
    { label: 'OpenAI', color: '#10A37F' },
    { label: 'Qwen', color: '#AF52DE' },
];

function RunInsightContent() {
    const { t } = useT();

    return (
        <div className={styles.page}>
            <LangToggle floating />

            {/* ───── HERO ───── */}
            <section className={styles.hero}>
                <Box className={styles.heroInner}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className={styles.eyebrow}>
                            <DirectionsRunRoundedIcon sx={{ fontSize: 14 }} />
                            {t('hero.eyebrow')}
                        </span>
                        <h1 className={styles.title}>RunInsight</h1>
                        <p className={styles.subtitle}>{t('hero.subtitle')}</p>
                        <Box className={styles.badges}>
                            {TECH.map((tech) => (
                                <motion.span key={tech.label} whileHover={{ y: -2 }} className={styles.badge}>
                                    <span className={styles.dot} style={{ background: tech.color }} />
                                    {tech.label}
                                </motion.span>
                            ))}
                        </Box>
                        <Box className={styles.ctas}>
                            <motion.a
                                whileTap={{ scale: 0.97 }}
                                href="https://github.com/Reece-Lu/RunInsight"
                                target="_blank" rel="noreferrer"
                                className={styles.btnPrimary}
                            >
                                <GitHubIcon sx={{ fontSize: 16 }} />
                                {t('hero.ctaGithub')}
                            </motion.a>
                            <motion.a
                                whileTap={{ scale: 0.97 }}
                                href="#runs"
                                className={styles.btnGhost}
                            >
                                {t('hero.ctaTour')}
                                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />
                            </motion.a>
                        </Box>
                    </motion.div>

                    <Box className={styles.heroVisual}>
                        <HeroVisual />
                    </Box>
                </Box>
            </section>

            <RunsSection />
            <RecordsSection />
            <MetricsSection />
            <ShoesSection />
            <CoachSection />
            <PrivacyTechSection />
        </div>
    );
}

export default function RunInsight() {
    return (
        <LangProvider>
            <RunInsightContent />
        </LangProvider>
    );
}
