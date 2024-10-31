import React from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { GradientTealBlue } from '@visx/gradient';
import { max, min, extent } from 'd3-array';
import { Group } from '@visx/group';
import { Tooltip, defaultStyles } from '@visx/tooltip';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Line as TooltipLine } from '@visx/shape';
import { bisector } from 'd3-array';

const margin = { top: 10, right: 0, bottom: 0, left: 0 };

const bisectDate = bisector(d => d.timestamp).left;

const ExchangeRateChart = ({ data, title, width, height = 400 }) => {
    const {
        showTooltip,
        hideTooltip,
        tooltipData,
        tooltipLeft,
        tooltipTop,
    } = useTooltip();

    if (width < 10) return null;

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleTime({
        range: [0, xMax],
        domain: extent(data, d => d.timestamp),
    });

    const yScale = scaleLinear({
        range: [yMax, 0],
        domain: [min(data, d => d.sellRate), max(data, d => d.sellRate)],
        nice: true,
    });

    const handleMouseMove = (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x - margin.left);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && d1.timestamp) {
            d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
        }
        showTooltip({
            tooltipData: d,
            tooltipLeft: xScale(d.timestamp) + margin.left,
            tooltipTop: yScale(d.sellRate) + margin.top,
        });
    };

    return (
        <div>
            <h2>{title}</h2>
            <svg width={width} height={height}>
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2F5767" stopOpacity={1} />
                        <stop offset="50%" stopColor="#708090" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#a0aec0" stopOpacity={0.05} />
                    </linearGradient>
                </defs>
                <rect x={0} y={0} width={width} height={height} fill="#2d3748" rx={14} ry={14} />
                <Group left={margin.left} top={margin.top} onMouseMove={handleMouseMove} onMouseLeave={hideTooltip}>
                    <AreaClosed
                        data={data}
                        x={d => xScale(d.timestamp)}
                        y={d => yScale(d.sellRate)}
                        yScale={yScale}
                        fill="url(#areaGradient)"
                        stroke="transparent"
                        curve={curveMonotoneX}
                    />
                    <Line
                        from={{ x: 0, y: yMax }}
                        to={{ x: xMax, y: yMax }}
                        stroke="#718096"
                    />


                    <rect
                        width={xMax}
                        height={yMax}
                        fill="transparent"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={hideTooltip}
                    />
                    {tooltipData && (
                        <TooltipLine
                            from={{ x: tooltipLeft - margin.left, y: 0 }}
                            to={{ x: tooltipLeft - margin.left, y: yMax }}
                            stroke="#68d391"
                            strokeWidth={1}
                            pointerEvents="none"
                            strokeDasharray="4,4"
                        />
                    )}
                    {data.map((d, i) => {
                        const cx = xScale(d.timestamp);
                        const cy = yScale(d.sellRate);
                        return (
                            <circle key={`point-${i}`} r={4} cx={cx} cy={cy} fill="#68d391" visibility="hidden" />
                        );
                    })}
                </Group>
            </svg>
            {tooltipData && (
                <Tooltip
                    top={tooltipTop}
                    left={tooltipLeft}
                    style={{
                        ...defaultStyles,
                        background: '#2d3748',
                        color: 'white',
                    }}
                >
                    <div>
                        <strong>Sell Rate: </strong>
                        {tooltipData.sellRate.toFixed(4)}
                    </div>
                    <div>
                        <strong>Time: </strong>
                        {tooltipData.timestamp.toLocaleString()}
                    </div>
                </Tooltip>
            )}
        </div>
    );
};

export default ExchangeRateChart;
