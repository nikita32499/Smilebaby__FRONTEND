'use client';

import { login } from '@/api/users.api';
import { useRef, useState } from 'react';
import style from './style.module.scss';

interface IStateLogin {
    errors: {
        message?: string;
    };
}

export default function Login() {
    const ref = {
        login: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
    };

    const [state, setState] = useState<IStateLogin>({
        errors: {},
    });

    function dropError() {
        setTimeout(() => {
            setState((prev: IStateLogin) => ({
                ...prev,
                errors: {},
            }));
        }, 15000);
    }

    return (
        <div className={style.login}>
            <div className={style.login_box}>
                <img height={50} width={50} src="/favicon.ico" alt="" />
                <h2>{typeof window !== 'undefined' && window.location.hostname}</h2>
                <div className={style.login__inputBox}>
                    <p>Логин</p>
                    <input type="text" ref={ref.login} />
                </div>
                <div className={style.login__inputBox}>
                    <p>Пароль</p>
                    <input type="password" ref={ref.password} />
                </div>
                <p
                    className={style.login__error}
                    style={{ opacity: `${state.errors.message ? '1' : '0'}` }}
                >
                    {state.errors.message ?? '!'}
                </p>
                <button
                    className={style.login__buttonSigin}
                    onClick={async () => {
                        if (!ref.login.current?.value.length) {
                            dropError();
                            return setState((prev: IStateLogin) => ({
                                ...prev,
                                errors: { ...prev.errors, message: 'Введите логин' },
                            }));
                        }

                        if (!ref.password.current?.value.length) {
                            dropError();
                            return setState((prev: IStateLogin) => ({
                                ...prev,
                                errors: { ...prev.errors, message: 'Введите пароль' },
                            }));
                        }

                        const result = await login(
                            ref.login.current.value,
                            ref.password.current.value,
                        );
                        if (typeof result === 'object' && 'role' in result) {
                            if (result.role === 'admin' || result.role === 'moderator') {
                                localStorage.setItem('userData', JSON.stringify(result));
                                window.location.assign(`/panel/admin`);
                            }
                        } else {
                            dropError();
                            setState((prev) => ({
                                ...prev,
                                errors: {
                                    ...prev.errors,
                                    message:
                                        typeof result === 'object'
                                            ? result.message
                                            : 'Что-то пошло не так',
                                },
                            }));
                        }
                    }}
                >
                    Войти
                </button>
            </div>
        </div>
    );
}
