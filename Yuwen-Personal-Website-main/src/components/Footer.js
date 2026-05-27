import React from 'react';
import { Box, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

const Footer = () => {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', p: 6, mt: 'auto' }}>
            <Typography variant="body1" align="center" color="text.secondary" component="p" sx={{fontFamily: theme.typography.fontFamily, marginTop: '1rem'}}>
                © 2024 Yuwen Lu. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
