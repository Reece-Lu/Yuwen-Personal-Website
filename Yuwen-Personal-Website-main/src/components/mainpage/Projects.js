import React from 'react';
import Box from '@mui/material/Box';
import ProjectCard from './ProjectCard/ProjectCard';
import { createTheme } from '@mui/material/styles';
import projectDataList from '../../data/projectData';
import Typography from '@mui/joy/Typography';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

function Projects() {
    return (
        <Box>
            <Typography level="h2" sx={{ marginBottom: '1rem', fontFamily: theme.typography.fontFamily }}>Project Gallery</Typography>
            {projectDataList.map((data, index) => (
                <ProjectCard key={index} projectData={data}/>
            ))}
        </Box>
    );
}

export default Projects;
