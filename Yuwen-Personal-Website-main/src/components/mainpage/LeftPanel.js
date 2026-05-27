import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContactInfo from './ContactInfo';


const theme = createTheme({
    typography: {
        fontFamily: 'Merienda, cursive',
    },
});

function LeftPanel() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' , marginLeft: '5%', marginRight: '2.5%', marginTop: '3rem' }}>

            <img src="/images/leftPanelPicture.jpeg" alt="Yuwen Lu" style={{ width: '90%', borderRadius: '5%', marginTop: '0rem'}} />
            <ThemeProvider theme={theme}>
                <Typography variant="h6" style={{marginTop:'3%', fontFamily: theme.typography.fontFamily}}>Yuwen Lu</Typography>
            </ThemeProvider>
            <Typography variant="body2" style={{ marginTop: '3%', textAlign: 'center', fontFamily: theme.typography.fontFamily }}>
                M.Eng in Applied Data Science, University of Victoria. Former Co-op at Ocean Networks Canada, where I focused on software test automation.
            </Typography>
            <ContactInfo/>
        </Box>
    );
}

export default LeftPanel;
