import React from 'react';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavigationBar() {
    return (
        <AppBar position="static" sx={{
            height: '2.5rem',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 1rem',
            marginBottom: '1rem',
        }}>
            <Typography variant="h6" sx={{ lineHeight: '2.5rem' }}>
                <Button
                    sx={{
                        fontSize: '1rem',
                        color: 'white',
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
                        fontSize: '1rem',
                        color: 'white',
                    }}
                    component={RouterLink}
                    to="/projectapis"
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
                        repeatType: "loop",
                        duration: 4,
                    }}
                />
                    API Doc
                </Button>
            </div>
        </AppBar>
    );
}

export default NavigationBar;
