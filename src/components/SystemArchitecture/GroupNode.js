import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

function GroupNode({ data }) {
    const { label } = data;

    return (
        <div style={{ padding: 10 }}>
            {label}
        </div>
    );
}

export default memo(GroupNode);
