import React, { useState } from 'react';
import { Table , Button, Modal, Spinner } from 'react-bootstrap';


const BootstrapTable = (props: any) => {
    const { headers, data, rows, subTable } = props;
    return(<>
    <Table hover variant='light'>
        <tbody>
        <tr>
        {headers.map((header: any, i: number) =>
            <th key={`key-${header}-${i}`}>{header}</th>
        )}
        </tr>
        {data.map((columns: any) => 
        <tr>
         {[columns].map((cell: any, i: number) =>
            <>
            <td>{`${cell}.${rows}`}</td>
            </>
         )}
        </tr>
        )}
         <tr>
                {subTable &&  (
                  <td className='subquestions-table' colSpan={7}>
                    <BootstrapTable 
                       headers={['sdsd']}
                       data={['123','3324']}
                       rows={[123, 2323, <div>hello</div>]}
                    />
                  </td>
                )}
        </tr>
        </tbody>
    </Table>
    </>)
}

export default BootstrapTable