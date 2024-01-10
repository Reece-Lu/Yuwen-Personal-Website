import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

function NavigationBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    My Portfolio
                </Typography>
                <Tabs textColor="inherit">
                    <Tab label="Home" />
                    <Tab label="Working Experience" />
                    <Tab label="Projects" />
                    <Tab label="Activities" />
                    <Tab label="Kits" />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}

export default NavigationBar;
