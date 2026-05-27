import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/dracula';
import { Box } from '@mui/material';

const CodeDisplay = ({ code }) => (
    <Box sx={{ p: 2, border: '1px solid grey', borderRadius: 1, backgroundColor: '#282a36' }}>
        <Highlight {...defaultProps} code={code.trim()} language="python" theme={theme}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={{ ...style, padding: '30px', borderRadius: '8px' }}>
                    {tokens.map((line, i) => (
                        <div {...getLineProps({ line, key: i })}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    </Box>
);

export default CodeDisplay;
