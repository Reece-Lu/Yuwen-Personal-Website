import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Link from '@mui/joy/Link';
import { getIconByName } from '../utils/iconHelpers';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const AttachmentsBar = ({ downloadFiles, gitHubLink, pageLink }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: '0.75rem', fontSize: '1rem', flexWrap: 'wrap' }}>
                <Tooltip title="GitHub Repository">
                    <Link href={gitHubLink} target="_blank" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: 'black', '&:hover': { color: 'blue' } }}>
                        <img src={getIconByName('github')} alt="GitHub" style={{ height: '1.5rem', marginRight: '0.25rem' }} />
                        <span style={{ color: 'inherit', fontSize: '0.75rem' }}>Repository</span>
                    </Link>
                </Tooltip>
                {downloadFiles.map((file, index) => {
                    const iconSrc = getIconByName(file.iconName);
                    const downloadLink = `https://www.meetyuwen.com/springapp/download/${file.filenameOnServer}`;
                    return (
                        iconSrc && (
                            <Tooltip title={file.fileName} key={index}>
                                <Link href={downloadLink} target="_blank" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: 'black', '&:hover': { color: 'blue' } }}>
                                    <img src={iconSrc} alt={file.fileName} style={{ height: '1.5rem', marginRight: '0.25rem' }} />
                                    <span style={{ color: 'inherit', fontSize: '0.75rem' }}>{file.fileName}</span>
                                </Link>
                            </Tooltip>
                        )
                    );
                })}
            </Box>
            <Tooltip title="View Detailed Page">
                {pageLink && (
                    <Button
                        variant="contained"
                        href={pageLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="sm"
                        sx={{
                            fontSize: '0.75rem',
                            marginTop: { xs: '0.5rem', md: '0' },
                            alignSelf: { xs: 'flex-start', md: 'center' }
                        }}
                    >
                        View Page
                        <KeyboardArrowRight />
                    </Button>
                )}
            </Tooltip>
        </Box>
    );
};

export default AttachmentsBar;
