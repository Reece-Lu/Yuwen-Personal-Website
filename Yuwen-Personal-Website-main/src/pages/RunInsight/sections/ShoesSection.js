import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import StraightenRoundedIcon from '@mui/icons-material/StraightenRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import styles from '../RunInsight.module.css';
import CountUp from '../components/CountUp';
import { useT } from '../i18n/LangContext';

const PALETTES = {
    pegasus42: { id: 1, upper: '#F8F8F6', upperDark: '#D8D9D6', sole: '#F0F0ED', outline: '#B9BBB7', lace: '#C6C8C6', accent: '#9FA3A4' },
    pegasusPlus: { id: 2, upper: '#D9DEE2', upperDark: '#9DA4A9', sole: '#F2EBDD', outline: '#8F969B', lace: '#5E6468', accent: '#1C1C1E' },
    vaporfly: { id: 3, upper: '#DFFF2F', upperDark: '#B8F000', sole: '#12A9D6', outline: '#9DD300', lace: '#7EA500', accent: '#FF5A1F' },
};

const SHOE_IMAGES = {
    pegasus42: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto%2Cu_9ddf04c7-2a9a-4d76-add1-d15af8f0263d%2Cc_scale%2Cfl_relative%2Cw_1.0%2Ch_1.0%2Cfl_layer_apply/6edeec71-1b18-4990-9742-7068166eb34e/AIR%2BZOOM%2BPEGASUS%2B42%2BRR.png',
    pegasusPlus: 'https://static.nike.com/a/images/t_PDP_144_v1/f_auto%2Cq_auto%3Aeco/fb14e7b5-379b-4efe-bd80-0a9031980191/PEGASUS%2BPLUS.png',
    vaporfly: 'https://assets.solesense.com/en/images/products/500/nike-zoomx-vaporfly-next-3-fast-pack-dv4129-700_1.jpg',
};

function Shoe({ palette, image, name, size = 80, imageScale = 1 }) {
    const [imageFailed, setImageFailed] = useState(false);

    if (image && !imageFailed) {
        return (
            <img
                src={image}
                alt={name}
                style={{
                    width: size,
                    height: size * 0.625,
                    objectFit: 'contain',
                    display: 'block',
                    mixBlendMode: 'multiply',
                    transform: `scale(${imageScale})`,
                    transformOrigin: 'center',
                }}
                onError={() => setImageFailed(true)}
            />
        );
    }

    return (
        <svg viewBox="0 0 80 50" style={{ width: size, height: size * 0.625 }}>
            <defs>
                <linearGradient id={`shoe-g${palette.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={palette.upper} />
                    <stop offset="1" stopColor={palette.upperDark} />
                </linearGradient>
            </defs>
            <path
                d="M5 38 Q8 22 22 18 Q34 14 48 18 Q62 21 72 28 Q76 30 74 36 Q72 42 60 42 L12 42 Q5 42 5 38 Z"
                fill={`url(#shoe-g${palette.id})`}
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

const SHOES = [
    { id: 1, name: 'Nike Pegasus 42', mileage: 0, runs: 0, palette: PALETTES.pegasus42, image: SHOE_IMAGES.pegasus42, noteKey: 'daily', imageScale: 2.12 },
    { id: 2, name: 'Nike Pegasus Plus', mileage: 19.96, runs: 5, palette: PALETTES.pegasusPlus, image: SHOE_IMAGES.pegasusPlus, noteKey: 'tempo', imageScale: 1.92 },
    { id: 3, name: 'Nike ZoomX Vaporfly Next% 3', mileage: 0, runs: 0, palette: PALETTES.vaporfly, image: SHOE_IMAGES.vaporfly, noteKey: 'race', imageScale: 1.74 },
];

export default function ShoesSection() {
    const { t } = useT();
    const [hoverId, setHoverId] = useState(null);

    return (
        <section className={styles.section} id="shoes">
            <Box className={styles.sectionHeader}>
                <Box className={styles.sectionMarker}>{t('shoes.marker')}</Box>
                <h2 className={styles.sectionTitle}>{t('shoes.title')}</h2>
                <p className={styles.sectionSub}>{t('shoes.subtitle')}</p>
            </Box>

            <Box className={styles.shoesLayout}>
                {/* Cabinet card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.6 }}
                    className={styles.cabinetCard}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ fontSize: 12.5, opacity: 0.7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2 }}>{t('shoes.cabinet')}</Box>
                        <Box className={styles.cabinetNumber}>
                            <CountUp end={1108.18} decimals={2} duration={1.4} /> <Box component="span" sx={{ fontSize: 'clamp(20px, 2.5vw, 28px)', opacity: 0.65, fontWeight: 700 }}>{t('shoes.km')}</Box>
                        </Box>
                        <Box sx={{ fontSize: 13, opacity: 0.7 }}>{t('shoes.lifetime', { count: SHOES.length })}</Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 4 }}>
                            <Box sx={{
                                background: 'rgba(255,255,255,0.08)',
                                borderRadius: 16,
                                padding: '14px 16px',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}>
                                    <StraightenRoundedIcon sx={{ fontSize: 14, color: '#5AC8FA' }} />
                                    <Box sx={{ fontSize: 11, opacity: 0.7, fontWeight: 600 }}>{t('shoes.assigned')}</Box>
                                </Box>
                                <Box sx={{ fontSize: 22, fontWeight: 800 }}>
                                    <CountUp end={19.96} decimals={2} /> <Box component="span" sx={{ fontSize: 12, opacity: 0.65, fontWeight: 600 }}>{t('shoes.km')}</Box>
                                </Box>
                            </Box>
                            <Box sx={{
                                background: 'rgba(255,149,0,0.18)',
                                borderRadius: 16,
                                padding: '14px 16px',
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.6 }}>
                                    <HelpOutlineRoundedIcon sx={{ fontSize: 14, color: '#FF9500' }} />
                                    <Box sx={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>{t('shoes.unassigned')}</Box>
                                </Box>
                                <Box sx={{ fontSize: 22, fontWeight: 800 }}>
                                    <CountUp end={1088.22} decimals={2} /> <Box component="span" sx={{ fontSize: 12, opacity: 0.65, fontWeight: 600 }}>{t('shoes.km')}</Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Floating shoe */}
                        <motion.div
                            animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                top: 26, right: 12,
                                opacity: 0.22,
                                pointerEvents: 'none',
                            }}
                        >
                            <Shoe palette={PALETTES.vaporfly} name="Nike ZoomX Vaporfly Next% 3" size={118} />
                        </motion.div>
                    </Box>
                </motion.div>

                {/* My Shoes list */}
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ fontSize: 15.5, fontWeight: 700, color: '#1C1C1E' }}>{t('shoes.myShoes')}</Box>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'white', border: '1px solid rgba(0,0,0,0.08)',
                                color: '#007AFF', padding: '8px 14px', borderRadius: 999,
                                fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                fontFamily: 'inherit',
                            }}
                        >
                            <AddRoundedIcon sx={{ fontSize: 16 }} />
                            {t('shoes.add')}
                        </motion.button>
                    </Box>
                    {SHOES.map((shoe, i) => (
                        <motion.div
                            key={shoe.id}
                            initial={{ opacity: 0, x: 16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            onHoverStart={() => setHoverId(shoe.id)}
                            onHoverEnd={() => setHoverId(null)}
                            className={styles.shoeRow}
                        >
                            <Box sx={{
                                width: 132, height: 84, borderRadius: 12,
                                background: '#F5F5F7',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                                overflow: 'hidden',
                            }}>
                                <motion.div
                                    animate={hoverId === shoe.id ? { rotate: [-4, 4, -4], y: -2 } : { rotate: 0, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Shoe palette={shoe.palette} image={shoe.image} name={shoe.name} size={122} imageScale={shoe.imageScale} />
                                </motion.div>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E' }}>{shoe.name}</Box>
                                <Box sx={{ fontSize: 11.5, color: '#8E8E93', mb: 0.6 }}>{t(`shoes.notes.${shoe.noteKey}`)}</Box>
                                <Box sx={{ display: 'flex', gap: 1.8 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 12, color: '#5A5A5C', fontWeight: 600 }}>
                                        <StraightenRoundedIcon sx={{ fontSize: 13 }} />
                                        {shoe.mileage} {t('shoes.km')}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, fontSize: 12, color: '#5A5A5C', fontWeight: 600 }}>
                                        <DirectionsRunRoundedIcon sx={{ fontSize: 13 }} />
                                        {shoe.runs} {t('shoes.runs')}
                                    </Box>
                                </Box>
                            </Box>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                style={{
                                    width: 36, height: 36, borderRadius: '50%',
                                    background: 'rgba(0,122,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0,
                                }}
                            >
                                <EditRoundedIcon sx={{ fontSize: 16, color: '#007AFF' }} />
                            </motion.div>
                        </motion.div>
                    ))}
                </Box>
            </Box>
        </section>
    );
}
