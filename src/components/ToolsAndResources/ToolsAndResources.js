import React from 'react';
import { createTheme } from '@mui/material/styles';
import Typography from "@mui/joy/Typography";
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import CathayPacific from '../../assets/CathayPacific.jpg';

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
            <Card sx={{ maxWidth: 345, margin: '20px auto' }}>
                <CardActionArea href="https://meetyuwen.com/cathaypacific">
                    <CardMedia
                        component="img"
                        height="140"
                        image= {CathayPacific}
                        alt="Cathay Pacific Mileage Calculator"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: theme.typography.fontFamily }}>
                            Cathay Pacific Mileage Calculator
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: theme.typography.fontFamily }}>
                            Use this tool to easily calculate your Cathay Pacific mileage points.
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
}

export default ToolsAndResources;
