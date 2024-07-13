import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

function ResizerNode({ data }) {
    const { label, handles = {} } = data;

    const renderHandles = (position, type, count, positionKey) => {
        const isHorizontal = position === Position.Top || position === Position.Bottom;
        const increment = 100 / (count + 1); // Divide the node evenly

        return Array.from({ length: count }, (_, index) => {
            const handleId = `${positionKey}-${index + 1}`;
            return (
                <Handle
                    key={handleId}
                    type={type}
                    position={position}
                    id={handleId} // Set ID for edges
                    style={{
                        [isHorizontal ? 'left' : 'top']: `${(index + 1) * increment}%`,
                        transform: isHorizontal ? 'translateX(-50%)' : 'translateY(-50%)',
                    }}
                />
            );
        });
    };

    return (
        <div>
            <NodeResizer minWidth={50} minHeight={50} />
            {renderHandles(Position.Top, 'source', handles.top?.source || 0, 'top-source')}
            {renderHandles(Position.Top, 'target', handles.top?.target || 0, 'top-target')}
            {renderHandles(Position.Bottom, 'source', handles.bottom?.source || 0, 'bottom-source')}
            {renderHandles(Position.Bottom, 'target', handles.bottom?.target || 0, 'bottom-target')}
            {renderHandles(Position.Left, 'source', handles.left?.source || 0, 'left-source')}
            {renderHandles(Position.Left, 'target', handles.left?.target || 0, 'left-target')}
            {renderHandles(Position.Right, 'source', handles.right?.source || 0, 'right-source')}
            {renderHandles(Position.Right, 'target', handles.right?.target || 0, 'right-target')}
            <div style={{ padding: 10 }}>{label}</div>
        </div>
    );
}

export default memo(ResizerNode);
