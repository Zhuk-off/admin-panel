import React from 'react';
import UIkit from 'uikit';

const ChooseModal = ({ modal, target, data, redirect }) => {
    const dataFiltered = data.filter(
        (item) => item !== 'temp_change_page.html'
    );
    const list = dataFiltered.map((item) => {
        if (item.time) {
            return (
                <li key={item.file}>
                    <a
                        className="uk-link-muted uk-modal-close"
                        href="#"
                        onClick={(e) => redirect(item.file, e)}
                    >
                       Резервная копия от {item.time}
                    </a>
                </li>
            );
        } else {
            return (
                <li key={item}>
                    <a
                        className="uk-link-muted uk-modal-close"
                        href="#"
                        onClick={(e) => redirect(item, e)}
                    >
                        {item}
                    </a>
                </li>
            );
        }
    });
const msg = data.length === 0 ? (<div>Резервные копии не найдены!</div>) : ''

    return (
        <div id={target} uk-modal={modal} container="false">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">Открыть страницу</h2>
                {msg}
                <ul className="uk-list uk-list-divider">{list}</ul>
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
