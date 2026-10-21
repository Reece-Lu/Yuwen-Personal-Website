// Time zone helpers for the news page. The API speaks UTC; the page shows and
// filters by the zone the viewer picks (their own, UTC, or New York for
// U.S. market hours). `undefined` as a timeZone means the browser's own.

export const TIME_ZONES = {
    local: undefined,
    utc: 'UTC',
    ny: 'America/New_York',
};

// Offset of `timeZone` from UTC at instant `ts`, in milliseconds.
function zoneOffsetMs(ts, timeZone) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(new Date(ts));
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    const wallClockAsUtc = Date.UTC(
        get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'),
    );
    return wallClockAsUtc - Math.floor(ts / 1000) * 1000;
}

// 'YYYY-MM-DD' (+ dayOffset days) at 00:00 in `timeZone`, as a UTC ISO string.
export function zonedMidnightIso(dateStr, timeZone, dayOffset = 0) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const guess = Date.UTC(y, m - 1, d + dayOffset);
    let ts = guess - zoneOffsetMs(guess, timeZone);
    // Re-check once in case the guess and the answer straddle a DST change.
    const corrected = guess - zoneOffsetMs(ts, timeZone);
    if (corrected !== ts) ts = corrected;
    return new Date(ts).toISOString();
}

// "2026-10-21 09:37" in `timeZone`, the same in every language.
export function formatDateTime(iso, timeZone) {
    if (!iso) return '';
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(new Date(iso));
    const get = (type) => parts.find((p) => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

export function formatDate(iso, timeZone, locale) {
    if (!iso) return '';
    return new Intl.DateTimeFormat(locale, {
        timeZone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(iso));
}

// Short label such as "GMT+8" or "GMT-4" for the column header.
export function zoneLabel(timeZone) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'shortOffset',
        }).formatToParts(new Date());
        const name = parts.find((p) => p.type === 'timeZoneName');
        if (!name) return '';
        return name.value === 'GMT' ? 'UTC' : name.value;
    } catch (e) {
        return '';
    }
}
