import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import CountUp from '../components/CountUp';

const shoeImages = {
    pegasus42: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/6edeec71-1b18-4990-9742-7068166eb34e/AIR%2BZOOM%2BPEGASUS%2B42%2BRR.png',
    pegasusPlus: 'https://static.nike.com/a/images/t_PDP_144_v1/f_auto%2Cq_auto%3Aeco/fb14e7b5-379b-4efe-bd80-0a9031980191/PEGASUS%2BPLUS.png',
    vaporfly: 'https://assets.solesense.com/en/images/products/500/nike-zoomx-vaporfly-next-3-fast-pack-dv4129-700_1.jpg',
};

function ShoeIllustration({ palette, image, name }) {
    const [imageFailed, setImageFailed] = useState(false);

    if (image && !imageFailed) {
        return (
            <img
                src={image}
                alt={name}
                style={{ width: 54, height: 38, objectFit: 'contain', display: 'block', mixBlendMode: 'multiply' }}
                onError={() => setImageFailed(true)}
            />
        );
    }

    return (
        <svg viewBox="0 0 80 50" style={{ width: 50, height: 36 }}>
            <defs>
                <linearGradient id={`g${palette.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={palette.upper} />
                    <stop offset="1" stopColor={palette.upperDark} />
                </linearGradient>
            </defs>
            <path
                d="M5 38 Q8 22 22 18 Q34 14 48 18 Q62 21 72 28 Q76 30 74 36 Q72 42 60 42 L12 42 Q5 42 5 38 Z"
                fill={`url(#g${palette.id})`}
                stroke={palette.outline}
                strokeWidth="0.8"
            />
            <path
                d="M5 38 Q8 42 14 42 L60 42 Q72 42 74 36 L75 40 Q72 46 60 46 L12 46 Q5 46 5 40 Z"
                fill={palette.sole}
            />
            <path d="M20 22 Q28 19 38 22" stroke={palette.lace} strokeWidth="0.8" fill="none" />
            <path d="M22 26 Q30 24 40 26" stroke={palette.lace} strokeWidth="0.8" fill="none" />
            <circle cx="64" cy="32" r="2" fill={palette.accent} />
        </svg>
    );
}

const palettes = {
    pegasus42: { id: 1, upper: '#F8F8F6', upperDark: '#D8D9D6', sole: '#F0F0ED', outline: '#B9BBB7', lace: '#C6C8C6', accent: '#9FA3A4' },
    pegasusPlus: { id: 2, upper: '#D9DEE2', upperDark: '#9DA4A9', sole: '#F2EBDD', outline: '#8F969B', lace: '#5E6468', accent: '#1C1C1E' },
    vaporfly: { id: 3, upper: '#DFFF2F', upperDark: '#B8F000', sole: '#12A9D6', outline: '#9DD300', lace: '#7EA500', accent: '#FF5A1F' },
};

const shoes = [
    { id: 1, name: 'Nike Pegasus 42', mileage: 0, runs: 0, palette: palettes.pegasus42, image: shoeImages.pegasus42 },
    { id: 2, name: 'Nike Pegasus Plus', mileage: 19.96, runs: 5, palette: palettes.pegasusPlus, image: shoeImages.pegasusPlus },
    { id: 3, name: 'Nike ZoomX Vaporfly Next% 3', mileage: 0, runs: 0, palette: palettes.vaporfly, image: shoeImages.vaporfly },
];

export default function ShoesScreen() {
    const [activeId, setActiveId] = useState(null);

    return (
        <Box sx={{ padding: '8px 16px 90px', fontFamily: 'inherit' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer',
                    }}
                >
                    <AddRoundedIcon sx={{ fontSize: 20, color: '#1C1C1E' }} />
                </motion.div>
            </Box>
            <Box sx={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', mb: 1.5, letterSpacing: -0.5 }}>Shoes</Box>

            {/* Cabinet card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    padding: 14,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    marginBottom: 14,
                }}
            >
                <Box sx={{ fontSize: 11.5, color: '#8E8E93', mb: 0.4 }}>Shoe Cabinet</Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                    <Box sx={{ fontSize: 28, fontWeight: 800, color: '#1C1C1E', lineHeight: 1 }}>
                        <CountUp end={19.96} decimals={2} /> km
                    </Box>
                    <Box sx={{ fontSize: 11, color: '#8E8E93' }}>Assigned Mileage</Box>
                </Box>
                <Box sx={{ fontSize: 11.5, color: '#8E8E93', mt: 0.6 }}>
                    3 shoes · Assign shoes to runs to track mileage automatically
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.2 }}>
                    <Box sx={{
                        background: '#F2F2F7', borderRadius: 12, padding: '10px 12px',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                            <StraightenRoundedIcon sx={{ fontSize: 13, color: '#5AC8FA' }} />
                            <Box sx={{ fontSize: 10, color: '#8E8E93' }}>Lifetime Mileage</Box>
                        </Box>
                        <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>
                            <CountUp end={1108.18} decimals={2} /> km
                        </Box>
                    </Box>
                    <Box sx={{
                        background: 'rgba(255,149,0,0.10)', borderRadius: 12, padding: '10px 12px',
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.3 }}>
                            <HelpOutlineRoundedIcon sx={{ fontSize: 13, color: '#FF9500' }} />
                            <Box sx={{ fontSize: 10, color: '#8E8E93' }}>Unassigned Mileage</Box>
                        </Box>
                        <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>
                            <CountUp end={1088.22} decimals={2} /> km
                        </Box>
                    </Box>
                </Box>
            </motion.div>

            <Box sx={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E', mb: 1 }}>My Shoes</Box>

            {shoes.map((shoe, i) => (
                <motion.div
                    key={shoe.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}
                    onHoverStart={() => setActiveId(shoe.id)}
                    onHoverEnd={() => setActiveId(null)}
                    style={{
                        background: '#FFFFFF',
                        borderRadius: 16,
                        padding: 12,
                        marginBottom: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                    }}
                >
                    <Box sx={{
                        width: 58, height: 44,
                        background: '#F2F2F7',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <motion.div animate={activeId === shoe.id ? { rotate: [-2, 2, -2] } : { rotate: 0 }} transition={{ duration: 0.4 }}>
                            <ShoeIllustration palette={shoe.palette} image={shoe.image} name={shoe.name} />
                        </motion.div>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{shoe.name}</Box>
                        <Box sx={{ display: 'flex', gap: 1.4, mt: 0.4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 11, color: '#8E8E93' }}>
                                <StraightenRoundedIcon sx={{ fontSize: 11 }} />
                                {shoe.mileage} km
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 11, color: '#8E8E93' }}>
                                <DirectionsRunRoundedIcon sx={{ fontSize: 11 }} />
                                {shoe.runs} runs
                            </Box>
                        </Box>
                    </Box>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: 'rgba(0,122,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <EditRoundedIcon sx={{ fontSize: 14, color: '#007AFF' }} />
                    </motion.div>
                </motion.div>
            ))}
        </Box>
    );
}
