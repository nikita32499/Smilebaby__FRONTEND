'use client';

import { getAllUsers } from '@/api/users.api';
import { useState } from 'react';
import { Context, IStateAdminPanel, TypeSetComponent, TypeSetErrors } from './context';

import { getAllViews } from '@/api/view.api';
import { getUserData } from '@/utils/localStorage';
import { DefaultUsersElement } from './Users';
import { DefaultViewElement } from './View';

export default function AdminRoot() {
    const [state, setState] = useState<IStateAdminPanel>({
        data: {
            users: [],
            views: [],
        },
        action: {},
        components: {
            users: DefaultUsersElement,
            views: DefaultViewElement,
        },
        errors: {},
    });

    async function requestListUsers() {
        const users = await getAllUsers();
        setState(
            (prev): IStateAdminPanel => ({
                ...prev,
                data: {
                    ...prev.data,
                    users,
                },
            }),
        );
    }

    async function requestListViews() {
        const views = await getAllViews();
        setState(
            (prev): IStateAdminPanel => ({
                ...prev,
                data: {
                    ...prev.data,
                    views,
                },
            }),
        );
    }

    function setComponent(Component: TypeSetComponent) {
        setState(
            (prev): IStateAdminPanel => ({
                ...prev,
                components: {
                    ...prev.components,
                    ...Component,
                },
            }),
        );
    }

    function setError(errors: TypeSetErrors) {
        const fn = (errors: TypeSetErrors) => {
            setState(
                (prev): IStateAdminPanel => ({
                    ...prev,
                    errors,
                }),
            );
        };
        setTimeout(() => {
            fn({});
        }, 15000);
        fn(errors);
    }

    function isActive(name: string, id?: string | number): boolean {
        return state.action.name === name && (id == null ? true : state.action.id === id);
    }

    function setAction(name: string | null, id?: string | number) {
        setState((prev): IStateAdminPanel => {
            return {
                ...prev,
                action:
                    name === null
                        ? {}
                        : {
                              name,
                              id,
                          },
            };
        });
    }

    const userData = getUserData();

    return (
        <Context.Provider
            value={{
                setState,
                state,
                requestListUsers,
                requestListViews,
                setComponent,
                setError,
                isActive,
                setAction,
            }}
        >
            <state.components.views />
            <div>
                {typeof userData === 'object' && userData.role === 'admin' ? (
                    <state.components.users />
                ) : (
                    ''
                )}
            </div>
        </Context.Provider>
    );
}
