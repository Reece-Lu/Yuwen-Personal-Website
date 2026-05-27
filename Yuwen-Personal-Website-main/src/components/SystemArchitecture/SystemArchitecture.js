import React, { useCallback } from 'react';
import '@xyflow/react/dist/style.css';
import ResizerNode from './ResizerNode';
import GroupNode from './GroupNode';
import {
    initialNodes,
    initialEdges,
} from './initial-elements';
import styles from './SystemArchitecture.module.css';

import {
    ReactFlow,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import './overview.css';
import Typography from '@mui/joy/Typography';

const nodeTypes = {
    resizer: ResizerNode,
    group: GroupNode,
};

const fitViewOptions = {
    padding: 0.04,
};

const titleSx = {
    marginBottom: '1rem',
    marginLeft: '2rem',
    marginTop: '1rem',
    fontFamily: 'Nunito, Arial, sans-serif',
};

function SystemArchitecture() {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className={styles.architectureRoot}>
            <Typography level="h2" sx={titleSx}>
                Website Architecture
            </Typography>
            <div className={styles.architectureFlow}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    fitViewOptions={fitViewOptions}
                    minZoom={0.2}
                    maxZoom={1.3}
                    attributionPosition="top-right"
                    nodeTypes={nodeTypes}
                    className="overview"
                >
                    <MiniMap zoomable pannable style={{ height: 100, width: 150 }} />
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}

export default SystemArchitecture;
