'use client';

import { useContext, useEffect, useRef } from 'react';
import { Context } from './context';

import { createUser, deleteUsers } from '@/api/users.api';
import { IUser, UserRole } from '@/types/user.types';
import { beautifulDate } from '@/utils/date';
import style from './users.module.scss';

// const dd = ['admin' as keyof typeof UserRole]

// UserRole[role as keyof typeof UserRole]

interface IPropsDeleteUserElement {
    user: IUser;
}

function CreateUserElement() {
    const context = useContext(Context);

    const ref = {
        login: useRef<HTMLInputElement>(null),
        password: useRef<HTMLInputElement>(null),
        role: useRef<HTMLSelectElement>(null),
    };

    return (
        <div className={style.user__createBox}>
            <h2>Создание пользователя</h2>
            <div className={style.user__inputBox}>
                <p>Логин</p>
                <input ref={ref.login} type="text" placeholder={'Придумайте логин'} />
            </div>
            <div className={style.user__inputBox}>
                <p>Пароль</p>
                <input
                    ref={ref.password}
                    type="password"
                    placeholder={'Придумайте пароль'}
                />
            </div>
            <div className={style.user__selectBox}>
                <p>Права</p>
                <select ref={ref.role} name="role" id="">
                    <option value="">Выберите права</option>
                    {Object.values(UserRole)
                        .filter((role) => role !== 'admin' && role !== 'user') //TODO: когда нужно будет создать обычных пользователей нужно убрать 'user'
                        .map((role, index) => (
                            <option key={index} value={role}>
                                {role}
                            </option>
                        ))}
                </select>
            </div>
            <button
                className={style.user__button}
                onClick={async () => {
                    const login = ref.login.current?.value;
                    const password = ref.password.current?.value;
                    const role = ref.role.current?.value;

                    if (!login || !password || !role)
                        return context.setError({
                            users: `Укажите ${
                                !login
                                    ? 'логин'
                                    : !password
                                      ? 'пароль'
                                      : !role
                                        ? 'права'
                                        : ''
                            }`,
                        });

                    try {
                        const user = await createUser({
                            login,
                            password,
                            role: role as UserRole,
                        });
                        context.requestListUsers();
                        context.setComponent({ users: DefaultUsersElement });
                    } catch (error) {
                        if (error instanceof Error) {
                            context.setError({
                                users: error.message ?? 'Не удалось создать пользователя',
                            });
                        }
                    }
                }}
            >
                Создать
            </button>
            <button
                className={style.user__button}
                onClick={() => {
                    context.setComponent({ users: DefaultUsersElement });
                }}
            >
                Назад
            </button>
            <p
                className={style.user__error}
                style={{ opacity: `${context.state.errors.users?.length ? '1' : '0'}` }}
            >
                {context.state.errors.users ?? '!'}
            </p>
        </div>
    );
}

function DeleteUserElement({ user }: Readonly<IPropsDeleteUserElement>) {
    const context = useContext(Context);

    if (user.role === 'admin') return '';

    return (
        <div className={style.user__deleteBox}>
            {context.isActive('delete_user', user.id) ? (
                <>
                    <button
                        className={style.user__deleteButton}
                        onClick={async () => {
                            await deleteUsers(user.id);
                            await context.requestListUsers();
                        }}
                    >
                        Подтвердить удаление
                    </button>
                    <button
                        className={style.user__deleteCancel}
                        onClick={() => {
                            context.setAction(null);
                        }}
                    >
                        Отмена
                    </button>
                </>
            ) : (
                <button
                    className={style.user__deleteButton}
                    onClick={() => {
                        context.setAction('delete_user', user.id);
                    }}
                >
                    Удалить
                </button>
            )}
        </div>
    );
}

export function DefaultUsersElement() {
    const context = useContext(Context);

    useEffect(() => {
        context.requestListUsers();
    }, []);

    return (
        <div className={style.users}>
            <h2>Пользователи</h2>
            <button
                className={style.user__button}
                onClick={() => {
                    context.setComponent({ users: CreateUserElement });
                }}
            >
                Создать пользователя
            </button>
            <div className={style.users__list}>
                {context.state.data.users.map((user, index) => (
                    <div key={index} className={style.users__el}>
                        <p>ID: {user.id}</p>
                        <p>Логин: {user.login}</p>
                        <p>Права: {user.role}</p>
                        <p>
                            Последний раз онлайн:
                            {user.lastAt ? beautifulDate(user.lastAt) : 'Ещё не заходил'}
                        </p>
                        <p>
                            Создан аккаунт:
                            {beautifulDate(user.createdAt)}
                        </p>
                        <DeleteUserElement user={user} />
                    </div>
                ))}
            </div>
        </div>
    );
}
