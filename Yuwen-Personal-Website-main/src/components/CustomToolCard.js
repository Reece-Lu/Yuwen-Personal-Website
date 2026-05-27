import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

function CustomToolCard({ title, description, image, link }) {
    return (
        <Card sx={{ maxWidth: 345, margin: '20px auto' }}>
            <CardActionArea href={link}>
                <CardMedia
                    component="img"
                    height="140"
                    image={image}
                    alt={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: theme.typography.fontFamily }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: theme.typography.fontFamily }}>
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CustomToolCard;
