import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

export default function DividerText({ label }) {
    return (
        <Root>
            <Divider textAlign="left" sx={{mt:'1rem', mb:'0.5rem'}}>
                <Chip label={ label } color="success" size="small" />
            </Divider>
        </Root>
    );
}
