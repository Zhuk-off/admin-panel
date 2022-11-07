import axios from 'axios';
import React, { Component } from 'react';
import '../../helpers/iframeLoader.js';
import DOMHelper from '../../helpers/dom-helper.js';
import EditorText from '../editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner';
import ConfirmModal from '../confirm-modal';
import ChooseModal from '../choose-modal';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            pageList: [],
            newPageName: '',
            loading: true,
        };
        this.createNewPage = this.createNewPage.bind(this);
        this.isLoading = this.isLoading.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.save = this.save.bind(this);
        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page, e) {
        if (e !== undefined && e !== null) {
            e.preventDefault();
        }
        this.isLoading();
        this.iframe = document.querySelector('iframe');
        this.open(page, this.isLoaded);
        this.loadPageList();
    }

    open(page, spinner) {
        this.currentPage = page;

        axios
            .get(`../${page}?rnd-${Math.random()}`)
            .then((res) => DOMHelper.parseStrToDom(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then((dom) => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DOMHelper.serializeDomToString)
            .then((res) => axios.post('./api/saveTempPage.php', { html: res }))
            .then(async () => {
                await this.iframe.load('../temp_change_page.html');
            })
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(spinner);
    }

    save(onSuccess, onError) {
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDomToString(newDom);
        axios
            .post('./api/savePage.php', { pageName: this.currentPage, html })
            .then(onSuccess)
            .catch(onError)
            .finally(this.isLoaded);
    }

    enableEditing() {
        this.iframe.contentDocument.body
            .querySelectorAll('text-editor')
            .forEach((element) => {
                const id = element.getAttribute('data-nodeid');
                const virtualElement = this.virtualDom.body.querySelector(
                    `[data-nodeid="${id}"]`
                );
                virtualElement.innerHTML = element.innerHTML;
                new EditorText(element, virtualElement);
            });
    }

    injectStyles() {
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
        text-editor:hover {
            outline: 3px solid orange;
            outline-offset: 8px;
        }
        text-editor:focus {
            outline: 3px solid red;
            outline-offset: 8px;
        }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }

    loadPageList() {
        axios
            .get('./api/pageList.php')
            .then((res) => this.setState({ pageList: res.data }));
    }

    createNewPage() {
        axios
            .post('./api/createNewPage.php', { name: this.state.newPageName })
            .then(this.loadPageList())
            .catch(() => alert('Страница уже существует'));
    }

    deletePage(page) {
        axios
            .post('./api/deletePage.php', { name: page })
            .then(this.loadPageList())
            .catch(() => alert('Страницы не существует'));
    }

    isLoading() {
        this.setState({ loading: true });
    }

    isLoaded() {
        this.setState({ loading: false });
    }

    render() {
        const { loading, pageList } = this.state;
        const spinner = loading ? <Spinner active /> : <Spinner />;
        return (
            <>
                <iframe src="" />

                {spinner}

                <div className="panel">
                    <button
                        className="uk-button uk-button-primary uk-margin-small-right"
                        type="button"
                        uk-toggle="target: #modal-open"
                    >
                        Открыть страницу
                    </button>
                    <button
                        className="uk-button uk-button-primary"
                        type="button"
                        uk-toggle="target: #modal-save"
                    >
                        Опубликовать
                    </button>
                </div>

                <ConfirmModal
                    modal="true"
                    target={'modal-save'}
                    method={this.save}
                />
                <ChooseModal
                    modal="true"
                    target={'modal-open'}
                    data={pageList}
                    redirect={this.init}
                />
            </>
        );
    }
}
