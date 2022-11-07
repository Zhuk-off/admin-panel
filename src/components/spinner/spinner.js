import React from 'react';

const Spinner = ({ active }) => {
    return (
        <div
            uk-spinner="true"
            className={active ? 'spinner active' : 'spinner'}
        ></div>
    );
};

export default Spinner;
