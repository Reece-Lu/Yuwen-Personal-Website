import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import '../../assets/fonts/Nunito/fonts.css';

import masterIcon from '../../assets/master-icon.png';
import bachelorIcon from '../../assets/coder.png';
import exchangeIcon from '../../assets/computer.png';

const EducationItem = ({ degree, imageName, institution, dateRange, details }) => {
    let iconSrc;
    switch(imageName) {
        case 'master':
            iconSrc = masterIcon;
            break;
        case 'bachelor':
            iconSrc = bachelorIcon;
            break;
        case 'exchange':
            iconSrc = exchangeIcon;
            break;
        default:
            iconSrc = '';
    }

    return (
        <Box>
            <Box>
                <Typography variant="body2" component="h3" sx={{ fontSize: '0.875rem'}} >
                    {iconSrc && (
                        <Box component="img" src={iconSrc} alt={degree + " icon"}
                             sx={{ width: 'auto', height: '1rem', mr: 0.5 }} />
                    )}
                    {degree}
                </Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'left',
                justifyContent: 'space-between'
            }}>
            <Typography variant="body2" color="text.secondary" sx={{ ml: { sm: 3 } }}>
                {institution}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize:'0.75rem' }}>
                {dateRange}
            </Typography>
            </Box>
        </Box>

    );

};

const Education = () => {
    const educationHistory = [
        {
            degree: "M.Eng. Applied Data Science",
            imageName: 'master',
            institution: "University of Victoria",
            dateRange: "Sep 2022 - Aug 2023",
        },
        {
            degree: "B.Eng. Software Engineering",
            imageName: 'bachelor',
            institution: "Beijing Union University",
            dateRange: "Sep 2018 - Jul 2022"
        },
        {
            degree: "Exchange Program in Computer Science",
            imageName: 'exchange',
            institution: "University of Science and Technology Beijing",
            dateRange: "Sep 2020 - Jan 2021"
        },
    ];

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', marginTop:'0.5rem'}}>
            {educationHistory.map((edu, index) => (
                <EducationItem key={index} {...edu} />
            ))}
        </Box>
    );
};

export default Education;
