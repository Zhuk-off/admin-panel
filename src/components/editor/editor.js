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
            console.log(this.currentPage);
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
