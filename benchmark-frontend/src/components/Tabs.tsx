import React from 'react';
import { Link } from "react-router-dom";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function Tabs(props: any) {
    return <div className="nav-menu-item-links">
        {props.tabs.map((tab: string, i: number) => <Link key={`key-${tab}-${i}`}
            className={`page-tab-menu nav-menu-item 
        ${props.tabIndex === i ? "nav-menu-item-active page-tab-menu-item-active" : ""}`}
            to={`${window.location.pathname}${window.location.search}`}
            onClick={() => props.setTabIndex(i)}>
            {tab}
            {i === 0 && props.overviewValidation && (<FontAwesomeIcon className='font-awesome-icon' icon={faExclamationCircle} />)} 
            {i === 1 && props.questionsValidation && (<FontAwesomeIcon className='font-awesome-icon' icon={faExclamationCircle} />)} 
        </Link>)}
    </div>
}

export default Tabs;