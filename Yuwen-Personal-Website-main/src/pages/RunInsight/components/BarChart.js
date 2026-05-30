import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function BarChart({ color = '#34C759', bars = 48, seed = 1, height = 70, peakAt = 0.5, smooth = true }) {
    const data = useMemo(() => {
        const arr = [];
        let rng = seed;
        const random = () => {
            rng = (rng * 9301 + 49297) % 233280;
            return rng / 233280;
        };
        for (let i = 0; i < bars; i++) {
            const t = i / bars;
            const env = smooth
                ? Math.exp(-Math.pow((t - peakAt) * 2.6, 2))
                : 0.5 + 0.5 * Math.sin(t * Math.PI * 2.1);
            const noise = 0.55 + random() * 0.45;
            arr.push(Math.max(0.08, env * noise));
        }
        return arr;
    }, [bars, seed, peakAt, smooth]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            height,
            width: '100%',
        }}>
            {data.map((v, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: `${v * 100}%`, opacity: 1 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.45, delay: i * 0.008, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        flex: 1,
                        background: color,
                        borderRadius: 1.5,
                        minHeight: 2,
                    }}
                />
            ))}
        </div>
    );
}
