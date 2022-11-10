import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pass: '',
        };
    }

    onPassChange(e) {
        this.setState(() => {
            return {
                pass: e.target.value,
            };
        });
    }

    render() {
        const { pass } = this.state;
        const { login } = this.props;
        return (
            <div className="login-container">
                <div className="login">
                    <h2 className="uk-modal-title uk-text-center">
                        Авторизация
                    </h2>
                    <div className="uk-margin-top uk-text-lead">Пароль:</div>
                    <input
                        className="uk-input uk-margin-top"
                        type="password"
                        name=""
                        id=""
                        placeholder="Пароль"
                        defaultValue={pass}
                        onChange={(e) => this.onPassChange(e)}
                    ></input>
                    <span className='login-error'>Введен неправильный пароль!</span>
                    <span className='login-error'>Пароль должен быть длиннее 8 символов</span>
                    <button
                        className="uk-button uk-button-primary uk-margin-top"
                        type="button"
                        onClick={()=> login(pass)}
                    >
                        Вход
                    </button>
                </div>
            </div>
        );
    }
}
