import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, ButtonGroup, Container, Typography } from '@mui/material';

const STRINGS = {
    en: {
        kicker: 'NASDAQ-100 MONITOR',
        title: 'QQQ Daily K-line vs SMA 50 / 100 / 200',
        subtitle:
            'Nasdaq-100 ETF (QQQ) daily candles compared against the 50-, 100-, ' +
            'and 200-day simple moving averages. Prices are pulled from yfinance ' +
            'after every U.S. market close and persisted to DuckDB.',
        languageLabel: 'Language',
    },
    zh: {
        kicker: '纳斯达克 100 监控',
        title: 'QQQ 日 K 线与 SMA 50 / 100 / 200 对比',
        subtitle:
            'Nasdaq-100 ETF (QQQ) 的日 K 线与 50、100、200 日简单移动平均线对比。' +
            '数据每天在美东收盘后从 yfinance 拉取并写入 DuckDB。',
        languageLabel: '语言',
    },
};

// Streamlit and the React shell are served from the same origin (nginx
// gateway), so we can read the iframe's contentDocument and let its
// scrollHeight drive the iframe height — no scrollbar inside.
const MIN_IFRAME_HEIGHT = 720;

function QuantMonitor() {
    const [lang, setLang] = useState('en');
    const [iframeHeight, setIframeHeight] = useState(MIN_IFRAME_HEIGHT);
    const iframeRef = useRef(null);
    const t = STRINGS[lang];

    // Re-mount the iframe whenever lang changes so the Streamlit app picks up
    // the new `?lang=` query string and re-renders its labels.
    const iframeSrc = useMemo(() => `/quant/?lang=${lang}`, [lang]);

    const syncHeight = useCallback(() => {
        const iframe = iframeRef.current;
        const doc = iframe && iframe.contentDocument;
        if (!doc) return;
        // Use .block-container (the actual Streamlit content wrapper) plus
        // the floating Streamlit header height. We deliberately AVOID
        // .stApp because Streamlit pegs it to viewport height which would
        // create a feedback loop with the iframe size we set below.
        const block = doc.querySelector('.block-container');
        const header = doc.querySelector('[data-testid="stHeader"]');
        const blockHeight = block ? block.scrollHeight : 0;
        const headerHeight = header ? header.offsetHeight : 0;
        if (!blockHeight) return;
        // Small buffer to avoid 1px scrollbar from sub-pixel rounding.
        const next = Math.max(MIN_IFRAME_HEIGHT, blockHeight + headerHeight + 32);
        setIframeHeight((prev) => (Math.abs(prev - next) > 2 ? next : prev));
    }, []);

    useEffect(() => {
        // Reset to min on lang switch (iframe gets re-mounted via `key={lang}`).
        setIframeHeight(MIN_IFRAME_HEIGHT);

        const iframe = iframeRef.current;
        if (!iframe) return undefined;

        let observer;
        let intervalId;

        const attach = () => {
            const doc = iframe.contentDocument;
            if (!doc || !doc.body) return;

            syncHeight();

            const target = doc.querySelector('.block-container') || doc.body;
            if (target && typeof ResizeObserver !== 'undefined') {
                observer = new ResizeObserver(syncHeight);
                observer.observe(target);
            } else {
                intervalId = window.setInterval(syncHeight, 500);
            }
        };

        iframe.addEventListener('load', attach);

        // Plotly's redraws and Streamlit reruns can push content height
        // after `load` already fired — keep a low-frequency poll as a
        // safety net (cheap, just reads scrollHeight).
        const pollId = window.setInterval(syncHeight, 1500);

        return () => {
            iframe.removeEventListener('load', attach);
            if (observer) observer.disconnect();
            if (intervalId) window.clearInterval(intervalId);
            window.clearInterval(pollId);
        };
    }, [lang, syncHeight]);

    return (
        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    flexWrap: 'wrap',
                    pb: 1.5,
                    mb: 2,
                    borderBottom: '1px solid #e6eaee',
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: '#1f9d72',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            letterSpacing: '0.04em',
                            mb: 0.5,
                            textTransform: 'uppercase',
                            fontFamily: 'Nunito, Arial, sans-serif',
                        }}
                    >
                        {t.kicker}
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: '#172026',
                            fontWeight: 700,
                            fontFamily: 'Nunito, Arial, sans-serif',
                            mb: 1,
                        }}
                    >
                        {t.title}
                    </Typography>
                    <Typography
                        sx={{
                            color: '#66737f',
                            maxWidth: 720,
                            fontFamily: 'Nunito, Arial, sans-serif',
                        }}
                    >
                        {t.subtitle}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                        sx={{
                            color: '#66737f',
                            fontSize: '0.85rem',
                            fontFamily: 'Nunito, Arial, sans-serif',
                        }}
                    >
                        {t.languageLabel}
                    </Typography>
                    <ButtonGroup variant="outlined" size="small" aria-label="language">
                        <Button
                            onClick={() => setLang('en')}
                            variant={lang === 'en' ? 'contained' : 'outlined'}
                        >
                            EN
                        </Button>
                        <Button
                            onClick={() => setLang('zh')}
                            variant={lang === 'zh' ? 'contained' : 'outlined'}
                        >
                            中文
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>

            <Box
                sx={{
                    border: '1px solid #e6eaee',
                    borderRadius: 1,
                    overflow: 'hidden',
                    background: '#f7f8fa',
                }}
            >
                <iframe
                    key={lang}
                    ref={iframeRef}
                    title="QQQ SMA Monitor"
                    src={iframeSrc}
                    scrolling="no"
                    style={{
                        width: '100%',
                        height: `${iframeHeight}px`,
                        border: 'none',
                        display: 'block',
                    }}
                />
            </Box>
        </Container>
    );
}

export default QuantMonitor;
