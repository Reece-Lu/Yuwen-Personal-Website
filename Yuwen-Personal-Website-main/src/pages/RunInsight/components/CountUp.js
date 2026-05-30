import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function CountUp({ end, duration = 1.2, decimals = 0, suffix = '', prefix = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-20px' });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (!inView) return;
        let start;
        let raf;
        const from = 0;
        const to = end;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = (timestamp - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(from + (to - from) * eased);
            if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [inView, end, duration]);

    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
    return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}
