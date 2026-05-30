import React, { createContext, useCallback, useContext, useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import translations from './translations';

const LangContext = createContext(null);

function resolve(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function LangProvider({ children }) {
    // Default language is English.
    const [lang, setLang] = useState('en');

    const t = useCallback(
        (key, vars) => {
            let val = resolve(translations[lang], key);
            if (val === undefined) val = resolve(translations.en, key);
            if (val === undefined) return key;
            if (typeof val === 'string' && vars) {
                Object.keys(vars).forEach((k) => {
                    val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
                });
            }
            return val;
        },
        [lang]
    );

    return (
        <LangContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LangContext.Provider>
    );
}

export function useT() {
    const ctx = useContext(LangContext);
    if (!ctx) {
        // Fallback so components never crash if used outside a provider.
        return { lang: 'en', setLang: () => {}, t: (k) => k };
    }
    return ctx;
}

const OPTIONS = [
    { id: 'en', label: 'EN' },
    { id: 'zh', label: '中文' },
];

export function LangToggle({ floating = false }) {
    const { lang, setLang } = useT();
    return (
        <Box
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                padding: '4px',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '999px',
                boxShadow: floating ? '0 6px 20px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.05)',
                ...(floating && {
                    position: 'fixed',
                    top: '3.4rem',
                    right: '1.2rem',
                    zIndex: 1200,
                }),
            }}
        >
            {OPTIONS.map((opt) => {
                const active = lang === opt.id;
                return (
                    <Box
                        key={opt.id}
                        component="button"
                        onClick={() => setLang(opt.id)}
                        sx={{
                            position: 'relative',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            color: active ? '#1C1C1E' : '#8E8E93',
                            padding: '5px 13px',
                            borderRadius: '999px',
                            zIndex: 1,
                        }}
                    >
                        {active && (
                            <motion.span
                                layoutId="langPill"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: '#1C1C1E',
                                    borderRadius: 999,
                                    zIndex: -1,
                                }}
                            />
                        )}
                        <Box component="span" sx={{ color: active ? 'white' : 'inherit', transition: 'color 0.2s' }}>
                            {opt.label}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}
