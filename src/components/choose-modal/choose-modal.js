import React from 'react';
import UIkit from 'uikit';

const ChooseModal = ({ modal, target, data, redirect }) => {
    const dataFiltered = data.filter(
        (item) => item !== 'temp_change_page.html'
    );
    const pageList = dataFiltered.map((page) => {
        return (
            <li key={page}>
                <a
                    className="uk-link-muted uk-modal-close"
                    href="#"
                    onClick={(e) => redirect(page, e)}
                >
                    {page}
                </a>
            </li>
        );
    });
    return (
        <div id={target} uk-modal={modal} container="false">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Открыть страницу</h2>
                <ul className="uk-list uk-list-divider">{pageList}</ul>
                <p className="uk-text-right">
                    <button
                        className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
                        type="button"
                    >
                        Отменить
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ChooseModal;
