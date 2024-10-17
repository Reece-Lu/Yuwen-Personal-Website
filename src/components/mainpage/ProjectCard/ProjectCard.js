import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import IconBar from '../../IconBar';
import styles from './ProjectCard.module.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AttachmentsBar from '../../AttachmentsBar';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

export default function ProjectCard({ projectData }) {
    return (
        <div>
            <Card
                className={styles.card}
            >
                <CardContent className={styles.cardContentBox}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography level="h3" sx={{ fontFamily: theme.typography.fontFamily }}>
                                {projectData.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: theme.typography.fontFamily }}>
                                {projectData.category}
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <Typography sx={{ fontSize: '1rem' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: { xs: 'flex-start', md: 'flex-end' }, fontFamily: theme.typography.fontFamily }}>
                                            <span style={{ fontStyle: 'italic' }}>{projectData.time}</span>
                                        </Box>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                    <IconBar icons={projectData.icons} />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{ fontFamily: theme.typography.fontFamily, paddingTop: '0 !important' }}>
                            <Typography level="body-sm" sx={{ fontFamily: theme.typography.fontFamily }}>
                                {projectData.descriptionList.map((description, index) => (
                                    <Box key={index} sx={{ marginBottom: '0.5rem' }}>
                                        {description.split(/\*\*/).map((part, i) =>
                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                        )}
                                    </Box>
                                ))}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ paddingTop: '0 !important' }}>
                            <AttachmentsBar
                                downloadFiles={projectData.downloadFiles}
                                gitHubLink={projectData.GitHubLink}
                                pageLink={projectData.pageLink}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    );
}
