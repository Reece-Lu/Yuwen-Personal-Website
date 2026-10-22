import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Chip,
    Collapse,
    Container,
    FormControlLabel,
    IconButton,
    LinearProgress,
    MenuItem,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { get } from '../../utils/api-utils';
import { TIME_ZONES, formatDate, formatDateTime, zoneLabel, zonedMidnightIso } from './time';
import { ACCENT, FONT, MAX_CHIPS, StoryPanel, SymbolChips, errorKind, ticker, useStoryDetails } from './shared';
import PriceNewsChart from './PriceNewsChart';

const PAGE_SIZES = [25, 50, 100];

// Dropdown lists render in a portal and this page has no MUI theme, so give
// their options the page font explicitly.
const LIST_SX = { '& li': { fontFamily: FONT, fontSize: '0.92rem' } };
const MENU_PROPS = { MenuListProps: { sx: LIST_SX }, PaperProps: { sx: { maxHeight: 360 } } };

const STRINGS = {
    en: {
        locale: 'en-US',
        kicker: 'NASDAQ-100 NEWS ARCHIVE',
        title: 'TradingView News Collector',
        subtitle:
            'Headlines and full text for the Nasdaq-100 members and QQQ, collected from ' +
            'TradingView twice a day (00:10 and 12:10 UTC). Times follow the time zone you pick.',
        languageLabel: 'Language',
        stats: {
            headlines: 'Headlines',
            withText: 'With full text',
            symbols: 'Symbols tracked',
            coverage: 'Coverage',
            lastRun: 'Last collection',
        },
        symbol: 'Symbol',
        symbolPlaceholder: 'All symbols',
        keyword: 'Search headlines',
        source: 'Source',
        allSources: 'All sources',
        from: 'From',
        to: 'To',
        fullOnly: 'Full text only',
        reset: 'Reset',
        timeZone: 'Time zone',
        tz: { local: 'Local', utc: 'UTC', ny: 'New York' },
        col: { time: 'Time', headline: 'Headline', symbols: 'Symbols', source: 'Source', text: 'Text' },
        storyStatus: { fetched: 'Full text', pending: 'Pending', failed: 'Failed' },
        runStatus: {
            ok: 'OK',
            partial: 'Partial',
            failed: 'Failed',
            auth_required: 'Needs login',
            quota_exhausted: 'Quota used up',
            running: 'Running',
        },
        topStory: 'Top story',
        paywall: 'Paywalled at source',
        filterBySymbol: 'Show news for this symbol',
        openOriginal: 'Read on TradingView',
        relatedSymbols: 'Related symbols',
        noStory: 'The full text has not been collected yet.',
        storyError: 'Could not load the full text.',
        rateLimited: 'Too many requests in a short time. Please wait a minute and try again.',
        empty: 'No news matches these filters.',
        error: 'Could not load news. Please try again later.',
        rowsPerPage: 'Rows per page',
        displayedRows: ({ from, to, count }) => `${from}–${to} of ${count.toLocaleString('en-US')}`,
        chart: {
            title: 'Price & News',
            subtitle:
                'Daily candles with a dot above every trading day that has news. ' +
                'Hover for a summary, click a dot to read that day\'s news.',
            ranges: { '1M': '1M', '3M': '3M', '6M': '6M', '1Y': '1Y' },
            open: 'Open',
            high: 'High',
            low: 'Low',
            close: 'Close',
            volume: 'Volume',
            change: 'Change',
            newsCount: (n) => `${n} ${n === 1 ? 'story' : 'stories'}`,
            clickToRead: 'Click to read them',
            closeList: 'Close',
            loadMore: (n) => `Show more (${n} left)`,
            asOf: (day) => `close of ${day}`,
            priceError: 'Price data is unavailable right now. Please try again later.',
            legendDot: 'Stories that trading day',
            dayRule: 'Trading days follow New York time',
            dayRuleLong:
                'A dot counts the stories published from that day\'s midnight in New York up to the next trading day, ' +
                'so weekend and holiday news shows on the previous trading day.',
            newsSince: (day) => `News for this symbol is archived from ${day}`,
            source: 'Prices: Yahoo Finance, daily',
            hint: 'Click a dot above the candles to read that day\'s news.',
            timesIn: (zone) => `times in ${zone}`,
        },
    },
    zh: {
        locale: 'zh-CN',
        kicker: '纳斯达克 100 新闻库',
        title: 'TradingView 新闻收集',
        subtitle:
            '纳斯达克 100 成分股和 QQQ 的新闻标题与正文，每天两次（UTC 00:10 和 12:10，' +
            '即北京时间 08:10 和 20:10）从 TradingView 抓取。时间按你选择的时区显示。',
        languageLabel: '语言',
        stats: {
            headlines: '新闻总数',
            withText: '已抓正文',
            symbols: '跟踪股票',
            coverage: '时间范围',
            lastRun: '最近一次抓取',
        },
        symbol: '股票',
        symbolPlaceholder: '全部股票',
        keyword: '搜索标题',
        source: '来源',
        allSources: '全部来源',
        from: '开始日期',
        to: '结束日期',
        fullOnly: '只看有正文的',
        reset: '重置',
        timeZone: '时区',
        tz: { local: '本地', utc: 'UTC', ny: '纽约' },
        col: { time: '时间', headline: '标题', symbols: '相关股票', source: '来源', text: '正文' },
        storyStatus: { fetched: '有正文', pending: '待抓取', failed: '失败' },
        runStatus: {
            ok: '成功',
            partial: '部分成功',
            failed: '失败',
            auth_required: '需要重新登录',
            quota_exhausted: '额度已用完',
            running: '运行中',
        },
        topStory: '头条',
        paywall: '原文需付费',
        filterBySymbol: '只看这只股票的新闻',
        openOriginal: '在 TradingView 上查看',
        relatedSymbols: '相关股票',
        noStory: '正文还没有抓取。',
        storyError: '正文加载失败。',
        rateLimited: '请求太频繁了，请稍等一分钟再试。',
        empty: '没有符合条件的新闻。',
        error: '新闻加载失败，请稍后再试。',
        rowsPerPage: '每页行数',
        displayedRows: ({ from, to, count }) => `第 ${from}–${to} 条，共 ${count.toLocaleString('zh-CN')} 条`,
        chart: {
            title: '价格与新闻',
            subtitle: '日 K 线上，有新闻的交易日上方会有一个圆点。鼠标悬停查看概要，点击圆点查看当天的新闻。',
            ranges: { '1M': '1个月', '3M': '3个月', '6M': '6个月', '1Y': '1年' },
            open: '开盘',
            high: '最高',
            low: '最低',
            close: '收盘',
            volume: '成交量',
            change: '涨跌',
            newsCount: (n) => `${n} 条新闻`,
            clickToRead: '点击圆点查看',
            closeList: '关闭',
            loadMore: (n) => `加载更多（还有 ${n} 条）`,
            asOf: (day) => `${day} 收盘`,
            priceError: '暂时拿不到价格数据，请稍后再试。',
            legendDot: '当天的新闻条数',
            dayRule: '交易日按纽约时间划分',
            dayRuleLong: '圆点统计的是从这个交易日纽约时间零点到下一个交易日之间发布的新闻，所以周末和节假日的新闻会显示在前一个交易日上。',
            newsSince: (day) => `这只股票的新闻从 ${day} 开始收录`,
            source: '价格来源：Yahoo Finance（日线）',
            hint: '点击 K 线上方的圆点，查看当天的新闻。',
            timesIn: (zone) => `时间为 ${zone}`,
        },
    },
};

const STORY_STATUS_COLOR = { fetched: 'success', pending: 'default', failed: 'error' };
const RUN_STATUS_COLOR = {
    ok: 'success',
    partial: 'warning',
    failed: 'error',
    auth_required: 'error',
    quota_exhausted: 'warning',
    running: 'info',
};

// Filters live in the URL so a filtered view can be bookmarked or linked to.
function readFilters(params) {
    const tz = params.get('tz');
    const size = Number(params.get('size'));
    return {
        symbol: params.get('symbol') || '',
        q: params.get('q') || '',
        provider: params.get('provider') || '',
        from: params.get('from') || '',
        to: params.get('to') || '',
        full: params.get('full') === '1',
        tz: tz in TIME_ZONES ? tz : 'local',
        page: Math.max(1, parseInt(params.get('page'), 10) || 1),
        size: PAGE_SIZES.includes(size) ? size : PAGE_SIZES[0],
    };
}

function StatTile({ label, children }) {
    return (
        <Paper variant="outlined" sx={{ px: 2, py: 1.5, flex: '1 1 150px', minWidth: 0, boxSizing: 'border-box' }}>
            <Typography sx={{ color: '#66737f', fontSize: '0.78rem', fontFamily: FONT, mb: 0.5 }}>
                {label}
            </Typography>
            <Box sx={{ color: '#172026', fontWeight: 700, fontSize: '1.15rem', fontFamily: FONT }}>
                {children}
            </Box>
        </Paper>
    );
}

function NewsMonitor() {
    const [lang, setLang] = useState(() =>
        typeof navigator !== 'undefined' && (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en',
    );
    const t = STRINGS[lang];
    const [searchParams, setSearchParams] = useSearchParams();
    const filters = readFilters(searchParams);
    const timeZone = TIME_ZONES[filters.tz];

    const [overview, setOverview] = useState(null);
    const [symbols, setSymbols] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { expanded, details, toggle: toggleRow } = useStoryDetails();
    const [qInput, setQInput] = useState(filters.q);
    const requestId = useRef(0);

    // Browser tab title follows the page heading; restore the site title on leave.
    useEffect(() => {
        const previous = document.title;
        document.title = `${t.title} | Yuwen`;
        return () => {
            document.title = previous;
        };
    }, [t.title]);

    const updateFilters = useCallback(
        (patch, { keepPage = false } = {}) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    Object.entries(patch).forEach(([key, value]) => {
                        if (value === '' || value === false || value === null || value === undefined) {
                            next.delete(key);
                        } else {
                            next.set(key, value === true ? '1' : String(value));
                        }
                    });
                    if (!keepPage) next.delete('page');
                    return next;
                },
                { replace: true },
            );
        },
        [setSearchParams],
    );

    // Overview and the symbol list only need loading once.
    useEffect(() => {
        get('/news/overview', {}, 'fastAPI').then(setOverview).catch(() => setOverview(null));
        get('/news/symbols', {}, 'fastAPI').then(setSymbols).catch(() => setSymbols([]));
    }, []);

    // Debounce the keyword box into the URL.
    useEffect(() => {
        const trimmed = qInput.trim();
        if (trimmed === filters.q) return undefined;
        const id = window.setTimeout(() => updateFilters({ q: trimmed }), 400);
        return () => window.clearTimeout(id);
    }, [qInput, filters.q, updateFilters]);

    // Keep the box in step when the URL changes from elsewhere (reset, back button).
    useEffect(() => {
        setQInput((current) => (current.trim() === filters.q ? current : filters.q));
    }, [filters.q]);

    const startIso = filters.from ? zonedMidnightIso(filters.from, timeZone) : '';
    const endIso = filters.to ? zonedMidnightIso(filters.to, timeZone, 1) : '';

    useEffect(() => {
        const id = ++requestId.current;
        setLoading(true);
        const params = { page: filters.page, page_size: filters.size };
        if (filters.symbol) params.symbol = filters.symbol;
        if (filters.q) params.q = filters.q;
        if (filters.provider) params.provider = filters.provider;
        if (startIso) params.start = startIso;
        if (endIso) params.end = endIso;
        if (filters.full) params.has_story = true;
        get('/news/items', params, 'fastAPI')
            .then((data) => {
                if (id !== requestId.current) return;
                setResult(data);
                setError(null);
            })
            .catch((err) => {
                if (id === requestId.current) setError(errorKind(err));
            })
            .finally(() => {
                if (id === requestId.current) setLoading(false);
            });
    }, [filters.symbol, filters.q, filters.provider, startIso, endIso, filters.full, filters.page, filters.size]);

    const pickSymbol = (symbol) => updateFilters({ symbol });

    const symbolOptions = useMemo(() => {
        if (!filters.symbol || symbols.some((s) => s.symbol === filters.symbol)) return symbols;
        return [{ symbol: filters.symbol, name: null, news_count: null }, ...symbols];
    }, [symbols, filters.symbol]);
    const symbolValue = symbolOptions.find((s) => s.symbol === filters.symbol) || null;

    const hasFilters = filters.symbol || filters.q || filters.provider || filters.from || filters.to || filters.full;
    const locale = t.locale;
    const items = result ? result.items : [];
    const run = overview && overview.last_run;

    return (
        <Container maxWidth="lg" sx={{ pt: 2, pb: 4 }}>
            {/* Header */}
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
                            color: ACCENT,
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            letterSpacing: '0.04em',
                            mb: 0.5,
                            textTransform: 'uppercase',
                            fontFamily: FONT,
                        }}
                    >
                        {t.kicker}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#172026', fontWeight: 700, fontFamily: FONT, mb: 1 }}>
                        {t.title}
                    </Typography>
                    <Typography sx={{ color: '#66737f', maxWidth: 720, fontFamily: FONT }}>{t.subtitle}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#66737f', fontSize: '0.85rem', fontFamily: FONT }}>
                        {t.languageLabel}
                    </Typography>
                    <ButtonGroup variant="outlined" size="small" aria-label="language">
                        <Button onClick={() => setLang('en')} variant={lang === 'en' ? 'contained' : 'outlined'}>
                            EN
                        </Button>
                        <Button onClick={() => setLang('zh')} variant={lang === 'zh' ? 'contained' : 'outlined'}>
                            中文
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>

            {/* Overview tiles */}
            {overview && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
                    <StatTile label={t.stats.headlines}>{overview.total_news.toLocaleString(locale)}</StatTile>
                    <StatTile label={t.stats.withText}>
                        {overview.with_story.toLocaleString(locale)}
                        {overview.total_news > 0 && (
                            <Typography component="span" sx={{ color: '#66737f', fontSize: '0.85rem', ml: 0.75, fontFamily: FONT }}>
                                {Math.round((overview.with_story / overview.total_news) * 100)}%
                            </Typography>
                        )}
                    </StatTile>
                    <StatTile label={t.stats.symbols}>{overview.tracked_symbols}</StatTile>
                    <StatTile label={t.stats.coverage}>
                        <Box component="span" sx={{ fontSize: '0.95rem' }}>
                            {formatDate(overview.earliest_published_at, timeZone, locale)} –{' '}
                            {formatDate(overview.latest_published_at, timeZone, locale)}
                        </Box>
                    </StatTile>
                    {run && (
                        <StatTile label={t.stats.lastRun}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Box component="span" sx={{ fontSize: '0.95rem' }}>
                                    {formatDateTime(run.started_at, timeZone)}
                                </Box>
                                <Chip
                                    size="small"
                                    color={RUN_STATUS_COLOR[run.status] || 'default'}
                                    label={t.runStatus[run.status] || run.status}
                                    sx={{ fontFamily: FONT, height: 22 }}
                                />
                            </Box>
                        </StatTile>
                    )}
                </Box>
            )}

            {/* Filters */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                <Autocomplete
                    size="small"
                    sx={{ width: { xs: '100%', sm: 260 } }}
                    options={symbolOptions}
                    value={symbolValue}
                    onChange={(e, option) => updateFilters({ symbol: option ? option.symbol : '' })}
                    isOptionEqualToValue={(a, b) => a.symbol === b.symbol}
                    ListboxProps={{ sx: { ...LIST_SX, maxHeight: 360 } }}
                    getOptionLabel={(o) => (o.name ? `${ticker(o.symbol)} · ${o.name}` : o.symbol)}
                    renderOption={(props, o) => (
                        <li {...props} key={o.symbol}>
                            <Box sx={{ display: 'flex', width: '100%', gap: 1, alignItems: 'baseline' }}>
                                <Box component="span" sx={{ fontWeight: 700, minWidth: 52 }}>
                                    {ticker(o.symbol)}
                                </Box>
                                <Box
                                    component="span"
                                    sx={{ color: '#66737f', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {o.name}
                                </Box>
                                {o.news_count !== null && (
                                    <Box component="span" sx={{ color: '#8a96a1', fontSize: '0.8rem' }}>
                                        {o.news_count.toLocaleString(locale)}
                                    </Box>
                                )}
                            </Box>
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} label={t.symbol} placeholder={t.symbolPlaceholder} />}
                />
                <TextField
                    size="small"
                    label={t.keyword}
                    value={qInput}
                    onChange={(e) => setQInput(e.target.value)}
                    inputProps={{ maxLength: 100 }}
                    sx={{ width: { xs: '100%', sm: 240 } }}
                />
                <TextField
                    select
                    size="small"
                    label={t.source}
                    value={filters.provider}
                    onChange={(e) => updateFilters({ provider: e.target.value })}
                    SelectProps={{ MenuProps: MENU_PROPS, renderValue: (value) => value }}
                    sx={{ width: { xs: '100%', sm: 200 } }}
                >
                    <MenuItem value="">{t.allSources}</MenuItem>
                    {(overview ? overview.providers : []).map((p) => (
                        <MenuItem key={p.name} value={p.name}>
                            {p.name}
                            <Box component="span" sx={{ color: '#8a96a1', ml: 'auto', pl: 2, fontSize: '0.8rem' }}>
                                {p.count.toLocaleString(locale)}
                            </Box>
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    size="small"
                    type="date"
                    label={t.from}
                    value={filters.from}
                    onChange={(e) => updateFilters({ from: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: filters.to || undefined }}
                    sx={{ width: { xs: 'calc(50% - 6px)', sm: 160 } }}
                />
                <TextField
                    size="small"
                    type="date"
                    label={t.to}
                    value={filters.to}
                    onChange={(e) => updateFilters({ to: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: filters.from || undefined }}
                    sx={{ width: { xs: 'calc(50% - 6px)', sm: 160 } }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                checked={filters.full}
                                onChange={(e) => updateFilters({ full: e.target.checked })}
                            />
                        }
                        label={<Typography sx={{ fontFamily: FONT, fontSize: '0.9rem' }}>{t.fullOnly}</Typography>}
                    />
                    {hasFilters && (
                        <Button
                            size="small"
                            onClick={() =>
                                updateFilters({ symbol: '', q: '', provider: '', from: '', to: '', full: false })
                            }
                        >
                            {t.reset}
                        </Button>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: '#66737f', fontSize: '0.85rem', fontFamily: FONT }}>{t.timeZone}</Typography>
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={filters.tz}
                        onChange={(e, value) => value && updateFilters({ tz: value === 'local' ? '' : value }, { keepPage: true })}
                    >
                        {Object.keys(TIME_ZONES).map((key) => (
                            <ToggleButton key={key} value={key} sx={{ px: 1.5, py: 0.25, textTransform: 'none' }}>
                                {t.tz[key]}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {/* Table */}
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <Box sx={{ height: 4 }}>{loading && <LinearProgress sx={{ height: 4 }} />}</Box>
                {error && (
                    <Alert severity={error === 'rateLimited' ? 'warning' : 'error'} sx={{ m: 2 }}>
                        {t[error]}
                    </Alert>
                )}
                <TableContainer>
                    <Table size="small" sx={{ minWidth: 820, '& td, & th': { fontFamily: FONT } }}>
                        <TableHead>
                            <TableRow sx={{ '& th': { color: '#66737f', fontWeight: 700, background: '#fafbfc' } }}>
                                <TableCell sx={{ width: 36, px: 1 }} />
                                <TableCell sx={{ width: 140, whiteSpace: 'nowrap' }}>
                                    {t.col.time}
                                    <Box component="span" sx={{ color: '#8a96a1', fontWeight: 400, ml: 0.5 }}>
                                        ({zoneLabel(timeZone)})
                                    </Box>
                                </TableCell>
                                <TableCell>{t.col.headline}</TableCell>
                                <TableCell sx={{ width: 190 }}>{t.col.symbols}</TableCell>
                                <TableCell sx={{ width: 150 }}>{t.col.source}</TableCell>
                                <TableCell sx={{ width: 90 }}>{t.col.text}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => {
                                const open = !!expanded[item.id];
                                return (
                                    <React.Fragment key={item.id}>
                                        <TableRow
                                            hover
                                            onClick={() => toggleRow(item)}
                                            sx={{ cursor: 'pointer', '& > td': { borderBottom: open ? 'none' : undefined, verticalAlign: 'top', py: 1.25 } }}
                                        >
                                            <TableCell sx={{ px: 1 }}>
                                                <IconButton size="small" aria-label="expand" sx={{ p: 0.25 }}>
                                                    {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', color: '#4a5560', fontVariantNumeric: 'tabular-nums' }}>
                                                {formatDateTime(item.published_at, timeZone)}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                                                    <Typography sx={{ fontFamily: FONT, fontWeight: 600, color: '#172026', lineHeight: 1.4, fontSize: '0.92rem' }}>
                                                        {item.urgency === 1 && (
                                                            <Chip
                                                                label={t.topStory}
                                                                size="small"
                                                                color="error"
                                                                sx={{ height: 18, fontSize: '0.7rem', mr: 0.75, fontFamily: FONT, verticalAlign: 'text-bottom' }}
                                                            />
                                                        )}
                                                        {item.title}
                                                        {item.paywall && (
                                                            <Tooltip title={t.paywall}>
                                                                <LockOutlinedIcon sx={{ fontSize: '0.9rem', color: '#8a96a1', ml: 0.5, verticalAlign: 'text-bottom' }} />
                                                            </Tooltip>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <SymbolChips symbols={item.symbols} max={MAX_CHIPS} onPick={pickSymbol} t={t} />
                                            </TableCell>
                                            <TableCell sx={{ color: '#4a5560' }}>{item.provider}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    variant={item.story_status === 'fetched' ? 'filled' : 'outlined'}
                                                    color={STORY_STATUS_COLOR[item.story_status] || 'default'}
                                                    label={t.storyStatus[item.story_status] || item.story_status}
                                                    sx={{ height: 22, fontFamily: FONT, fontSize: '0.75rem' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ p: 0, borderBottom: open ? undefined : 'none' }}>
                                                <Collapse in={open} timeout="auto" unmountOnExit>
                                                    <StoryPanel item={item} detail={details[item.id]} t={t} onPickSymbol={pickSymbol} />
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                );
                            })}
                            {!loading && !error && result && items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: '#66737f' }}>
                                        {t.empty}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={result ? result.total : 0}
                    page={result && result.total > 0 ? filters.page - 1 : 0}
                    rowsPerPage={filters.size}
                    rowsPerPageOptions={PAGE_SIZES}
                    onPageChange={(e, page) => {
                        updateFilters({ page: page + 1 }, { keepPage: true });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onRowsPerPageChange={(e) => updateFilters({ size: Number(e.target.value) })}
                    labelRowsPerPage={t.rowsPerPage}
                    labelDisplayedRows={t.displayedRows}
                    SelectProps={{ MenuProps: MENU_PROPS }}
                />
            </Paper>

            <PriceNewsChart symbols={symbols} t={t} locale={locale} timeZone={timeZone} />
        </Container>
    );
}

export default NewsMonitor;
