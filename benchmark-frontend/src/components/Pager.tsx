import React from 'react';

function Pager(props: any) {
    const { totalPage, activePage, setActivePage } = props;

    return <ul className="pagination">
        {
            // @ts-ignore
            [...Array(totalPage).keys()]
                .map((i: any) => <li
                    key={`dash-page-${i}`}
                    className={`${activePage == i + 1 ? 'active' : ''}`}
                    onClick={() => setActivePage(i + 1)}
                >{i + 1}</li>)}
    </ul>
}

export default Pager;