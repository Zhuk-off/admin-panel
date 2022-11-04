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
        this.currentPage = `../${page}`;
        this.iframe.load(this.currentPage, () => {
            const body = this.iframe.contentDocument.body;
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
            textNodes.forEach((node) => {
                const wrapper =
                    this.iframe.contentDocument.createElement('text-editor'); 
                node.parentNode.replaceChild(wrapper, node); 
                wrapper.appendChild(node);
                wrapper.contentEditable = 'true';
            });
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
            <iframe src={this.currentPage} />

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
