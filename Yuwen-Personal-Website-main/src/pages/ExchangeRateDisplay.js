import React from 'react';
import TradingViewSymbolOverview from "../components/TradingViewSymbolOverview";
import { Typography, Chip } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontFamily: 'Avenir, Nunito, Arial, sans-serif',
        fontSize: 14,
    },
});

const RATES = [
    { title: 'CNY to CAD Exchange Rates', symbol: 'FX_IDC:CADCNY', label: 'CAD / CNY' },
    { title: 'CNY to USD Exchange Rates', symbol: 'FX_IDC:USDCNY', label: 'USD / CNY' },
];

const ExchangeRateDisplay = () => {
    // Keep the previous 2:1 chart proportions, with room for the widget header on phones.
    const chartWidth = Math.min(window.innerWidth * 0.8, 1200);
    const chartHeight = Math.max(chartWidth * 0.5, 380);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ width: '80%', margin: '0 auto', textAlign: 'left' }}>
                <Typography variant="h3" marginTop={6} gutterBottom sx={{ fontWeight: 'bold' }}>
                    Exchange Rate Tracker
                </Typography>
                <Typography variant="body1" paragraph>
                    The charts below are live <Chip label="TradingView" variant="outlined" size="small" /> widgets
                    showing <Chip label="market exchange rates" variant="outlined" size="small" /> for the Canadian
                    dollar and the US dollar against the Chinese yuan. Use the range buttons under each chart to switch
                    between one month and the full history.
                </Typography>
                {RATES.map(rate => (
                    <div key={rate.symbol} style={{ maxWidth: 1200, margin: '0 auto 2rem' }}>
                        <h2>{rate.title}</h2>
                        <TradingViewSymbolOverview symbol={rate.symbol} label={rate.label} height={chartHeight} />
                    </div>
                ))}
            </div>
        </ThemeProvider>
    );
};

export default ExchangeRateDisplay;
