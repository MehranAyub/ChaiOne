import React, { useRef } from 'react';

// Utils
import formatDate from '../utils/FormatDate';

export interface DateCellProps {
    dateModified: string;
}

const DateCell = (props: DateCellProps) => {
    const todayDateObj = useRef(formatDate(new Date().toDateString()));
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>{
                props.dateModified && formatDate(props.dateModified, todayDateObj)
            }</div>
            {props.dateModified?.includes('Today') ? <div className="green-circle"></div> : <></>}
        </div>
        )
};

export default DateCell;