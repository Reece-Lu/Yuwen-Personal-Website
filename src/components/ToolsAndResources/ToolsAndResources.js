import React from 'react';
import { createTheme } from '@mui/material/styles';
import Typography from "@mui/joy/Typography";
import Box from "@mui/material/Box";
import CathayPacific from '../../assets/CathayPacific.jpg';
import ExchangeRate from '../../assets/Currency_Exchange_Rate.png';
import CustomToolCard from "../CustomToolCard";
import Grid from "@mui/material/Grid";

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // 添加调色板
        },
    },
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

function ToolsAndResources() {
    return (
        <Box>
            <Typography level="h2" sx={{ fontFamily: theme.typography.fontFamily, marginBottom: '1rem' }}>
                Tools And Resources
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <CustomToolCard
                        title="Mileage Calculator"
                        description="Use this tool to easily calculate your Cathay Pacific mileage points."
                        image={CathayPacific}
                        link="https://meetyuwen.com/cathaypacific"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <CustomToolCard
                        title="Exchange Rate Tracker"
                        description="Get real-time exchange rates for CNY, USD, and CAD with easy conversions."
                        image={ExchangeRate}
                        link="https://meetyuwen.com/exchangerate"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ToolsAndResources;
