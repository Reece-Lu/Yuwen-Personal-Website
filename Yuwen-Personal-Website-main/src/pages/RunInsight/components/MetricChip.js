import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function MetricChip({ icon, color = '#007AFF', bg = 'rgba(0,122,255,0.12)', label, value, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            style={{
                background: '#F2F2F7',
                borderRadius: 12,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'default',
            }}
        >
            <Box sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: bg,
                color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
            }}>
                {icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
                <Box sx={{ fontSize: 10.5, color: '#8E8E93', lineHeight: 1.1 }}>{label}</Box>
                <Box sx={{ fontSize: 13.5, fontWeight: 700, color: '#1C1C1E', lineHeight: 1.2 }}>{value}</Box>
            </Box>
        </motion.div>
    );
}
