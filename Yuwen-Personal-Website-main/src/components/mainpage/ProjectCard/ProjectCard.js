import React from 'react';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import IconBar from '../../IconBar';
import styles from './ProjectCard.module.css';
import { createTheme } from '@mui/material/styles';
import AttachmentsBar from '../../AttachmentsBar';
import DirectionsRunRoundedIcon from '@mui/icons-material/DirectionsRunRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import GitHubIcon from '@mui/icons-material/GitHub';

const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

const runInsightHighlights = [
    { label: 'SwiftUI app', Icon: PhoneIphoneRoundedIcon },
    { label: 'HealthKit sync', Icon: DirectionsRunRoundedIcon },
    { label: 'AI coach', Icon: AutoAwesomeRoundedIcon },
    { label: 'On-device privacy', Icon: ShieldRoundedIcon },
];

const renderRichText = (description, index) => (
    <Box key={index} sx={{ marginBottom: '0.5rem' }}>
        {description.split(/\*\*/).map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )}
    </Box>
);

const renderCompactRichText = (description, index) => (
    <Box key={index} className={styles.featuredDescriptionLine}>
        {description.split(/\*\*/).map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
        )}
    </Box>
);

export default function ProjectCard({ projectData }) {
    const isRunInsight = projectData.project === 'RunInsight';

    if (isRunInsight) {
        return (
            <div>
                <Card className={`${styles.card} ${styles.featuredCard}`}>
                    <CardContent className={`${styles.cardContentBox} ${styles.featuredContentBox}`}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography level="h3" className={styles.featuredTitle} sx={{ fontFamily: theme.typography.fontFamily }}>
                                    {projectData.title}
                                </Typography>
                                <Typography className={styles.featuredSummary} sx={{ fontFamily: theme.typography.fontFamily }}>
                                    {projectData.summary}
                                </Typography>

                                <Box className={styles.featuredHighlights}>
                                    {runInsightHighlights.map(({ label, Icon }) => (
                                        <span className={styles.featuredHighlight} key={label}>
                                            <Icon sx={{ fontSize: 15 }} />
                                            {label}
                                        </span>
                                    ))}
                                </Box>

                                <Typography level="body-sm" className={styles.featuredDescription} sx={{ fontFamily: theme.typography.fontFamily }}>
                                    {projectData.descriptionList.slice(0, 4).map(renderCompactRichText)}
                                </Typography>

                                <Box className={styles.featuredActions}>
                                    <a href={projectData.pageLink} className={styles.featuredCta}>
                                        {projectData.exploreButton?.label || 'Open Project'}
                                        <KeyboardArrowRightRoundedIcon sx={{ fontSize: 18 }} />
                                    </a>
                                    <a href={projectData.GitHubLink} target="_blank" rel="noopener noreferrer" className={styles.featuredSecondary}>
                                        <GitHubIcon sx={{ fontSize: 17 }} />
                                        Repository
                                    </a>
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Box className={styles.runInsightVisual} aria-hidden="true">
                                    <Box className={styles.phoneShell}>
                                        <Box className={styles.phoneIsland} />
                                        <Box className={styles.phoneScreen}>
                                            <Box className={styles.phoneTopLine}>RunInsight</Box>
                                            <Box className={styles.phoneMetricMain}>1108.18 km</Box>
                                            <Box className={styles.phoneMetricSub}>HealthKit synced mileage</Box>
                                            <Box className={styles.phoneGraph}>
                                                <span style={{ height: '34%' }} />
                                                <span style={{ height: '72%' }} />
                                                <span style={{ height: '48%' }} />
                                                <span style={{ height: '88%' }} />
                                                <span style={{ height: '58%' }} />
                                            </Box>
                                            <Box className={styles.phoneInsightGrid}>
                                                <span>7+ metrics</span>
                                                <span>AI recap</span>
                                            </Box>
                                            <Box className={styles.phoneRouteLine}>
                                                <span />
                                                <span />
                                                <span />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                                {projectData.descriptionList.map(renderRichText)}
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
