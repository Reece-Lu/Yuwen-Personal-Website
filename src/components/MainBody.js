import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import RightPanel from './mainpage/RightPanel';
import LeftPanel from './mainpage/LeftPanel';
import Projects from './mainpage/Projects';
import NoteDisplay from '../components/notedisplay/NoteDisplay';
import VmUsageChart from '../components/VmUsageChart';
import Box from '@mui/material/Box';
import SystemArchitecture from '../components/SystemArchitecture/SystemArchitecture';
import ProjectAPIs from '../pages/ProjectAPIsPage/ProjectAPIs';


function MainBody() {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="stretch">
                {/* Left Panel */}
                <Grid item xs={12} md={4.58}>
                    <LeftPanel />
                </Grid>
                {/* Right Panel */}
                <Grid item xs={12} md={7.42}>
                    <RightPanel />
                </Grid>
                <Grid item xs={12}>
                    <Projects />
                </Grid>
                <Grid item xs={12} md={5.5}>
                    <NoteDisplay />
                </Grid>
                <Grid item xs={12} md={6.5}>
                    <VmUsageChart />
                </Grid>
                <Grid item xs={12}>
                    <SystemArchitecture />
                </Grid>
                <Grid item xs={12}>
                    <ProjectAPIs />
                </Grid>
            </Grid>
        </Container>
    );
}

export default MainBody;
