import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

function NavigationBar() {
    const location = useLocation();

    // 根据路径设置背景颜色
    const getBackgroundColor = () => {
        switch (location.pathname) {
            case '/':
                return '#37B7C3'; // 首页
            case '/laptoppriceprediction':
                return '#9D42AD'; // Laptop Price Prediction 页面
            case '/websiteinfo':
                return '#D0C0F7'; // Project APIs 页面
            case '/cathaypacific':
                return '#005D63'; // Cathay Mixed Cabin Calculator 页面
            case '/exchangerate':
                return '#375763'; // Exchange Rate Display 页面
            default:
                return '#3F51B5'; // 默认颜色
        }
    };

    return (
        <AppBar
            position="static"
            sx={{
                height: '2.5rem',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 1rem',
                marginBottom: '0.5rem',
                backgroundColor: getBackgroundColor(), // 动态背景颜色
            }}
        >
            <Typography variant="h6" sx={{ lineHeight: '2.5rem' }}>
                <Button
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'white',
                        fontFamily: theme.typography.fontFamily,
                    }}
                    component={RouterLink}
                    to="/"
                >
                    home
                </Button>
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    sx={{
                        fontSize: '0.8rem',
                        color: '#071952',
                        backgroundColor: '#EBF4F6',
                        height: '2rem',
                        fontWeight: 'bold',
                        fontFamily: theme.typography.fontFamily,
                    }}
                    component={RouterLink}
                    to="/websiteinfo"
                >
                    <motion.div
                        style={{
                            width: 10,
                            height: 10,
                            marginRight: '0.5rem',
                            borderRadius: '50%',
                            backgroundColor: '#FF002C',
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 4,
                        }}
                    />
                    Website Info
                </Button>
            </div>
        </AppBar>
    );
}

export default NavigationBar;
