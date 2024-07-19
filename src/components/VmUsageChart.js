import React, { useEffect, useState } from 'react';
import { Chart } from 'react-charts';
import { fetchLast3DaysVmStatus } from '../api/VmStatusApi';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

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
            primary: new Date(entry.timestamp),
            secondary: entry.cpuUsage
        }));

        const memoryUsageData = data.map(entry => ({
            primary: new Date(entry.timestamp),
            secondary: (entry.memoryUsed / (16 * 1024 * 1024 * 1024)) * 100
        }));

        return [
            {
                label: 'CPU Usage',
                data: cpuUsageData,
                secondaryAxisId: 'cpu'
            },
            {
                label: 'Memory Usage',
                data: memoryUsageData,
                secondaryAxisId: 'memory'
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

    const secondaryAxes = React.useMemo(
        () => [
            {
                id: 'memory',
                getValue: datum => datum.secondary,
                scaleType: 'linear',
                elementType: 'line',
                position: 'left'
            },
            {
                id: 'cpu',
                getValue: datum => datum.secondary,
                scaleType: 'linear',
                elementType: 'line',
                position: 'right'
            }
        ],
        []
    );

    return (
        <div style={{ width: '90%'}}>
            <Typography level="h2" sx={{ marginBottom: '1rem', fontFamily: theme.typography.fontFamily }}>Website Performance</Typography>
            <div style={{ height: '170px'}}>
                <Chart
                    options={{
                        data,
                        primaryAxis,
                        secondaryAxes
                    }}
                />
            </div>
        </div>
    );
};

export default VmUsageChart;
