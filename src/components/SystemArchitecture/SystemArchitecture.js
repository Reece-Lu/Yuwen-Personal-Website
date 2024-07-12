import React, { useCallback, useState } from 'react';
import '@xyflow/react/dist/style.css';
import 'react-flow-renderer/dist/style.css';
import ResizerNode from './ResizerNode'
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
} from '@xyflow/react';
import './overview.css'


const nodeTypes = {
    resizer: ResizerNode,
};

const nodeClassName = (node) => node.type;

function SystemArchitecture() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);


    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                fitView
                attributionPosition="top-right"
                nodeTypes={nodeTypes}
                className="overview"
            >
                <MiniMap zoomable pannable nodeClassName={nodeClassName} />
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
    );
}

export default SystemArchitecture;
