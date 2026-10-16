import React, { useEffect, useRef } from 'react';

const WIDGET_SRC = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';

// Same palette as the previous self-hosted exchange rate chart.
const CHART_COLORS = {
    background: '#375663',
    line: 'rgba(255, 255, 255, 1)',
    areaTop: 'rgba(233, 251, 232, 1)',   // #e9fbe8
    areaBottom: 'rgba(55, 86, 99, 0.1)', // #375663
    grid: 'rgba(215, 236, 219, 0.2)',    // #d7ecdb
    text: 'rgba(246, 252, 223, 1)',      // #F6FCDF
};

// TradingView "Symbol Overview" widget as an area chart. The widget loads its
// own data inside an iframe, so this page no longer downloads any history.
const TradingViewSymbolOverview = ({ symbol, label, height }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        const widget = document.createElement('div');
        widget.className = 'tradingview-widget-container__widget';

        const script = document.createElement('script');
        script.src = WIDGET_SRC;
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [[label, `${symbol}|12M`]],
            chartOnly: false,
            autosize: true,
            width: '100%',
            height: '100%',
            locale: 'en',
            colorTheme: 'dark',
            isTransparent: false,
            showVolume: false,
            showMA: false,
            hideDateRanges: false,
            hideMarketStatus: true,
            hideSymbolLogo: true,
            scalePosition: 'right',
            scaleMode: 'Normal',
            fontSize: '10',
            noTimeScale: false,
            valuesTracking: '1',
            changeMode: 'price-and-percent',
            chartType: 'area',
            lineWidth: 2,
            lineType: 0,
            dateRanges: ['1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
            backgroundColor: CHART_COLORS.background,
            lineColor: CHART_COLORS.line,
            topColor: CHART_COLORS.areaTop,
            bottomColor: CHART_COLORS.areaBottom,
            gridLineColor: CHART_COLORS.grid,
            fontColor: CHART_COLORS.text,
            widgetFontColor: CHART_COLORS.text,
        });

        container.appendChild(widget);
        container.appendChild(script);

        // The widget script injects an iframe; clear everything so a remount
        // (or React StrictMode's double effect in dev) doesn't stack widgets.
        return () => container.replaceChildren();
    }, [symbol, label]);

    return (
        <div>
            {/* The widget script overwrites the container's own style with height: 100%,
                so the fixed height lives on this wrapper instead. */}
            <div style={{ height, borderRadius: 14, overflow: 'hidden', background: CHART_COLORS.background }}>
                <div ref={containerRef} className="tradingview-widget-container" style={{ height: '100%' }} />
            </div>
            <div style={{ marginTop: 6, fontSize: 12, textAlign: 'right' }}>
                <a href="https://www.tradingview.com/" rel="noopener nofollow noreferrer" target="_blank">
                    Track all markets on TradingView
                </a>
            </div>
        </div>
    );
};

export default TradingViewSymbolOverview;
