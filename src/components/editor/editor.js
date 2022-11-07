import axios from 'axios';
import React, { Component } from 'react';
import '../../helpers/iframeLoader.js';
import DOMHelper from '../../helpers/dom-helper.js';
import EditorText from '../editor-text';

export default class Editor extends Component {
    constructor() {
        super();
        this.currentPage = 'index.html';
        this.state = {
            pageList: [],
            newPageName: '',
        };
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.init(this.currentPage);
    }

    init(page) {
        this.iframe = document.querySelector('iframe');
        this.open(page);
        this.loadPageList();
    }

    open(page) {
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
                await this.iframe.load('../temp.html');
            })
            .then(() => this.enableEditing())
            .then(() => this.injectStyles());
    }

    save() {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        const html = DOMHelper.serializeDomToString(newDom);
        axios.post('./api/savePage.php', { pageName: this.currentPage, html });
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
        axios.get('./api').then((res) => this.setState({ pageList: res.data }));
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

    render() {
        // const { pageList } = this.state;
        // const pages = pageList.map((page) => {
        //     return (
        //         <h2 key={page}>
        //             {page}
        //             <a onClick={() => this.deletePage(page)} href="#">
        //                 (x)
        //             </a>
        //         </h2>
        //     );
        // });

        return (
            <>
                <button style={{ zIndex: 10 }} onClick={() => this.save()}>
                    click
                </button>
                <iframe src={this.currentPage} />
            </>

            // <>
            //     <input
            //         type="text"
            //         onChange={(e) =>
            //             this.setState({ newPageName: e.target.value })
            //         }
            //     />
            //     <button onClick={this.createNewPage}>Создать страницу</button>
            //     {pages}
            // </>
        );
    }
}
