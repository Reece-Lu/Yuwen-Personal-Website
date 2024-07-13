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
        <div style={{ height: '80vh', width: '100%' }}>
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
                <MiniMap zoomable pannable />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
}

export default SystemArchitecture;
