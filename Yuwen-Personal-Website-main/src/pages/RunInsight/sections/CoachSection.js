import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import styles from '../RunInsight.module.css';
import { useT } from '../i18n/LangContext';

const PROVIDERS = ['OpenAI', 'Qwen'];

function renderBold(text) {
    return text.split(/\*\*/).map((part, i) =>
        i % 2 === 1 ? <strong key={i} style={{ color: '#007AFF' }}>{part}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
    );
}

function TypeWriter({ text, speed = 14 }) {
    const [shown, setShown] = useState('');
    useEffect(() => {
        setShown('');
        let i = 0;
        const id = setInterval(() => {
            i++;
            setShown(text.slice(0, i));
            if (i >= text.length) clearInterval(id);
        }, speed);
        return () => clearInterval(id);
    }, [text, speed]);
    return (
        <span>
            {shown}
            {shown.length < text.length && (
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>|</motion.span>
            )}
        </span>
    );
}

export default function CoachSection() {
    const { t, lang } = useT();
    const [provider, setProvider] = useState('OpenAI');
    const [state, setState] = useState('idle'); // idle | analyzing | done

    const handleAnalyze = () => {
        setState('analyzing');
        setTimeout(() => setState('done'), 800);
    };

    const handleProviderSwitch = (p) => {
        setProvider(p);
        if (state === 'done') {
            setState('analyzing');
            setTimeout(() => setState('done'), 600);
        }
    };

    return (
        <section className={styles.section} id="coach">
            <Box className={styles.sectionHeader}>
                <Box className={styles.sectionMarker}>{t('coach.marker')}</Box>
                <h2 className={styles.sectionTitle}>{t('coach.title')}</h2>
                <p className={styles.sectionSub}>{t('coach.subtitle')}</p>
            </Box>

            <Box className={styles.coachLayout}>
                {/* Left: provider + run context */}
                <Box>
                    <Box className={`${styles.solidCard}`} sx={{ padding: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleRoundedIcon sx={{ fontSize: 22, color: '#34C759' }} />
                                <Box>
                                    <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{provider} {t('coach.apiSuffix')}</Box>
                                    <Box sx={{ fontSize: 11.5, color: '#8E8E93' }}>{t('coach.keyStored')}</Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                background: 'rgba(0,122,255,0.10)',
                                color: '#007AFF', padding: '6px 14px', borderRadius: 16,
                                fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                            }}>
                                {t('coach.manage')}
                            </Box>
                        </Box>

                        <Box className={styles.providerToggle}>
                            {PROVIDERS.map((p) => (
                                <motion.button
                                    key={p}
                                    onClick={() => handleProviderSwitch(p)}
                                    whileTap={{ scale: 0.97 }}
                                    className={`${styles.providerBtn} ${provider === p ? styles.providerBtnActive : ''}`}
                                >
                                    {provider === p && (
                                        <motion.span
                                            layoutId="provider-pill"
                                            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                            style={{
                                                position: 'absolute', inset: 0,
                                                background: 'white',
                                                borderRadius: 10,
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                                zIndex: -1,
                                            }}
                                        />
                                    )}
                                    {p}
                                </motion.button>
                            ))}
                        </Box>

                        {/* Selected run */}
                        <Box sx={{ fontSize: 12.5, fontWeight: 700, color: '#1C1C1E', mb: 1 }}>{t('coach.selectedRun')}</Box>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            color: '#007AFF', fontSize: 13, fontWeight: 600,
                            mb: 2, cursor: 'pointer',
                        }}>
                            {t('coach.runDate')} · 4.38 km · 7:33 /km
                            <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.2 }}>
                            {[
                                { icon: <AccessTimeRoundedIcon sx={{ fontSize: 14, color: '#007AFF' }} />, label: t('coach.duration'), value: '33:06' },
                                { icon: <SpeedRoundedIcon sx={{ fontSize: 14, color: '#34C759' }} />, label: t('coach.pace'), value: '7:33 /km' },
                                { icon: <HomeRoundedIcon sx={{ fontSize: 14, color: '#FF9500' }} />, label: t('coach.type'), value: t('coach.indoor') },
                                { icon: <PetsRoundedIcon sx={{ fontSize: 14, color: '#AF52DE' }} />, label: t('coach.shoes'), value: t('coach.unassigned') },
                            ].map((m, i) => (
                                <Box key={i} sx={{ background: '#F2F2F7', borderRadius: '12px', padding: '10px 12px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {m.icon}
                                        <Box sx={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 600 }}>{m.label}</Box>
                                    </Box>
                                    <Box sx={{ fontSize: 13.5, fontWeight: 700, color: '#1C1C1E', mt: 0.4 }}>{m.value}</Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Privacy note */}
                    <Box sx={{
                        mt: 2, padding: '14px 16px',
                        background: 'rgba(0,122,255,0.06)',
                        border: '1px solid rgba(0,122,255,0.16)',
                        borderRadius: '16px',
                        display: 'flex', gap: 1.4, alignItems: 'flex-start',
                    }}>
                        <Box sx={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(0,122,255,0.18)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <ShieldRoundedIcon sx={{ fontSize: 16, color: '#007AFF' }} />
                        </Box>
                        <Box sx={{ fontSize: 12.5, color: '#1C1C1E', lineHeight: 1.5 }}>
                            {t('coach.privacyNote')}
                        </Box>
                    </Box>

                    {/* Analyze button */}
                    <Box sx={{ mt: 2 }}>
                        <motion.button
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            className={styles.analyzeBtn}
                        >
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />
                            {state === 'analyzing' ? t('coach.analyzing') : state === 'done' ? t('coach.reanalyze') : t('coach.analyze')}
                        </motion.button>
                    </Box>
                </Box>

                {/* Right: chat */}
                <Box className={`${styles.solidCard}`} sx={{ padding: 3, minHeight: 360, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, paddingBottom: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                        <Box sx={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF9F45, #FF6B00)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: 'white' }} />
                        </Box>
                        <Box>
                            <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{t('coach.coachName')}</Box>
                            <Box sx={{ fontSize: 11.5, color: '#8E8E93' }}>{t('coach.poweredBy', { provider })}</Box>
                        </Box>
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {/* User bubble */}
                        <Box sx={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
                            <Box sx={{
                                background: '#007AFF', color: 'white',
                                padding: '10px 14px', borderRadius: 18, borderBottomRightRadius: 6,
                                fontSize: 13.5, lineHeight: 1.5,
                            }}>
                                {t('coach.userMsg')}
                            </Box>
                        </Box>

                        {/* AI response */}
                        <AnimatePresence mode="wait">
                            {state === 'idle' && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ alignSelf: 'flex-start', maxWidth: '80%' }}
                                >
                                    <Box sx={{
                                        background: '#F2F2F7',
                                        padding: '12px 16px',
                                        borderRadius: 18,
                                        borderBottomLeftRadius: 6,
                                        fontSize: 13.5,
                                        color: '#5A5A5C',
                                        lineHeight: 1.5,
                                    }}>
                                        {renderBold(t('coach.emptyMsg'))}
                                    </Box>
                                </motion.div>
                            )}
                            {state === 'analyzing' && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ alignSelf: 'flex-start' }}
                                >
                                    <Box sx={{
                                        background: '#F2F2F7',
                                        padding: '14px 18px',
                                        borderRadius: 18,
                                        borderBottomLeftRadius: 6,
                                        display: 'flex', gap: 0.6, alignItems: 'center',
                                    }}>
                                        {[0, 1, 2].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -6, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                style={{ width: 8, height: 8, borderRadius: '50%', background: '#8E8E93' }}
                                            />
                                        ))}
                                    </Box>
                                </motion.div>
                            )}
                            {state === 'done' && (
                                <motion.div
                                    key={`done-${lang}-${provider}`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ alignSelf: 'flex-start', maxWidth: '85%' }}
                                >
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #FFFBF0, #FFF7E0)',
                                        border: '1px solid rgba(255,149,0,0.22)',
                                        padding: '14px 18px',
                                        borderRadius: 18,
                                        borderBottomLeftRadius: 6,
                                        fontSize: 13.5,
                                        color: '#1C1C1E',
                                        lineHeight: 1.6,
                                    }}>
                                        <TypeWriter text={t('coach.answer')} />
                                    </Box>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>

                    {/* Suggestions */}
                    {state === 'done' && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}
                        >
                            {t('coach.suggestions').map((s) => (
                                <motion.div
                                    key={s}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{
                                        padding: '7px 12px',
                                        background: 'rgba(0,122,255,0.08)',
                                        color: '#007AFF',
                                        borderRadius: 999,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {s}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Input */}
                    <Box sx={{
                        mt: 2, paddingTop: 2, borderTop: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex', alignItems: 'center', gap: 1,
                    }}>
                        <Box sx={{
                            flex: 1, background: '#F2F2F7', padding: '10px 14px',
                            borderRadius: 999, fontSize: 13, color: '#8E8E93',
                        }}>
                            {t('coach.inputPlaceholder')}
                        </Box>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: state === 'done' ? '#007AFF' : 'rgba(0,0,0,0.08)',
                                color: state === 'done' ? 'white' : '#8E8E93',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <SendRoundedIcon sx={{ fontSize: 16 }} />
                        </motion.div>
                    </Box>
                </Box>
            </Box>
        </section>
    );
}
