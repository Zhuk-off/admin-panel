import React, { Component } from 'react';

export default class EditorMeta extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meta: {
                title: '',
                keywords: '',
                description: '',
            },
        };
    }

    componentDidMount() {
        this.getMeta(this.props.virtualDom);
    }

    componentDidUpdate(prevProps) {
        if (this.props.virtualDom !== prevProps.virtualDom) {
            this.getMeta(this.props.virtualDom);
        }
    }

    getMeta(virtualDom) {
        this.title =
            virtualDom.head.querySelector('title') ||
            virtualDom.head.appendChild(virtualDom.createElement('title'));

        this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');
        if (!this.keywords) {
            this.keywords = virtualDom.head.appendChild(
                virtualDom.createElement('meta')
            );
            this.keywords.setAttribute('name', 'keywords');
            this.keywords.setAttribute('content', '');
        }

        this.description = virtualDom.head.querySelector(
            'meta[name="description"]'
        );
        if (!this.description) {
            this.description = virtualDom.head.appendChild(
                virtualDom.createElement('meta')
            );
            this.description.setAttribute('name', 'description');
            this.description.setAttribute('content', '');

        }

        this.setState({
            meta: {
                title: this.title.innerHTML,
                keywords: this.keywords.getAttribute('content'),
                description: this.description.getAttribute('content'),
            },
        });
    }

    applyMeta() {
        this.title.innerHTML = this.state.meta.title;
        this.keywords.setAttribute('content', this.state.meta.keywords);
        this.description.setAttribute('content', this.state.meta.description);
    }

    onValueChange(e) {
        if (e.target.getAttribute('data-title')) {
            this.setState(({ meta }) => {
                const newMeta = {
                    ...meta,
                    title: e.target.value,
                };
                return { meta: newMeta };
            });
        } else if (e.target.getAttribute('data-key')) {
            this.setState(({ meta }) => {
                const newMeta = {
                    ...meta,
                    keywords: e.target.value,
                };
                return { meta: newMeta };
            });
        } else {
            this.setState(({ meta }) => {
                const newMeta = {
                    ...meta,
                    description: e.target.value,
                };
                return { meta: newMeta };
            });
        }
    }

    render() {
        const { modal, target } = this.props;
        const { title, keywords, description } = this.state.meta;
        return (
            <div id={target} uk-modal={modal} container="false">
                <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">
                        Редактирование Мета-тегов
                    </h2>

                    <form>
                        <fieldset className="uk-fieldset">
                            <div className="uk-margin">
                                <input
                                    data-title
                                    className="uk-input"
                                    type="text"
                                    placeholder="Title"
                                    aria-label="Input"
                                    onChange={(e) => this.onValueChange(e)}
                                    value={title}
                                />
                            </div>

                            <div className="uk-margin">
                                <textarea
                                    data-key
                                    className="uk-textarea"
                                    rows="5"
                                    placeholder="Keywords"
                                    aria-label="Textarea"
                                    value={keywords}
                                    onChange={(e) => this.onValueChange(e)}
                                ></textarea>
                            </div>
                            <div className="uk-margin">
                                <textarea
                                    data-descr
                                    className="uk-textarea"
                                    rows="5"
                                    placeholder="Description"
                                    aria-label="Textarea"
                                    value={description}
                                    onChange={(e) => this.onValueChange(e)}
                                ></textarea>
                            </div>
                        </fieldset>
                    </form>

                    <p className="uk-text-right">
                        <button
                            className="uk-button uk-button-default uk-modal-close uk-margin-small-right"
                            type="button"
                        >
                            Отменить
                        </button>
                        <button
                            className="uk-button uk-button-primary uk-modal-close"
                            type="button"
                            onClick={() => {
                                this.applyMeta();
                            }}
                        >
                            Применить
                        </button>
                    </p>
                </div>
            </div>
        );
    }
}
