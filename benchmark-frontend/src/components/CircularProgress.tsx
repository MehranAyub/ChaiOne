import React from 'react';

// Libraries
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function CircularProgress(props: any) {
    return <div style={{ width: props.width }}>
        <CircularProgressbar value={props.value}
            strokeWidth={props.stroke}
            styles={{
                path: {
                    // Path color
                    stroke: `#44cfcb`,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',

                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                    // Trail color
                    stroke: 'rgba(160, 169, 186, 0.25)',
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',

                }
            }
            } />
    </div>
}


export default CircularProgress;