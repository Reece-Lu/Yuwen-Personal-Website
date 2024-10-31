import React, { useRef } from 'react';
import { AreaClosed, Line } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { max, min, extent } from 'd3-array';
import { Group } from '@visx/group';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Line as TooltipLine } from '@visx/shape';
import { bisector } from 'd3-array';
import {createTheme, ThemeProvider} from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});


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

    const svgRef = useRef(null); // Use ref to get the SVG container

    if (width < 10) return null;

    // 最大宽度设置为 1200
    const actualWidth = Math.min(width, 1200);
    const xMax = actualWidth - margin.left - margin.right;
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
        if (!svgRef.current) return;

        const point = localPoint(svgRef.current, event); // Directly get point within the SVG container
        if (!point) return;

        const x = point.x - margin.left;
        const x0 = xScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && d1.timestamp) {
            d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;
        }

        const adjustedTooltipLeft = xScale(d.timestamp) + margin.left;

        showTooltip({
            tooltipData: d,
            tooltipLeft: adjustedTooltipLeft,
            tooltipTop: yScale(d.sellRate) + margin.top,
        });
    };

    return (
        <ThemeProvider theme={theme}>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
            <h2>{title}</h2>
            <svg ref={svgRef} width={actualWidth} height={height}>
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e9fbe8" stopOpacity={1} />
                        <stop offset="50%" stopColor="#769394" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="#375663" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <rect x={0} y={0} width={actualWidth} height={height} fill="#375663" rx={14} ry={14}/>
                <Group left={margin.left} top={margin.top} onMouseMove={handleMouseMove} onMouseLeave={hideTooltip}>
                    <AreaClosed
                        data={data}
                        x={d => xScale(d.timestamp)}
                        y={d => yScale(d.sellRate)}
                        yScale={yScale}
                        fill="url(#areaGradient)"
                        stroke="white"
                        curve={curveMonotoneX}
                    />
                    <Line
                        from={{ x: 0, y: yMax }}
                        to={{ x: xMax, y: yMax }}
                        stroke="#F6FCDF"
                    />
                    {/* Add additional dashed lines for partitioning */}
                    {[0.142, 0.286, 0.429, 0.571, 0.714, 0.857].map((ratio, i) => (
                        <Line
                            key={`partition-${i}`}
                            from={{ x: xMax * ratio, y: 0 }}
                            to={{ x: xMax * ratio, y: yMax }}
                            stroke="#d7ecdb"
                            strokeWidth={2}
                            strokeDasharray="1,5"
                            strokeOpacity={0.7}
                        />
                    ))}
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
                            stroke="#F6FCDF"
                            strokeWidth={2}
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
                <div
                    style={{
                        position: 'absolute',
                        top: tooltipTop,
                        left: tooltipLeft,
                        transform: 'translate(-50%, -100%)',
                        background: '#2d3748',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        fontSize: '12px',
                        zIndex: 10,
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
                </div>
            )}
        </div>
        </ThemeProvider>
    );
};

export default ExchangeRateChart;
