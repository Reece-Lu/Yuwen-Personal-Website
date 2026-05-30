import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BarChart from '../components/BarChart';
import { useT } from '../i18n/LangContext';

const float = (delay = 0, amp = 10) => ({
    animate: { y: [0, -amp, 0] },
    transition: { duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay },
});

export default function HeroVisual() {
    const { t } = useT();
    return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Background glow */}
            <motion.div
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    inset: '-40px',
                    background: 'radial-gradient(closest-side, rgba(0,122,255,0.18), transparent 70%)',
                    filter: 'blur(20px)',
                    zIndex: 0,
                }}
            />

            {/* Big distance card */}
            <motion.div
                {...float(0, 12)}
                initial={{ opacity: 0, y: 20, rotate: -3 }}
                whileInView={{ opacity: 1, y: 0, rotate: -3 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                whileHover={{ rotate: 0, scale: 1.04 }}
                style={{
                    position: 'absolute',
                    top: '6%',
                    left: '4%',
                    width: '64%',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    borderRadius: 24,
                    padding: '22px 26px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.04)',
                    zIndex: 2,
                    transform: 'rotate(-3deg)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Box sx={{ fontSize: 11, color: '#8E8E93', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, mb: 0.8 }}>{t('hero.lastMonth')}</Box>
                        <Box sx={{ fontSize: 'clamp(30px, 3.6vw, 42px)', fontWeight: 700, color: '#1C1C1E', letterSpacing: -1, lineHeight: 1 }}>
                            19.96
                            <Box component="span" sx={{ fontSize: 'clamp(14px, 1.6vw, 18px)', color: '#8E8E93', fontWeight: 600, ml: 0.7 }}>km</Box>
                        </Box>
                        <Box sx={{ fontSize: 12, color: '#8E8E93', mt: 0.8 }}>{t('hero.totalDistance')}</Box>
                    </Box>
                    <motion.div
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            width: 48, height: 48,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FF9F45, #FF6B00)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 14px rgba(255,107,0,0.35)',
                        }}
                    >
                        <DirectionsRunRoundedIcon sx={{ fontSize: 26, color: 'white' }} />
                    </motion.div>
                </Box>
            </motion.div>

            {/* Heart rate floating chip */}
            <motion.div
                {...float(0.5, 8)}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                whileHover={{ scale: 1.06 }}
                style={{
                    position: 'absolute',
                    top: '8%',
                    right: '0%',
                    background: 'white',
                    borderRadius: 18,
                    padding: '14px 18px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    zIndex: 3,
                    transform: 'rotate(4deg)',
                    minWidth: 150,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(255,59,48,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <motion.div
                            animate={{ scale: [1, 1.18, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            <FavoriteRoundedIcon sx={{ fontSize: 18, color: '#FF3B30' }} />
                        </motion.div>
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 600 }}>{t('hero.avgHR')}</Box>
                        <Box sx={{ fontSize: 19, fontWeight: 800, color: '#1C1C1E', lineHeight: 1 }}>133<Box component="span" sx={{ fontSize: 11, color: '#8E8E93', ml: 0.5 }}>bpm</Box></Box>
                    </Box>
                </Box>
                <Box sx={{ mt: 1, width: '100%' }}>
                    <BarChart color="#FF3B30" bars={20} height={20} seed={11} />
                </Box>
            </motion.div>

            {/* Pace card */}
            <motion.div
                {...float(0.8, 10)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.04 }}
                style={{
                    position: 'absolute',
                    top: '46%',
                    left: '0%',
                    background: 'white',
                    borderRadius: 16,
                    padding: '14px 18px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    zIndex: 3,
                    transform: 'rotate(-5deg)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(52,199,89,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <SpeedRoundedIcon sx={{ fontSize: 18, color: '#34C759' }} />
                    </Box>
                    <Box>
                        <Box sx={{ fontSize: 10.5, color: '#8E8E93', fontWeight: 600 }}>{t('hero.avgPace')}</Box>
                        <Box sx={{ fontSize: 19, fontWeight: 800, color: '#1C1C1E', lineHeight: 1 }}>8:14<Box component="span" sx={{ fontSize: 11, color: '#8E8E93', ml: 0.5 }}>/km</Box></Box>
                    </Box>
                </Box>
            </motion.div>

            {/* AI Coach card */}
            <motion.div
                {...float(1.2, 8)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.04, rotate: 0 }}
                style={{
                    position: 'absolute',
                    bottom: '6%',
                    right: '6%',
                    background: 'linear-gradient(135deg, #FFFBF0, #FFF1D0)',
                    border: '1px solid rgba(255,149,0,0.25)',
                    borderRadius: 20,
                    padding: '16px 18px',
                    boxShadow: '0 14px 30px rgba(255,149,0,0.18)',
                    zIndex: 3,
                    transform: 'rotate(3deg)',
                    maxWidth: 230,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.8 }}>
                    <motion.div animate={{ rotate: [0, 12, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: '#FF9500' }} />
                    </motion.div>
                    <Box sx={{ fontSize: 11.5, fontWeight: 700, color: '#FF9500' }}>{t('hero.aiCoach')}</Box>
                </Box>
                <Box sx={{ fontSize: 12.5, color: '#1C1C1E', lineHeight: 1.45 }}>
                    {t('hero.aiCoachMsg')}
                </Box>
            </motion.div>

            {/* Mini map card */}
            <motion.div
                {...float(0.3, 10)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ scale: 1.06 }}
                style={{
                    position: 'absolute',
                    bottom: '12%',
                    left: '18%',
                    width: 180, height: 130,
                    borderRadius: 20,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #DDF0E0 0%, #BFD7E8 100%)',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                    border: '4px solid white',
                    zIndex: 2,
                    transform: 'rotate(-4deg)',
                }}
            >
                <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%' }}>
                    <path d="M0 80 Q30 70 60 85 T120 90 L120 140 L0 140 Z" fill="#9FC5E8" opacity="0.6" />
                    <ellipse cx="40" cy="30" rx="35" ry="20" fill="#A3D9A5" opacity="0.55" />
                    <ellipse cx="170" cy="55" rx="30" ry="25" fill="#A3D9A5" opacity="0.5" />
                    <path d="M0 70 L200 65" stroke="white" strokeWidth="1.2" opacity="0.75" />
                    <path d="M55 0 L60 140" stroke="white" strokeWidth="0.9" opacity="0.65" />
                </svg>
                <Box sx={{ position: 'absolute', top: '38%', left: '46%' }}>
                    <motion.div
                        animate={{ scale: [1, 1.7, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            position: 'absolute', inset: -8,
                            borderRadius: '50%',
                            background: '#007AFF',
                        }}
                    />
                    <Box sx={{
                        position: 'relative',
                        width: 22, height: 22, borderRadius: '50%',
                        background: '#007AFF',
                        border: '3px solid white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <DirectionsRunRoundedIcon sx={{ fontSize: 11, color: 'white' }} />
                    </Box>
                </Box>
            </motion.div>
        </Box>
    );
}
