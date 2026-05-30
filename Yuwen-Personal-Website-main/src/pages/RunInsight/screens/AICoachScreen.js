import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const providers = ['OpenAI', 'Qwen'];

const sampleAnalysis = `Solid 4.38 km run at a 7:33 /km average pace — a comfortable aerobic effort. Your heart rate sat around 133 bpm (zone 2), indicating great fat-burning territory. Cadence of 159 spm is on the lower side; try shortening your stride slightly to reach 170+ for better efficiency. Recovery looks adequate — consider a tempo run next session.`;

function TypeWriter({ text, onDone }) {
    const [shown, setShown] = useState('');
    React.useEffect(() => {
        let i = 0;
        const id = setInterval(() => {
            i++;
            setShown(text.slice(0, i));
            if (i >= text.length) {
                clearInterval(id);
                onDone && onDone();
            }
        }, 14);
        return () => clearInterval(id);
    }, [text, onDone]);
    return <span>{shown}<motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>|</motion.span></span>;
}

export default function AICoachScreen() {
    const [provider, setProvider] = useState('OpenAI');
    const [analyzed, setAnalyzed] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = () => {
        setAnalyzed(false);
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setAnalyzed(true);
        }, 700);
    };

    return (
        <Box sx={{ padding: '8px 16px 90px', fontFamily: 'inherit' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer',
                    }}
                >
                    <KeyRoundedIcon sx={{ fontSize: 16, color: '#1C1C1E' }} />
                </motion.div>
            </Box>
            <Box sx={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', mb: 1.5, letterSpacing: -0.5 }}>AI Coach</Box>

            {/* API Status */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleRoundedIcon sx={{ fontSize: 22, color: '#34C759' }} />
                        <Box>
                            <Box sx={{ fontSize: 13.5, fontWeight: 700, color: '#1C1C1E' }}>{provider} API</Box>
                            <Box sx={{ fontSize: 10.5, color: '#8E8E93' }}>Key configured</Box>
                        </Box>
                    </Box>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'rgba(0,122,255,0.1)',
                            color: '#007AFF',
                            padding: '5px 12px',
                            borderRadius: 16,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Manage
                    </motion.div>
                </Box>
                {/* Provider switch */}
                <Box sx={{
                    background: '#F2F2F7',
                    borderRadius: 9,
                    display: 'flex',
                    padding: 2,
                    mt: 1.2,
                    position: 'relative',
                }}>
                    {providers.map((p) => (
                        <motion.div
                            key={p}
                            onClick={() => setProvider(p)}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                padding: '6px 0',
                                fontSize: 12,
                                fontWeight: 600,
                                color: provider === p ? '#1C1C1E' : '#8E8E93',
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {provider === p && (
                                <motion.div
                                    layoutId="providerPill"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    style={{
                                        position: 'absolute', inset: 0,
                                        background: '#FFFFFF',
                                        borderRadius: 7,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                        zIndex: -1,
                                    }}
                                />
                            )}
                            {p}
                        </motion.div>
                    ))}
                </Box>
            </motion.div>

            {/* Choose Run */}
            <Box sx={{ fontSize: 13, fontWeight: 700, color: '#1C1C1E', mb: 0.8 }}>Choose Run</Box>
            <motion.div
                whileTap={{ scale: 0.99 }}
                style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    color: '#007AFF', fontSize: 12.5, fontWeight: 600, mb: 8, cursor: 'pointer',
                    marginBottom: 8,
                }}
            >
                May 17, 2026 · 4.38 km · 7:33 /km
                <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />
            </motion.div>

            {/* Selected run summary */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{
                    background: '#FFFFFF',
                    borderRadius: 16,
                    padding: 12,
                    marginBottom: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Box sx={{ fontSize: 13, fontWeight: 700, color: '#1C1C1E' }}>Sunday, May 17</Box>
                        <Box sx={{ fontSize: 11, color: '#8E8E93' }}>19:14 – 19:47</Box>
                    </Box>
                    <Box sx={{ fontSize: 18, fontWeight: 800, color: '#1C1C1E' }}>4.38 km</Box>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.8, mt: 1 }}>
                    {[
                        { icon: <AccessTimeRoundedIcon sx={{ fontSize: 13, color: '#007AFF' }} />, label: 'Duration', value: '33:06' },
                        { icon: <SpeedRoundedIcon sx={{ fontSize: 13, color: '#34C759' }} />, label: 'Pace', value: '7:33 /km' },
                        { icon: <HomeRoundedIcon sx={{ fontSize: 13, color: '#FF9500' }} />, label: 'Type', value: 'Indoor' },
                        { icon: <PetsRoundedIcon sx={{ fontSize: 13, color: '#AF52DE' }} />, label: 'Shoes', value: 'Unassigned' },
                    ].map((m, i) => (
                        <Box key={i} sx={{ background: '#F2F2F7', borderRadius: 9, padding: '7px 9px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                {m.icon}
                                <Box sx={{ fontSize: 10, color: '#8E8E93' }}>{m.label}</Box>
                            </Box>
                            <Box sx={{ fontSize: 12, fontWeight: 700, color: '#1C1C1E', mt: 0.2 }}>{m.value}</Box>
                        </Box>
                    ))}
                </Box>
            </motion.div>

            {/* Privacy hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: 10,
                    marginBottom: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex', gap: 8,
                }}
            >
                <Box sx={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(0,122,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, mt: 0.2,
                }}>
                    <ShieldRoundedIcon sx={{ fontSize: 13, color: '#007AFF' }} />
                </Box>
                <Box>
                    <Box sx={{ fontSize: 12, fontWeight: 700, color: '#1C1C1E', mb: 0.3 }}>Send summaries, not raw tracks</Box>
                    <Box sx={{ fontSize: 11, color: '#8E8E93', lineHeight: 1.35 }}>
                        AI receives summary stats — distance, pace, duration, shoes, cadence, heart rate. No GPS coordinates or raw samples leave the device.
                    </Box>
                </Box>
            </motion.div>

            {/* Analyze Button */}
            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #4A9CFF, #007AFF)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 22,
                    padding: '11px 0',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    marginBottom: 14,
                    boxShadow: '0 4px 12px rgba(0,122,255,0.25)',
                    fontFamily: 'inherit',
                }}
            >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
                {analyzing ? 'Analyzing…' : 'Analyze This Run'}
            </motion.button>

            <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E', mb: 0.8 }}>Conversation</Box>

            <AnimatePresence mode="wait">
                {!analyzed && !analyzing && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            background: '#FFFFFF', borderRadius: 16, padding: 18,
                            textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            marginBottom: 12,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ display: 'inline-flex' }}
                        >
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 26, color: '#FF9500', mb: 0.6 }} />
                        </motion.div>
                        <Box sx={{ fontSize: 13, fontWeight: 700, color: '#1C1C1E', mb: 0.3 }}>No Analysis Yet</Box>
                        <Box sx={{ fontSize: 11, color: '#8E8E93', lineHeight: 1.35 }}>
                            Tap analyze to generate a summary. You can ask follow-up training questions afterward.
                        </Box>
                    </motion.div>
                )}
                {analyzing && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            background: '#FFFFFF', borderRadius: 16, padding: 18,
                            textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            marginBottom: 12,
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.6 }}>
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#007AFF' }}
                                />
                            ))}
                        </Box>
                    </motion.div>
                )}
                {analyzed && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{
                            background: 'linear-gradient(135deg, #FFFBF0, #FFF7E0)',
                            border: '1px solid rgba(255,149,0,0.2)',
                            borderRadius: 16, padding: 12,
                            marginBottom: 12,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.6 }}>
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: '#FF9500' }} />
                            <Box sx={{ fontSize: 11.5, fontWeight: 700, color: '#FF9500' }}>{provider} Coach</Box>
                        </Box>
                        <Box sx={{ fontSize: 12, color: '#1C1C1E', lineHeight: 1.5 }}>
                            <TypeWriter text={sampleAnalysis} />
                        </Box>
                    </motion.div>
                )}
            </AnimatePresence>

            <Box sx={{ fontSize: 13, fontWeight: 700, color: '#1C1C1E', mb: 0.8 }}>Follow Up</Box>
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#F2F2F7', borderRadius: 18, padding: '8px 12px',
            }}>
                <Box sx={{ flex: 1, fontSize: 12, color: '#8E8E93' }}>Ask about this run…</Box>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: analyzed ? '#007AFF' : 'rgba(0,0,0,0.08)',
                        color: analyzed ? 'white' : '#8E8E93',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <SendRoundedIcon sx={{ fontSize: 14 }} />
                </motion.div>
            </Box>
        </Box>
    );
}
