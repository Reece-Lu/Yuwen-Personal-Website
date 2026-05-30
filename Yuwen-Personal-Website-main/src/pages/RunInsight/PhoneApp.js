import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import BatteryFullRoundedIcon from '@mui/icons-material/BatteryFullRounded';

import RunsScreen from './screens/RunsScreen';
import RecordsScreen from './screens/RecordsScreen';
import ShoesScreen from './screens/ShoesScreen';
import AICoachScreen from './screens/AICoachScreen';

const tabs = [
    { id: 'runs', label: 'Runs', icon: DirectionsRunRoundedIcon, Screen: RunsScreen },
    { id: 'records', label: 'Records', icon: ListAltRoundedIcon, Screen: RecordsScreen },
    { id: 'shoes', label: 'Shoes', icon: PetsRoundedIcon, Screen: ShoesScreen },
    { id: 'coach', label: 'Coach', icon: AutoAwesomeRoundedIcon, Screen: AICoachScreen },
];

function StatusBar() {
    const time = '19:38';
    return (
        <Box sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingX: 2.2,
            color: '#1C1C1E',
            fontSize: 12.5,
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
            zIndex: 5,
            pointerEvents: 'none',
        }}>
            <Box>{time}</Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SignalCellularAltRoundedIcon sx={{ fontSize: 14 }} />
                <WifiRoundedIcon sx={{ fontSize: 14 }} />
                <BatteryFullRoundedIcon sx={{ fontSize: 16, transform: 'rotate(0deg)' }} />
            </Box>
        </Box>
    );
}

function TabBar({ active, onChange }) {
    return (
        <Box sx={{
            position: 'absolute',
            bottom: 8, left: 8, right: 8,
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            borderRadius: 26,
            border: '0.5px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            padding: '6px 4px',
            display: 'flex',
            zIndex: 10,
        }}>
            {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                    <motion.div
                        key={t.id}
                        onClick={() => onChange(t.id)}
                        whileTap={{ scale: 0.92 }}
                        style={{
                            position: 'relative',
                            flex: 1,
                            padding: '4px 2px',
                            borderRadius: 16,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            minWidth: 0,
                        }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="tabHighlight"
                                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(0,122,255,0.10)',
                                    borderRadius: 16,
                                    zIndex: -1,
                                }}
                            />
                        )}
                        <motion.div animate={isActive ? { y: [0, -1, 0] } : { y: 0 }} transition={{ duration: 0.3 }}>
                            <Icon sx={{ fontSize: 18, color: isActive ? '#007AFF' : '#8E8E93' }} />
                        </motion.div>
                        <Box sx={{
                            fontSize: 8.5,
                            fontWeight: 600,
                            color: isActive ? '#007AFF' : '#8E8E93',
                            mt: 0.2,
                            whiteSpace: 'nowrap',
                        }}>
                            {t.label}
                        </Box>
                    </motion.div>
                );
            })}
        </Box>
    );
}

export default function PhoneApp({ initialTab = 'runs' }) {
    const [active, setActive] = useState(initialTab);
    const ActiveScreen = tabs.find(t => t.id === active).Screen;

    return (
        <Box sx={{
            position: 'relative',
            width: 306,
            height: 638,
            background: '#0a0a0a',
            borderRadius: 48,
            padding: '10px',
            boxShadow: `
                0 30px 60px rgba(0,0,0,0.25),
                0 12px 24px rgba(0,0,0,0.12),
                inset 0 0 0 1.5px rgba(255,255,255,0.08)
            `,
            flexShrink: 0,
        }}>
            {/* Side buttons (visual only) */}
            <Box sx={{ position: 'absolute', right: -2, top: 140, width: 3, height: 70, background: '#2a2a2a', borderRadius: '0 2px 2px 0' }} />
            <Box sx={{ position: 'absolute', left: -2, top: 110, width: 3, height: 32, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
            <Box sx={{ position: 'absolute', left: -2, top: 160, width: 3, height: 55, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />
            <Box sx={{ position: 'absolute', left: -2, top: 230, width: 3, height: 55, background: '#2a2a2a', borderRadius: '2px 0 0 2px' }} />

            {/* Screen */}
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: '#F2F2F7',
                borderRadius: 38,
                overflow: 'hidden',
            }}>
                {/* Dynamic island */}
                <Box sx={{
                    position: 'absolute',
                    top: 10, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 96, height: 28,
                    background: '#000',
                    borderRadius: 20,
                    zIndex: 20,
                }} />

                <StatusBar />

                {/* Scrollable content area */}
                <Box sx={{
                    position: 'absolute',
                    top: 40, left: 0, right: 0, bottom: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
                    color: '#1C1C1E',
                    '&::-webkit-scrollbar': { width: 0, display: 'none' },
                    scrollbarWidth: 'none',
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <ActiveScreen />
                        </motion.div>
                    </AnimatePresence>
                </Box>

                <TabBar active={active} onChange={setActive} />
            </Box>
        </Box>
    );
}
