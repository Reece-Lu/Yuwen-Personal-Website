import React, { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import 'react-flow-renderer/dist/style.css';
import ResizerNode from './ResizerNode';
import GroupNode from './GroupNode';
import {
    initialNodes,
    initialEdges,
} from './initial-elements';

import {
    ReactFlow,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
} from '@xyflow/react';
import './overview.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/joy/Typography';


const theme = createTheme({
    typography: {
        fontFamily: 'Nunito, Arial, sans-serif',
    },
});

const nodeTypes = {
    resizer: ResizerNode,
    group: GroupNode,
};

const nodeClassName = (node) => node.type;

function SystemArchitecture() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div>
            <Typography level="h2" sx={{ fontFamily: theme.typography.fontFamily}}>Website Architecture</Typography>
            <div style={{ height: '60vh', width: '90%', margin: 'auto', marginBottom: '10px' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    attributionPosition="top-right"
                    nodeTypes={nodeTypes}
                    className="overview"
                >
                    <MiniMap zoomable pannable style={{ height: 100, width: 150 }}/>
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
                <box sx={{ height: '1vh', marginTop:'1vh'}} />
            </div>
        </div>
    );
}

export default SystemArchitecture;
