import { memo } from 'react';

function GroupNode({ data }) {
    const { label } = data;

    return (
        <div style={{ padding: 10 }}>
            {label}
        </div>
    );
}

export default memo(GroupNode);
