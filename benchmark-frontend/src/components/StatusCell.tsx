import React from 'react';

const StatusCell = (props: any) => {
    const statusLabels = ['New', 'Open', 'Closed'];
    return <span data-testid="status-label">{statusLabels[props.status] || ''}</span>
}

export default StatusCell;