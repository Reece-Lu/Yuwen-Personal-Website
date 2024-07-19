import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Education from './Education';
import DividerText from '../DividerText';
import WorkingExperience from './WorkingExperience';
import GitHubCalendar from 'react-github-calendar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

function RightPanel() {
    const calendarContainerRef = useRef(null);

    useEffect(() => {
        const scrollToRight = () => {
            const scrollElement = calendarContainerRef.current.querySelector('.react-activity-calendar__scroll-container');
            if (scrollElement) {
                scrollElement.scrollLeft = scrollElement.scrollWidth;
            }
        };

        const observer = new MutationObserver(() => {
            scrollToRight();
        });

        if (calendarContainerRef.current) {
            observer.observe(calendarContainerRef.current, { childList: true, subtree: true });
            scrollToRight();  // Ensure we scroll after initial load
        }

        return () => {
            if (calendarContainerRef.current) {
                observer.disconnect();
            }
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ fontFamily: theme.typography.fontFamily, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ marginLeft: '2.5%', marginRight: '5%', marginTop: '2rem' }}>
                    <DividerText label='Education' />
                    <Education />
                    <DividerText label='Working Experience' />
                    <WorkingExperience />
                    <DividerText label='Github Contributions' />
                    <Box
                        ref={calendarContainerRef}
                        style={{
                            width: '100%',
                            height: 'auto',
                            marginTop: '3%',
                            marginBottom: '3%',
                            overflowX: 'auto',
                            // Hide scrollbar for Chrome, Safari and Opera
                            WebkitOverflowScrolling: 'touch',
                            '::-webkit-scrollbar': { display: 'none' },
                            // Hide scrollbar for IE, Edge and Firefox
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                    >
                        <GitHubCalendar username="reece-lu" colorScheme="light"/>
                    </Box>
                    <Divider flexItem sx={{ width: '100%', marginTop: 3, marginBottom: 3 }} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default RightPanel;
