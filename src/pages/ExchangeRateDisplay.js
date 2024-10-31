import React, { useEffect, useState } from 'react';
import { get } from '../utils/api-utils';
import ExchangeRateChart from "../components/ExchangeRateChart";
import { Grid, Typography, Chip } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
        fontSize: 14,
    },
});

const ExchangeRateDisplay = () => {
    const [cnyCadRates, setCnyCadRates] = useState([]);
    const [cnyUsdRates, setCnyUsdRates] = useState([]);
    const [latestCnyCadRate, setLatestCnyCadRate] = useState(null);
    const [latestCnyUsdRate, setLatestCnyUsdRate] = useState(null);

    useEffect(() => {
        const fetchCnyCadRates = async () => {
            try {
                const cnyCadData = await get('/exchange-rates/CNY-CAD');
                setCnyCadRates(
                    cnyCadData.map(item => ({
                        timestamp: new Date(item.timestamp),
                        buyRate: parseFloat(item.buyRate),
                        sellRate: parseFloat(item.sellRate),
                    }))
                );
                setLatestCnyCadRate(cnyCadData[cnyCadData.length - 1]);
                console.log("CNY-CAD exchange rates:", cnyCadData);
            } catch (error) {
                console.error("Error fetching CNY-CAD exchange rates:", error);
            }
        };

        const fetchCnyUsdRates = async () => {
            try {
                const cnyUsdData = await get('/exchange-rates/CNY-USD');
                setCnyUsdRates(
                    cnyUsdData.map(item => ({
                        timestamp: new Date(item.timestamp),
                        buyRate: parseFloat(item.buyRate),
                        sellRate: parseFloat(item.sellRate),
                    }))
                );
                setLatestCnyUsdRate(cnyUsdData[cnyUsdData.length - 1]);
                console.log("CNY-USD exchange rates:", cnyUsdData);
            } catch (error) {
                console.error("Error fetching CNY-USD exchange rates:", error);
            }
        };

        fetchCnyCadRates();
        fetchCnyUsdRates();
    }, []);

    // Set chart width to 80% of the window width, but not exceed 1200px
    const chartWidth = Math.min(window.innerWidth * 0.8, 1200);
    const chartHeight = chartWidth * 0.5; // Keep the aspect ratio at 2:1

    return (
        <ThemeProvider theme={theme}>
            <div style={{ width: '80%', margin: '0 auto', textAlign: 'left' }}>
                <Typography variant="h4" marginTop={6} gutterBottom>
                    Exchange Rate Tracker
                </Typography>
                <Typography variant="body1" paragraph>
                    The exchange rate data presented here is sourced from the Bank of China (
                    <a href="https://www.boc.cn/sourcedb/whpj/enindex.html" target="_blank" rel="noopener noreferrer">
                        https://www.boc.cn/sourcedb/whpj/enindex.html
                    </a>
                    ). The data is collected using a Spring Boot <Chip label="scheduler job" variant="outlined" size="small" />, which fetches the exchange rate data <Chip label="four times a day" variant="outlined" size="small" />. The goal is to collect <Chip label="exchange rate fluctuation" variant="outlined" size="small" /> data to provide a reference for analysis. If you would like to collect more exchange rate data, please email luyuwen2000@gmail.com.
                </Typography>
                <Grid container spacing={1} justifyContent="center" alignItems="center" style={{ width: '80%', margin: '0 auto' }}>
                    <Grid item xs={12} md={8}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <ExchangeRateChart data={cnyCadRates} title="CNY to CAD Exchange Rates" width={chartWidth} height={chartHeight} />
                        </div>
                    </Grid>
                    <Typography variant="body1" paragraph style={{ marginBottom: '1rem' }}>
                        Latest CNY to CAD Exchange Rate: {latestCnyCadRate ? <strong>{latestCnyCadRate.sellRate}</strong> : 'Loading...'} <span>(as of {latestCnyCadRate ? new Date(latestCnyCadRate.timestamp).toLocaleString() : ''})</span>
                    </Typography>
                    <Grid item xs={12} md={8}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <ExchangeRateChart data={cnyUsdRates} title="CNY to USD Exchange Rates" width={chartWidth} height={chartHeight} />
                        </div>
                    </Grid>
                    <Typography variant="body1" paragraph>
                        Latest CNY to USD Exchange Rate: {latestCnyUsdRate ? <strong>{latestCnyUsdRate.sellRate}</strong> : 'Loading...'} <span>(as of {latestCnyUsdRate ? new Date(latestCnyUsdRate.timestamp).toLocaleString() : ''})</span>
                    </Typography>
                </Grid>
            </div>
        </ThemeProvider>
    );
};

export default ExchangeRateDisplay;
