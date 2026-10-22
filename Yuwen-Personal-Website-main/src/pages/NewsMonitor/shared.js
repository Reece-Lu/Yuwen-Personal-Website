// Pieces shared by the news table and the price chart on /newsmonitor.
import { useState } from 'react';
import { Alert, Box, Chip, LinearProgress, Link, Tooltip, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { get } from '../../utils/api-utils';

export const ACCENT = '#1f6f9d';
export const FONT = 'Nunito, Arial, sans-serif';
export const MAX_CHIPS = 4;

export const ticker = (symbol) => (symbol.includes(':') ? symbol.split(':')[1] : symbol);
// The gateway answers 429 when a visitor goes over the news API rate limit.
export const errorKind = (err) => (err && err.response && err.response.status === 429 ? 'rateLimited' : 'error');
export const safeLink = (url) => (url && url.startsWith('https://') ? url : null);

export function SymbolChips({ symbols, max, onPick, t }) {
    const shown = max ? symbols.slice(0, max) : symbols;
    const rest = symbols.length - shown.length;
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {shown.map((symbol) => (
                <Tooltip key={symbol} title={`${symbol} · ${t.filterBySymbol}`}>
                    <Chip
                        label={ticker(symbol)}
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPick(symbol);
                        }}
                        sx={{ fontFamily: FONT, fontWeight: 600, height: 22 }}
                    />
                </Tooltip>
            ))}
            {rest > 0 && (
                <Tooltip title={symbols.slice(max).map(ticker).join(', ')}>
                    <Chip label={`+${rest}`} size="small" sx={{ fontFamily: FONT, height: 22 }} />
                </Tooltip>
            )}
        </Box>
    );
}

export function StoryPanel({ item, detail, t, onPickSymbol }) {
    const link = safeLink(item.link);
    let body;
    if (!detail || detail.loading) {
        body = <LinearProgress sx={{ my: 2 }} />;
    } else if (detail.error) {
        body = (
            <Alert severity={detail.error === 'rateLimited' ? 'warning' : 'error'}>
                {detail.error === 'rateLimited' ? t.rateLimited : t.storyError}
            </Alert>
        );
    } else if (detail.data.body_text) {
        body = (
            <Box sx={{ maxHeight: 420, overflowY: 'auto', pr: 1 }}>
                {detail.data.body_text.split(/\n\s*\n/).map((para, i) => (
                    <Typography
                        key={i}
                        sx={{ fontFamily: FONT, color: '#2b3540', lineHeight: 1.65, mb: 1.25, whiteSpace: 'pre-line' }}
                    >
                        {para}
                    </Typography>
                ))}
            </Box>
        );
    } else {
        body = <Typography sx={{ color: '#66737f', fontFamily: FONT, my: 1 }}>{t.noStory}</Typography>;
    }

    return (
        <Box sx={{ px: { xs: 1, sm: 3 }, py: 2, background: '#f7f8fa', borderTop: '1px solid #e6eaee' }}>
            {body}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 2,
                    mt: 1.5,
                    pt: 1.5,
                    borderTop: '1px dashed #dde3e8',
                }}
            >
                {item.symbols.length > MAX_CHIPS && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#66737f', fontSize: '0.8rem', fontFamily: FONT }}>
                            {t.relatedSymbols}
                        </Typography>
                        <SymbolChips symbols={item.symbols} onPick={onPickSymbol} t={t} />
                    </Box>
                )}
                {detail && detail.data && detail.data.copyright && (
                    <Typography sx={{ color: '#8a96a1', fontSize: '0.78rem', fontFamily: FONT }}>
                        © {detail.data.copyright}
                    </Typography>
                )}
                {link && (
                    <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ fontFamily: FONT, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                    >
                        {t.openOriginal}
                        <OpenInNewIcon sx={{ fontSize: '0.95rem' }} />
                    </Link>
                )}
            </Box>
        </Box>
    );
}

// Expand / collapse stories and load each one's full text the first time it opens.
export function useStoryDetails() {
    const [expanded, setExpanded] = useState({});
    const [details, setDetails] = useState({});

    const toggle = (item) => {
        const open = !expanded[item.id];
        setExpanded((prev) => ({ ...prev, [item.id]: open }));
        if (!open || (details[item.id] && !details[item.id].error)) return;
        if (item.story_status !== 'fetched') {
            setDetails((prev) => ({ ...prev, [item.id]: { data: {} } }));
            return;
        }
        setDetails((prev) => ({ ...prev, [item.id]: { loading: true } }));
        get(`/news/items/${item.id}`, {}, 'fastAPI')
            .then((data) => setDetails((prev) => ({ ...prev, [item.id]: { data } })))
            .catch((err) => setDetails((prev) => ({ ...prev, [item.id]: { error: errorKind(err) } })));
    };

    return { expanded, details, toggle };
}
