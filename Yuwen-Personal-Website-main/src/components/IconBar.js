import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const getIconByName = (name) => {
    try {
        return require(`../assets/icons/${name}.png`);
    } catch (error) {
        console.error(`Icon ${name} not found!`);
        return null;
    }
};

const IconBar = ({ icons }) => {
    return (
        <Box>
            {icons.map((icon, index) => {
                const iconSrc = icon.includes('.') ? icon : getIconByName(icon);
                return (
                    iconSrc && (
                        <Tooltip title={icon} key={index}>
                            <img src={iconSrc} alt={icon} style={{height: '1.5rem', marginLeft: '0.5rem'}} />
                        </Tooltip>
                    )
                );
            })}
        </Box>
    );
};

export default IconBar;
