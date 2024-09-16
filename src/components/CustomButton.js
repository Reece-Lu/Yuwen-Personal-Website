import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ text, onClick, variant = "contained", fullWidth = true, color = "#005D63", hoverColor = "#004a4f", height = 56 }) => {
    return (
        <Button
            variant={variant}
            fullWidth={fullWidth}
            onClick={onClick}
            sx={{
                mt: 3,
                height: height,
                backgroundColor: variant === 'contained' ? color : 'transparent',
                borderColor: variant === 'outlined' ? color : 'none',
                color: variant === 'contained' ? 'white' : color,
                '&:hover': {
                    backgroundColor: variant === 'contained' ? hoverColor : '#E0F7F9',
                    borderColor: hoverColor,
                    color: hoverColor
                }
            }}
        >
            {text}
        </Button>
    );
};

export default CustomButton;
