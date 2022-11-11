import axios from 'axios';
import React, { Component } from 'react';
import '../../helpers/iframeLoader.js';
import DOMHelper from '../../helpers/dom-helper.js';
import EditorText from '../editor-text';
import UIkit from 'uikit';
import Spinner from '../spinner';
import ConfirmModal from '../confirm-modal';
import ChooseModal from '../choose-modal';
import Panel from '../panel';
import EditorMeta from '../editor-meta';
import EditorImages from '../editor-images';
import Login from '../login';

export default class Editor extends Component {
    currentPage = 'index.html';
    state = {
        pageList: [],
        newPageName: '',
        backupsList: [],
        loading: true,
        auth: false,
        loginError: false,
        loginLengthError: false,
    };

    componentDidMount() {
        this.checkAuth();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.auth != prevState.auth) {
            this.init(this.currentPage);
        }
    }

    checkAuth = () => {
        axios.get('./api/checkAuth.php').then((res) => {
            this.setState({ auth: res.data.auth });
        });
    };

    login = (pass) => {
        if (pass.length > 8) {
            axios.post('./api/login.php', { password: pass }).then((res) => {
                this.setState({
                    auth: res.data.auth,
                    loginError: !res.data.auth,
                    loginLengthError: false,
                });
            });
        } else {
            this.setState({
                loginError: false,
                loginLengthError: true,
            });
        }
    };

    logout = () => {
        axios.get('./api/logout.php').then(() => {
            window.location.replace('/');
        });
    };

    init = (page, e) => {
        if (e !== undefined && e !== null) {
            e.preventDefault();
        }

        if (this.state.auth) {
            this.isLoading();
            this.iframe = document.querySelector('iframe');
            this.open(page, this.isLoaded);
            this.loadPageList();
            this.loadBackupsList();
        }
    };

    open = (page, spinner) => {
        this.currentPage = page;
        axios
            .get(`../${page}?rnd-${Math.random()}`)
            .then((res) => DOMHelper.parseStrToDom(res.data))
            .then(DOMHelper.wrapTextNodes)
            .then(DOMHelper.wrapImages)
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
        this.loadBackupsList();
    };

    save = async () => {
        this.isLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMHelper.unwrapTextNodes(newDom);
        DOMHelper.unwrapImages(newDom);
        const html = DOMHelper.serializeDomToString(newDom);
        await axios
            .post('./api/savePage.php', { pageName: this.currentPage, html })
            .then(() => this.showNotifications('Успешно сохранено', 'success'))
            .catch(() => this.showNotifications('Ошибка сохранения', 'danger'))
            .finally(this.isLoaded);
        this.loadBackupsList();
    };

    enableEditing = () => {
        this.iframe.contentDocument.body
            .querySelectorAll('text-editor')
            .forEach((element) => {
                const id = element.getAttribute('data-nodeid');
                const virtualElement = this.virtualDom.body.querySelector(
                    `[data-nodeid="${id}"]`
                );
                new EditorText(element, virtualElement);
            });

        this.iframe.contentDocument.body
            .querySelectorAll('[data-editableimgid]')
            .forEach((element) => {
                const id = element.getAttribute('data-editableimgid');
                const virtualElement = this.virtualDom.body.querySelector(
                    `[data-editableimgid="${id}"]`
                );
                new EditorImages(
                    element,
                    virtualElement,
                    this.isLoading,
                    this.isLoaded,
                    this.showNotifications
                );
            });
    };

    injectStyles = () => {
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
        [data-editableimgid]:hover {
            outline: 3px solid orange;
            outline-offset: 8px;
        }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    };

    showNotifications = (message, status) => {
        UIkit.notification({ message, status });
    };

    loadPageList = () => {
        axios
            .get('./api/pageList.php')
            .then((res) => this.setState({ pageList: res.data }));
    };

    loadBackupsList = () => {
        axios.get('./backups/backups.json').then((res) =>
            this.setState({
                backupsList: res.data.filter((backup) => {
                    return backup.page === this.currentPage;
                }),
            })
        );
    };

    restoreBackup = (backup, e) => {
        if (e !== undefined && e !== null) {
            e.preventDefault();
        }
        UIkit.modal
            .confirm(
                'Вы действительно хотите восстановить страницу из этой резервной копии? Все несохраненные данные будут потеряны!',
                { labels: { ok: 'Восстановить', cancel: 'Отмена' } }
            )
            .then(() => {
                this.isLoading();
                return axios.post('./api/restoreBackup.php', {
                    page: this.currentPage,
                    file: backup,
                });
            })
            .then(() => {
                this.open(this.currentPage, this.isLoaded);
            });
    };

    isLoading = () => {
        this.setState({ loading: true });
    };

    isLoaded = () => {
        this.setState({ loading: false });
    };

    render() {
        const {
            loading,
            pageList,
            backupsList,
            auth,
            loginError,
            loginLengthError,
        } = this.state;
        const spinner = loading ? <Spinner active /> : <Spinner />;
        if (!auth) {
            return (
                <Login
                    login={this.login}
                    lengthErr={loginLengthError}
                    logErr={loginError}
                />
            );
        }

        return (
            <>
                <iframe src="" />
                <input
                    id="img-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                ></input>

                {spinner}

                <Panel />

                <ConfirmModal
                    modal="true"
                    target={'modal-save'}
                    method={this.save}
                    text={{
                        title: 'Сохранение',
                        descr: 'Вы действительно хотите сохранить изменения?',
                        button: 'Опубликовать',
                    }}
                />
                <ConfirmModal
                    modal="true"
                    target={'modal-logout'}
                    method={this.logout}
                    text={{
                        title: 'Выход',
                        descr: 'Вы действительно хотите выйти?',
                        button: 'Выйти',
                    }}
                />
                <ChooseModal
                    modal="true"
                    target={'modal-open'}
                    data={pageList}
                    redirect={this.init}
                />
                <ChooseModal
                    modal="true"
                    target={'modal-backup'}
                    data={backupsList}
                    redirect={this.restoreBackup}
                />
                {this.virtualDom ? (
                    <EditorMeta
                        modal="true"
                        target={'modal-meta'}
                        virtualDom={this.virtualDom}
                    />
                ) : (
                    false
                )}
            </>
        );
    }
}
