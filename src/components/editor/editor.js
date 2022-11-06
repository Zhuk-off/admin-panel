import axios from 'axios';
import React, { Component } from 'react';
import '../../helpers/iframeLoader.js';

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
            .then((res) => this.parseStrToDom(res.data))
            .then(this.wrapTextNodes)
            .then((dom) => {
                this.virtualDom = dom;
                return dom;
            })
            .then(this.serializeDomToString)
            .then((res) => axios.post('./api/saveTempPage.php', { html: res }))
            .then(async () => {
                await this.iframe.load('../temp.html');
            })
            .then(() => this.enableEditing());
    }

    save() {
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        this.unwrapTextNodes(newDom);
        const html = this.serializeDomToString(newDom);
        console.log(this.currentPage);
        console.log(html);
        axios.post('./api/savePage.php', { pageName: this.currentPage, html });
    }

    enableEditing() {
        this.iframe.contentDocument.body
            .querySelectorAll('text-editor')
            .forEach((element) => {
                element.contentEditable = 'true';
                element.addEventListener('input', () => {
                    this.onTextEdit(element);
                });
            });
    }

    onTextEdit(element) {
        const id = element.getAttribute('data-nodeid');
        this.virtualDom.body.querySelector(`[data-nodeid="${id}"]`).innerHTML =
            element.innerHTML;
    }

    parseStrToDom(str) {
        const parser = new DOMParser();
        return parser.parseFromString(str, 'text/html');
    }

    wrapTextNodes(dom) {
        const body = dom.body;
        const textNodes = [];
        function recursy(element) {
            element.childNodes.forEach((child) => {
                if (
                    child.nodeName === '#text' &&
                    child.nodeValue.replace(/\s+/g, '').length
                ) {
                    textNodes.push(child);
                } else {
                    recursy(child);
                }
            });
        }
        recursy(body);
        textNodes.forEach((node, i) => {
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node);
            wrapper.appendChild(node);
            wrapper.setAttribute('data-nodeid', i);
        });
        return dom;
    }

    serializeDomToString(dom) {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    }

    unwrapTextNodes(dom) {
        dom.body.querySelectorAll('text-editor').forEach((element) => {
            element.parentNode.replaceChild(element.firstChild, element);
        });
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
