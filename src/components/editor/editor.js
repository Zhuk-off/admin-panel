import axios from 'axios';
import React, { Component } from 'react';

export default class Editor extends Component {
    constructor() {
        super();
        this.state = {
            pageList: [],
            newPageName: '',
        };
        this.createNewPage = this.createNewPage.bind(this);
    }

    componentDidMount() {
        this.loadPageList();
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

    render() {
        const { pageList } = this.state;
        const pages = pageList.map((page) => {
            return <h2 key={page}>{page}</h2>;
        });
        return (
            <>
                <input
                    type="text"
                    onChange={(e) =>
                        this.setState({ newPageName: e.target.value })
                    }
                />
                <button onClick={this.createNewPage}>Создать страницу</button>
                {pages}
            </>
        );
    }
}
