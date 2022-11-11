import React from 'react';

const Panel = () => {
    return (
        <div className="panel">
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal-open"
            >
                Открыть страницу
            </button>
            <button
                className="uk-button uk-button-primary uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal-save"
            >
                Опубликовать
            </button>
            <button
                className="uk-button uk-button-default uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal-meta"
            >
                Редактировать МЕТА-теги
            </button>
            <button
                className="uk-button uk-button-default uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal-backup"
            >
                Восстановить страницу
            </button>
            <button
                className="uk-button uk-button-danger uk-margin-small-right"
                type="button"
                uk-toggle="target: #modal-logout"
            >
                Выйти
            </button>
        </div>
    );
};

export default Panel;
