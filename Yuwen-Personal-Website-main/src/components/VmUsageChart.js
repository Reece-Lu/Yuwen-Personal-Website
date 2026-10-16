import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts';
import { fetchLast3DaysVmStatus } from '../api/VmStatusApi';
import { createTheme } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

const SERIES_COLORS = ['#0f83ab', '#faa43a'];

// The backend records timestamps on the server's UTC clock without an offset;
// mark them as UTC so the browser shows them in the viewer's own time zone.
const parseServerTime = (timestamp) => new Date(`${timestamp}Z`);

// react-charts also calls axis formatters with null (e.g. before anything is
// hovered), so these must not assume a number.
const formatScalePercent = (value) => (typeof value === 'number' ? `${value}%` : '');
const formatPercent = (value) => (typeof value === 'number' ? `${value.toFixed(1)}%` : '');

const VmUsageChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchLast3DaysVmStatus();
                const formattedData = formatData(result);
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching and formatting VM status data:', error);
            }
        };

        fetchData();
    }, []);

    const formatData = (data) => {
        const cpuUsageData = data.map(entry => ({
            primary: parseServerTime(entry.timestamp),
            secondary: entry.cpuUsage
        }));

        const memoryUsageData = data.map(entry => ({
            primary: parseServerTime(entry.timestamp),
            secondary: entry.memoryUsagePercentage
        }));

        return [
            {
                label: 'CPU Usage',
                data: cpuUsageData
            },
            {
                label: 'Memory Usage',
                data: memoryUsageData
            }
        ];
    };

    const primaryAxis = React.useMemo(
        () => ({
            getValue: datum => datum.primary,
            scaleType: 'time'
        }),
        []
    );

    // Both series are percentages of the whole server, so they share one fixed
    // 0-100% axis; auto-scaled axes would exaggerate small changes.
    const secondaryAxes = React.useMemo(
        () => [
            {
                getValue: datum => datum.secondary,
                scaleType: 'linear',
                elementType: 'line',
                position: 'left',
                hardMin: 0,
                hardMax: 100,
                formatters: {
                    scale: formatScalePercent,
                    tooltip: formatPercent
                }
            }
        ],
        []
    );

    return (
        <div style={{ width: '90%'}}>
            <Typography level="h2" sx={{ marginBottom: '1rem', fontFamily: theme.typography.fontFamily }}>Website Performance</Typography>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#475467' }}>
                {data.map((series, index) => (
                    <span key={series.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: SERIES_COLORS[index] }} />
                        {series.label}
                    </span>
                ))}
            </div>
            <div style={{ height: '170px'}}>
                <Chart
                    options={{
                        data,
                        primaryAxis,
                        secondaryAxes,
                        defaultColors: SERIES_COLORS
                    }}
                />
            </div>
        </div>
    );
};

export default VmUsageChart;
