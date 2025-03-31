import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import { Box } from '@mui/material';

const nodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Smartprix.com' },
        position: { x: 100, y: 50 },
        style: { backgroundColor: '#ffffff', border: '1px solid #cccccc', padding: 10 },
    },
    {
        id: '2',
        data: { label: 'Python' },
        position: { x: 100, y: 150 },
        style: { backgroundColor: '#ffffff', border: '1px solid #cccccc', padding: 10 },
    },
    {
        id: '3',
        data: { label: 'Scrapy' },
        position: { x: 100, y: 250 },
        style: { backgroundColor: '#ffffff', border: '1px solid #cccccc', padding: 10 },
    },
    {
        id: '4',
        data: { label: 'Raw .CSV' },
        position: { x: 300, y: 150 },
        style: { backgroundColor: '#004d7a', color: '#ffffff', padding: 10 },
    },
    {
        id: '5',
        data: { label: 'Cleaned .CSV' },
        position: { x: 500, y: 150 },
        style: { backgroundColor: '#004d7a', color: '#ffffff', padding: 10 },
    },
    {
        id: '6',
        data: { label: 'Model Training' },
        position: { x: 700, y: 150 },
        style: { backgroundColor: '#004d7a', color: '#ffffff', padding: 10 },
    },
    {
        id: '7',
        data: { label: 'Model Evaluation & Deployment' },
        position: { x: 900, y: 150 },
        style: { backgroundColor: '#004d7a', color: '#ffffff', padding: 10 },
    },
];

const edges = [
    {
        id: 'e1-4',
        source: '1',
        target: '4',
        type: 'smoothstep',
    },
    {
        id: 'e2-4',
        source: '2',
        target: '4',
        type: 'smoothstep',
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'smoothstep',
    },
    {
        id: 'e4-5',
        source: '4',
        target: '5',
        type: 'smoothstep',
    },
    {
        id: 'e5-6',
        source: '5',
        target: '6',
        type: 'smoothstep',
    },
    {
        id: 'e6-7',
        source: '6',
        target: '7',
        type: 'smoothstep',
    },
];

const LaptopPriceWorkflow = () => {
    return (
        <Box sx={{ height: 500 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                snapToGrid={true}
            >
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </Box>
    );
};

export default LaptopPriceWorkflow;
