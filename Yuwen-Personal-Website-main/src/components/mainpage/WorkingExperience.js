import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import companyIcon from '../../assets/ocean_networks_canada_logo.jpeg';


const WorkingExperienceItem = ({ position, company, dateRange}) => {
    let iconSrc = companyIcon;
    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center',marginTop: '1rem' }}>
                <Box component="img" src={iconSrc} alt={company + " icon"} sx={{ width: 'auto', height: '1rem', mr: 0.5, verticalAlign: 'middle' }} />
                <Typography variant="h6" sx={{ fontSize: '0.875rem', lineHeight: '1rem' }}>
                    {position}
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'left',
                justifyContent: 'space-between',
                marginTop:'0.25rem',
            }}>
                <Link href="https://www.oceannetworks.ca/" underline="always">
                    <Typography variant="body2" color="text.secondary" sx={{ ml: { sm: 3 } }}>
                        {company}
                    </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize:'0.75rem'}}>
                    {dateRange}
                </Typography>
            </Box>
        </Box>
    );
};

// This is the main component that uses WorkingExperienceItem
const WorkingExperience = () => {
    const workHistory = {
        position: "Software Test Automation Co-op",
        company: "Ocean Networks Canada",
        dateRange: "Sep 2023 - Aug 2024",
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', marginTop:'1%' }}>
            <WorkingExperienceItem {...workHistory} />
        </Box>
    );
};

export default WorkingExperience;
