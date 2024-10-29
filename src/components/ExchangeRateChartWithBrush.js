import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

const tooltipStyles = {
    ...defaultStyles,
    background: '#3b6978',
    border: '1px solid white',
    color: 'white',
};

const formatDate = timeFormat("%b %d, '%y");

const getTimestamp = d => new Date(d.timestamp);
const getSellRate = d => d.sellRate ?? 0;  // Default to 0 if undefined

const ExchangeRateChartWithTooltip = ({ data, width, height, margin = { top: 10, right: 10, bottom: 50, left: 50 }, showTooltip, hideTooltip, tooltipData, tooltipTop = 0, tooltipLeft = 0 }) => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const dateScale = useMemo(
        () =>
            scaleTime({
                range: [margin.left, innerWidth + margin.left],
                domain: extent(data, getTimestamp) || [new Date(), new Date()],
            }),
        [data, margin.left, innerWidth]
    );

    const rateScale = useMemo(
        () =>
            scaleLinear({
                range: [innerHeight + margin.top, margin.top],
                domain: [0, max(data, getSellRate) || 1],  // Default to 1 if max is NaN
            }),
        [data, innerHeight, margin.top]
    );

    // Tooltip handling
    const handleTooltip = useCallback(
        (event) => {
            const { x } = localPoint(event) || { x: 0 };
            const x0 = dateScale.invert(x);
            const index = bisector(getTimestamp).left(data, x0, 1);
            const d0 = data[index - 1];
            const d1 = data[index];
            const d = d1 && x0 - getTimestamp(d0) > getTimestamp(d1) - x0 ? d1 : d0;
            showTooltip({
                tooltipData: d,
                tooltipLeft: x,
                tooltipTop: rateScale(getSellRate(d)),
            });
        },
        [data, dateScale, rateScale, showTooltip]
    );

    return (
        <div>
            <svg width={width} height={height}>
                <LinearGradient id="area-gradient" from="#007AFF" to="#007AFF" toOpacity={0.2} />
                <rect x={0} y={0} width={width} height={height} fill="#f3f3f3" rx={14} />

                <GridRows scale={rateScale} width={innerWidth} left={margin.left} strokeDasharray="2,2" />
                <GridColumns scale={dateScale} height={innerHeight} top={margin.top} strokeDasharray="2,2" />

                <AreaClosed
                    data={data}
                    x={d => dateScale(getTimestamp(d)) ?? 0}
                    y={d => rateScale(getSellRate(d)) ?? 0}
                    yScale={rateScale}
                    stroke="transparent"
                    fill="url(#area-gradient)"
                    curve={curveMonotoneX}
                />

                <Line
                    from={{ x: margin.left, y: rateScale(data[0]?.sellRate || 0) }}
                    to={{ x: width - margin.right, y: rateScale(data[data.length - 1]?.sellRate || 0) }}
                    stroke="#007AFF"
                    strokeWidth={1.5}
                    curve={curveMonotoneX}
                />

                <Bar
                    x={margin.left}
                    y={margin.top}
                    width={innerWidth}
                    height={innerHeight}
                    fill="transparent"
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
                />
            </svg>
            {tooltipData && (
                <div>
                    <TooltipWithBounds top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
                        {`Sell Rate: ${tooltipData.sellRate}`}
                    </TooltipWithBounds>
                    <Tooltip
                        top={innerHeight + margin.top}
                        left={tooltipLeft}
                        style={{
                            ...defaultStyles,
                            minWidth: 72,
                            textAlign: 'center',
                            transform: 'translateX(-50%)',
                        }}
                    >
                        {formatDate(getTimestamp(tooltipData))}
                    </Tooltip>
                </div>
            )}
        </div>
    );
};

export default withTooltip(ExchangeRateChartWithTooltip);
