// Daily candlesticks with a news dot above every trading day that has news.
// Clicking a dot lists that day's stories under the chart.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    Collapse,
    IconButton,
    LinearProgress,
    Paper,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ParentSize } from '@visx/responsive';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisRight } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { get } from '../../utils/api-utils';
import { ACCENT, FONT, MAX_CHIPS, StoryPanel, SymbolChips, errorKind, ticker, useStoryDetails } from './shared';
import { formatDateTime, zoneLabel } from './time';

const DEFAULT_SYMBOL = 'NASDAQ:NVDA';
const RANGES = ['1M', '3M', '6M', '1Y'];
const UP = '#1a9e75';
const DOWN = '#e5484d';
const SELECTED = '#0b3a55';
const NEWS_PAGE = 20;

const HEIGHT = 420;
const MARGIN = { top: 10, right: 62, bottom: 26, left: 24 };
const MARKER_SPACE = 40; // room above the highest candle for news dots
const VOLUME_HEIGHT = 64;
const PANE_GAP = 10;
const TOOLTIP_WIDTH = 270;

// Candle dates are plain trading days (YYYY-MM-DD); format them without shifting time zones.
const asDate = (day) => new Date(`${day}T00:00:00Z`);
const formatDay = (day, locale, options) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(asDate(day));
const formatPrice = (value, locale) =>
    value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatVolume = (value, locale) => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);

function markerRadius(count, compact) {
    if (compact) return 3.5;
    if (count >= 100) return 11;
    if (count >= 10) return 10;
    return 8;
}

function CandleChart({ width, data, selectedDate, onSelect, t, locale }) {
    const [hover, setHover] = useState(null);
    const { candles, markers } = data;
    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
    const priceHeight = HEIGHT - MARGIN.top - MARGIN.bottom - VOLUME_HEIGHT - PANE_GAP;

    const markerByDate = useMemo(() => Object.fromEntries(markers.map((m) => [m.date, m])), [markers]);
    const x = useMemo(
        () => scaleBand({ domain: candles.map((c) => c.date), range: [0, innerWidth], padding: 0.25 }),
        [candles, innerWidth],
    );
    const y = useMemo(() => {
        const low = Math.min(...candles.map((c) => c.low));
        const high = Math.max(...candles.map((c) => c.high));
        const pad = (high - low) * 0.04 || high * 0.01;
        return scaleLinear({ domain: [low - pad, high + pad], range: [priceHeight, MARKER_SPACE] });
    }, [candles, priceHeight]);
    const yVolume = useMemo(
        () => scaleLinear({ domain: [0, Math.max(...candles.map((c) => c.volume)) || 1], range: [VOLUME_HEIGHT, 0] }),
        [candles],
    );

    const step = x.step();
    const band = x.bandwidth();
    const compact = step < 16; // long ranges: small dots, no numbers
    const tickEvery = Math.max(1, Math.ceil(candles.length / Math.max(2, Math.floor(innerWidth / 90))));
    const tickValues = candles.filter((_, i) => i % tickEvery === 0).map((c) => c.date);
    const centre = (day) => x(day) + band / 2;
    const tickLabel = { fill: '#66737f', fontSize: 11, fontFamily: FONT };

    // Picking a day closes the hover card (on phones a tap would otherwise leave it covering the chart).
    const choose = (marker) => {
        setHover(null);
        onSelect(marker);
    };
    const tooltipWidth = Math.min(TOOLTIP_WIDTH, width - 24);
    const hovered = hover === null ? null : candles[hover];
    const hoveredPrev = hover ? candles[hover - 1] : null;
    const hoveredMarker = hovered ? markerByDate[hovered.date] : null;
    let tooltipLeft = 0;
    if (hovered) {
        tooltipLeft = MARGIN.left + centre(hovered.date) + 16;
        if (tooltipLeft + tooltipWidth > width) tooltipLeft = MARGIN.left + centre(hovered.date) - tooltipWidth - 16;
        tooltipLeft = Math.max(0, tooltipLeft);
    }

    return (
        <Box sx={{ position: 'relative' }} onMouseLeave={() => setHover(null)}>
            <svg width={width} height={HEIGHT} role="img" aria-label={t.chart.title}>
                <Group left={MARGIN.left} top={MARGIN.top}>
                    <GridRows scale={y} width={innerWidth} numTicks={5} stroke="#eef1f4" />

                    {selectedDate && x(selectedDate) !== undefined && (
                        <rect
                            x={x(selectedDate) - (step - band) / 2}
                            y={0}
                            width={step}
                            height={priceHeight + PANE_GAP + VOLUME_HEIGHT}
                            fill={ACCENT}
                            opacity={0.1}
                        />
                    )}
                    {hovered && (
                        <line
                            x1={centre(hovered.date)}
                            x2={centre(hovered.date)}
                            y1={0}
                            y2={priceHeight + PANE_GAP + VOLUME_HEIGHT}
                            stroke="#9aa5b1"
                            strokeDasharray="3 3"
                        />
                    )}

                    {/* Candles */}
                    {candles.map((c) => {
                        const color = c.close >= c.open ? UP : DOWN;
                        const top = y(Math.max(c.open, c.close));
                        const bodyHeight = Math.max(1, Math.abs(y(c.open) - y(c.close)));
                        return (
                            <g key={c.date}>
                                <line x1={centre(c.date)} x2={centre(c.date)} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth={1} />
                                <rect x={x(c.date)} y={top} width={Math.max(1, band)} height={bodyHeight} fill={color} />
                            </g>
                        );
                    })}

                    {/* Volume */}
                    <Group top={priceHeight + PANE_GAP}>
                        {candles.map((c) => (
                            <rect
                                key={c.date}
                                x={x(c.date)}
                                y={yVolume(c.volume)}
                                width={Math.max(1, band)}
                                height={VOLUME_HEIGHT - yVolume(c.volume)}
                                fill={c.close >= c.open ? UP : DOWN}
                                opacity={0.3}
                            />
                        ))}
                    </Group>

                    {/* Hover / click targets, one per trading day (below the dots so the dots stay clickable) */}
                    {candles.map((c, i) => (
                        <rect
                            key={c.date}
                            x={x(c.date) - (step - band) / 2}
                            y={0}
                            width={step}
                            height={priceHeight + PANE_GAP + VOLUME_HEIGHT}
                            fill="transparent"
                            style={{ cursor: markerByDate[c.date] ? 'pointer' : 'default' }}
                            onMouseEnter={() => setHover(i)}
                            onClick={() => markerByDate[c.date] && choose(markerByDate[c.date])}
                        />
                    ))}

                    {/* News dots */}
                    {candles.map((c, i) => {
                        const m = markerByDate[c.date];
                        if (!m) return null;
                        const r = markerRadius(m.count, compact);
                        const high = y(c.high);
                        const cy = Math.max(r + 2, high - (compact ? 7 : 18));
                        const isSelected = selectedDate === c.date;
                        const strength = Math.min(1, Math.log10(m.count + 1) / 2);
                        return (
                            <g
                                key={c.date}
                                role="button"
                                tabIndex={0}
                                aria-label={`${c.date}: ${t.chart.newsCount(m.count)}`}
                                style={{ cursor: 'pointer', outline: 'none' }}
                                onMouseEnter={() => setHover(i)}
                                onClick={() => choose(m)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        choose(m);
                                    }
                                }}
                            >
                                {!compact && (
                                    <line
                                        x1={centre(c.date)}
                                        x2={centre(c.date)}
                                        y1={cy + r}
                                        y2={high - 2}
                                        stroke={isSelected ? SELECTED : ACCENT}
                                        strokeOpacity={0.5}
                                        strokeDasharray="2 2"
                                    />
                                )}
                                {isSelected && <circle cx={centre(c.date)} cy={cy} r={r + 3} fill="none" stroke={SELECTED} strokeWidth={1.5} />}
                                <circle
                                    cx={centre(c.date)}
                                    cy={cy}
                                    r={r}
                                    fill={isSelected ? SELECTED : ACCENT}
                                    fillOpacity={isSelected ? 1 : 0.55 + 0.45 * strength}
                                    stroke="#fff"
                                    strokeWidth={1.5}
                                />
                                {!compact && (
                                    <text
                                        x={centre(c.date)}
                                        y={cy}
                                        dy="0.35em"
                                        textAnchor="middle"
                                        fontSize={m.count >= 100 ? 8.5 : 9.5}
                                        fontWeight={700}
                                        fontFamily={FONT}
                                        fill="#fff"
                                        pointerEvents="none"
                                    >
                                        {m.count > 99 ? '99+' : m.count}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    <AxisRight
                        left={innerWidth}
                        scale={y}
                        numTicks={5}
                        hideAxisLine
                        tickLength={4}
                        tickStroke="#c9d1d9"
                        tickFormat={(v) => formatPrice(v, locale)}
                        tickLabelProps={() => ({ ...tickLabel, textAnchor: 'start', dx: 4, dy: '0.33em' })}
                    />
                    <AxisBottom
                        top={priceHeight + PANE_GAP + VOLUME_HEIGHT}
                        scale={x}
                        tickValues={tickValues}
                        stroke="#dde3e8"
                        tickStroke="#dde3e8"
                        tickLength={4}
                        tickFormat={(day) => formatDay(day, locale, { month: 'short', day: 'numeric' })}
                        tickLabelProps={() => ({ ...tickLabel, textAnchor: 'middle' })}
                    />
                </Group>
            </svg>

            {hovered && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'absolute',
                        top: MARGIN.top + 4,
                        left: tooltipLeft,
                        width: tooltipWidth,
                        p: 1.25,
                        pointerEvents: 'none',
                        fontFamily: FONT,
                        fontSize: '0.8rem',
                        color: '#2b3540',
                        zIndex: 2,
                    }}
                >
                    <Box sx={{ fontWeight: 700, mb: 0.5 }}>
                        {formatDay(hovered.date, locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto 1fr', columnGap: 1, rowGap: 0.25, fontVariantNumeric: 'tabular-nums' }}>
                        <span style={{ color: '#66737f' }}>{t.chart.open}</span>
                        <span>{formatPrice(hovered.open, locale)}</span>
                        <span style={{ color: '#66737f' }}>{t.chart.high}</span>
                        <span>{formatPrice(hovered.high, locale)}</span>
                        <span style={{ color: '#66737f' }}>{t.chart.low}</span>
                        <span>{formatPrice(hovered.low, locale)}</span>
                        <span style={{ color: '#66737f' }}>{t.chart.close}</span>
                        <span style={{ color: hovered.close >= hovered.open ? UP : DOWN, fontWeight: 700 }}>
                            {formatPrice(hovered.close, locale)}
                        </span>
                        <span style={{ color: '#66737f' }}>{t.chart.volume}</span>
                        <span>{formatVolume(hovered.volume, locale)}</span>
                        {hoveredPrev && (
                            <>
                                <span style={{ color: '#66737f' }}>{t.chart.change}</span>
                                <span style={{ color: hovered.close >= hoveredPrev.close ? UP : DOWN }}>
                                    {hovered.close >= hoveredPrev.close ? '+' : ''}
                                    {((hovered.close / hoveredPrev.close - 1) * 100).toFixed(2)}%
                                </span>
                            </>
                        )}
                    </Box>
                    {hoveredMarker && (
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #eef1f4' }}>
                            <Box sx={{ color: ACCENT, fontWeight: 700, mb: 0.5 }}>{t.chart.newsCount(hoveredMarker.count)}</Box>
                            {hoveredMarker.titles.map((title, i) => (
                                <Box
                                    key={i}
                                    sx={{ mb: 0.4, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                >
                                    · {title}
                                </Box>
                            ))}
                            <Box sx={{ color: '#8a96a1', mt: 0.5 }}>{t.chart.clickToRead}</Box>
                        </Box>
                    )}
                </Paper>
            )}
        </Box>
    );
}

function DayNews({ symbol, marker, news, onLoadMore, onClose, onPickSymbol, t, locale, timeZone }) {
    const { expanded, details, toggle } = useStoryDetails();
    const day = formatDay(marker.date, locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    return (
        <Paper variant="outlined" sx={{ mt: 2, overflow: 'hidden' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    background: '#fafbfc',
                    borderBottom: '1px solid #e6eaee',
                }}
            >
                <Typography sx={{ fontFamily: FONT, fontWeight: 700, color: '#172026' }}>
                    {ticker(symbol)} · {day}
                    <Box component="span" sx={{ color: ACCENT, ml: 1 }}>
                        {t.chart.newsCount(marker.count)}
                    </Box>
                    <Box component="span" sx={{ color: '#8a96a1', fontWeight: 400, fontSize: '0.8rem', ml: 1 }}>
                        {t.chart.timesIn(zoneLabel(timeZone))}
                    </Box>
                </Typography>
                <IconButton size="small" onClick={onClose} aria-label={t.chart.closeList}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
            {news.error && (
                <Alert severity={news.error === 'rateLimited' ? 'warning' : 'error'} sx={{ m: 2 }}>
                    {news.error === 'rateLimited' ? t.rateLimited : t.error}
                </Alert>
            )}
            {news.items.map((item) => {
                const open = !!expanded[item.id];
                return (
                    <Box key={item.id} sx={{ borderBottom: '1px solid #eef1f4' }}>
                        <Box
                            onClick={() => toggle(item)}
                            sx={{
                                display: 'flex',
                                gap: 1.5,
                                alignItems: 'flex-start',
                                px: 2,
                                py: 1.25,
                                cursor: 'pointer',
                                '&:hover': { background: '#f7f9fb' },
                            }}
                        >
                            <Box sx={{ color: '#8a96a1', pt: '1px' }}>
                                {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontFamily: FONT, fontWeight: 600, color: '#172026', fontSize: '0.92rem', lineHeight: 1.4 }}>
                                    {item.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                                    <Typography sx={{ fontFamily: FONT, color: '#66737f', fontSize: '0.8rem', fontVariantNumeric: 'tabular-nums' }}>
                                        {formatDateTime(item.published_at, timeZone)} · {item.provider}
                                    </Typography>
                                    <SymbolChips symbols={item.symbols} max={MAX_CHIPS} onPick={onPickSymbol} t={t} />
                                    {item.story_status === 'fetched' && (
                                        <Chip label={t.storyStatus.fetched} size="small" color="success" sx={{ height: 20, fontSize: '0.7rem', fontFamily: FONT }} />
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <StoryPanel item={item} detail={details[item.id]} t={t} onPickSymbol={onPickSymbol} />
                        </Collapse>
                    </Box>
                );
            })}
            {news.loading && <LinearProgress />}
            {!news.loading && news.items.length < news.total && (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Button size="small" onClick={onLoadMore}>
                        {t.chart.loadMore(news.total - news.items.length)}
                    </Button>
                </Box>
            )}
        </Paper>
    );
}

function PriceNewsChart({ symbols, t, locale, timeZone }) {
    const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
    const [range, setRange] = useState('3M');
    const [chart, setChart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [news, setNews] = useState(null);
    const chartRequest = useRef(0);
    const newsRequest = useRef(0);
    const listRef = useRef(null);

    useEffect(() => {
        const id = ++chartRequest.current;
        setLoading(true);
        get('/news/chart', { symbol, range }, 'fastAPI')
            .then((data) => {
                if (id !== chartRequest.current) return;
                setChart(data);
                setError(null);
            })
            .catch((err) => {
                if (id !== chartRequest.current) return;
                setError(err && err.response && err.response.status === 503 ? 'priceError' : errorKind(err));
            })
            .finally(() => {
                if (id === chartRequest.current) setLoading(false);
            });
    }, [symbol, range]);

    // A new symbol starts with no day selected.
    useEffect(() => {
        setSelected(null);
        setNews(null);
    }, [symbol]);

    const loadNews = (marker, page) => {
        const id = ++newsRequest.current;
        setNews((prev) => ({ items: page === 1 ? [] : prev.items, total: page === 1 ? marker.count : prev.total, page, loading: true, error: null }));
        const params = { symbol, start: marker.start, page, page_size: NEWS_PAGE };
        if (marker.end) params.end = marker.end;
        get('/news/items', params, 'fastAPI')
            .then((data) => {
                if (id !== newsRequest.current) return;
                setNews((prev) => ({ items: [...prev.items, ...data.items], total: data.total, page, loading: false, error: null }));
            })
            .catch((err) => {
                if (id !== newsRequest.current) return;
                setNews((prev) => ({ ...prev, loading: false, error: errorKind(err) }));
            });
    };

    const select = (marker) => {
        setSelected(marker);
        loadNews(marker, 1);
        window.setTimeout(() => listRef.current && listRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
    };

    const tracked = useMemo(() => new Set(symbols.map((s) => s.symbol)), [symbols]);
    const pickSymbol = (s) => tracked.has(s) && setSymbol(s);
    const symbolValue = symbols.find((s) => s.symbol === symbol) || { symbol, name: chart && chart.name, news_count: null };

    const candles = chart && chart.symbol === symbol ? chart.candles : [];
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    const newsSince = chart && chart.news_since && candles.length && chart.news_since.slice(0, 10) > candles[0].date ? chart.news_since : null;

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2, mb: 1.5 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontFamily: FONT, fontWeight: 700, color: '#172026' }}>
                        {t.chart.title}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, color: '#66737f', maxWidth: 680 }}>{t.chart.subtitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Autocomplete
                        size="small"
                        disableClearable
                        sx={{ width: { xs: '100%', sm: 240 } }}
                        options={symbols}
                        value={symbolValue}
                        onChange={(e, option) => option && setSymbol(option.symbol)}
                        isOptionEqualToValue={(a, b) => a.symbol === b.symbol}
                        getOptionLabel={(o) => (o.name ? `${ticker(o.symbol)} · ${o.name}` : ticker(o.symbol))}
                        ListboxProps={{ sx: { maxHeight: 360, '& li': { fontFamily: FONT, fontSize: '0.92rem' } } }}
                        renderInput={(params) => <TextField {...params} label={t.symbol} />}
                    />
                    <ToggleButtonGroup size="small" exclusive value={range} onChange={(e, value) => value && setRange(value)}>
                        {RANGES.map((r) => (
                            <ToggleButton key={r} value={r} sx={{ px: 1.5, py: 0.5, fontFamily: FONT }}>
                                {t.chart.ranges[r]}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>

            <Paper variant="outlined" sx={{ p: { xs: 1, sm: 2 }, position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap', mb: 1, minHeight: 32 }}>
                    <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '1.1rem', color: '#172026' }}>
                        {ticker(symbol)}
                    </Typography>
                    {chart && chart.name && chart.symbol === symbol && (
                        <Typography sx={{ fontFamily: FONT, color: '#66737f' }}>{chart.name}</Typography>
                    )}
                    {last && (
                        <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                            {formatPrice(last.close, locale)}
                        </Typography>
                    )}
                    {last && prev && (
                        <Typography sx={{ fontFamily: FONT, color: last.close >= prev.close ? UP : DOWN, fontVariantNumeric: 'tabular-nums' }}>
                            {last.close >= prev.close ? '+' : ''}
                            {((last.close / prev.close - 1) * 100).toFixed(2)}%
                        </Typography>
                    )}
                    {last && (
                        <Typography sx={{ fontFamily: FONT, color: '#8a96a1', fontSize: '0.8rem' }}>
                            {t.chart.asOf(formatDay(last.date, locale, { month: 'short', day: 'numeric' }))}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ height: 4, mb: 0.5 }}>{loading && <LinearProgress sx={{ height: 4 }} />}</Box>
                {error && !candles.length ? (
                    <Alert severity={error === 'rateLimited' ? 'warning' : 'error'} sx={{ my: 2 }}>
                        {error === 'rateLimited' ? t.rateLimited : t.chart.priceError}
                    </Alert>
                ) : (
                    <Box sx={{ height: HEIGHT, opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                        {candles.length > 0 && (
                            <ParentSize>
                                {({ width }) =>
                                    width > 0 && (
                                        <CandleChart
                                            width={width}
                                            data={chart}
                                            selectedDate={selected && selected.date}
                                            onSelect={select}
                                            t={t}
                                            locale={locale}
                                        />
                                    )
                                }
                            </ParentSize>
                        )}
                    </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1, color: '#66737f', fontFamily: FONT, fontSize: '0.8rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box component="span" sx={{ width: 14, height: 14, borderRadius: '50%', background: ACCENT, display: 'inline-block' }} />
                        {t.chart.legendDot}
                    </Box>
                    <Tooltip title={t.chart.dayRuleLong}>
                        <span style={{ borderBottom: '1px dotted #9aa5b1', cursor: 'help' }}>{t.chart.dayRule}</span>
                    </Tooltip>
                    {newsSince && <span>{t.chart.newsSince(formatDay(newsSince.slice(0, 10), locale, { year: 'numeric', month: 'short', day: 'numeric' }))}</span>}
                    <span style={{ marginLeft: 'auto' }}>{t.chart.source}</span>
                </Box>
            </Paper>

            <Box ref={listRef}>
                {selected && news ? (
                    <DayNews
                        symbol={symbol}
                        marker={selected}
                        news={news}
                        onLoadMore={() => loadNews(selected, news.page + 1)}
                        onClose={() => {
                            setSelected(null);
                            setNews(null);
                        }}
                        onPickSymbol={pickSymbol}
                        t={t}
                        locale={locale}
                        timeZone={timeZone}
                    />
                ) : (
                    candles.length > 0 && (
                        <Typography sx={{ fontFamily: FONT, color: '#8a96a1', textAlign: 'center', mt: 2 }}>{t.chart.hint}</Typography>
                    )
                )}
            </Box>
        </Box>
    );
}

export default PriceNewsChart;
