import { memo, useContext, useEffect, useRef } from 'react';
import { Context } from './context';

import { IView__HOME, IViewUnion, ViewAttrValue } from '@/types/view.types';
import { DefaultUsersElement } from './Users';

import { setView } from '@/api/view.api';
import style from './view.module.scss';

interface IPropsChangeViewElement {
    view: IViewUnion;
}
type TypeLinkData = IView__HOME['payload']['links']['value'][0];

type TypePayload = IView__HOME['payload'];

function AddElementInArray({ links }: { links: TypeLinkData[] }) {
    const context = useContext(Context);

    const ref = {
        text: useRef<HTMLInputElement>(null),
        url: useRef<HTMLInputElement>(null),
    };
    return (
        <div className={style.view__createBox}>
            <div>
                <p>Текст кнопки</p>
                <input type="text" ref={ref.text} />
            </div>
            <div>
                <p>Ссылка кнопки</p>
                <input type="text" ref={ref.url} />
            </div>
            <button
                onClick={() => {
                    const text = ref.text.current?.value;
                    const url = ref.url.current?.value;

                    if (ref.text.current?.value && ref.url.current?.value) {
                        links.push({
                            id: Math.floor(Math.random() * 1000000000000),
                            text: ref.text.current?.value,
                            url: ref.url.current?.value,
                            number: links.length
                                ? Math.max(...links.map((link) => link.number)) + 1
                                : 1,
                        });
                        context.setComponent({});
                        ref.text.current.value = '';
                        ref.url.current.value = '';
                    } else {
                        context.setError({
                            views: `Запулните все поля`,
                        });
                    }
                }}
            >
                Добавить элемент
            </button>
        </div>
    );
}

const ArrayElement = memo(
    function ArrayElement({
        el,
        data,
    }: {
        el: TypeLinkData;
        data: ViewAttrValue<TypeLinkData[]>;
    }) {
        const context = useContext(Context);
        return (
            <div className={style.view__param + ' ' + style.view__arrayElement}>
                <div>
                    <p>Текст:</p>
                    <input
                        type="text"
                        defaultValue={el.text}
                        onChange={(event) => {
                            el.text = event.target.value;
                        }}
                    />
                </div>
                <div>
                    <p>Ссылка:</p>
                    <input
                        type="text"
                        defaultValue={el.url}
                        onChange={(event) => {
                            el.url = event.target.value;
                        }}
                    />
                </div>
                <button
                    onClick={() => {
                        data.value = data.value.filter(
                            (del_el: TypeLinkData) => del_el.id !== el.id,
                        );
                        context.setComponent({});
                    }}
                >
                    удалить
                </button>
            </div>
        );
    },
    () => false,
);

const СreateFormFromViewPayload = memo(
    function СreateFormFromViewPayload({ payload }: { payload: TypePayload }) {
        const context = useContext(Context);

        return (
            <>
                {Object.entries(payload).map(([key, data], index) => {
                    if (key === 'id') return '';

                    return (
                        <div key={index} className={style.view__param}>
                            <div className={style.view__param_keybox}>
                                <p>Описание:</p>
                                {data.description}
                            </div>
                            {Array.isArray(data.value) ? (
                                <div className={style.view__param_arrayBox}>
                                    <AddElementInArray links={data.value} />

                                    {data.value
                                        .sort((a, b) => a.number - b.number)
                                        .map((el: TypeLinkData, index: number) => (
                                            <ArrayElement
                                                key={index}
                                                el={el}
                                                data={
                                                    data as ViewAttrValue<TypeLinkData[]>
                                                }
                                            />
                                        ))}
                                </div>
                            ) : typeof data.value === 'object' && data.value !== null ? (
                                <СreateFormFromViewPayload payload={data.value} /> //
                            ) : (
                                <div>
                                    <p>Значение:</p>
                                    <input
                                        type="text"
                                        defaultValue={data.value}
                                        onChange={(event) => {
                                            data.value = event.target.value;
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    },
    () => false,
);

function ChangeViewElement({ view }: IPropsChangeViewElement) {
    const context = useContext(Context);

    return (
        <div className={style.view__setting}>
            <button
                onClick={async () => {
                    const newView = await setView({
                        payload: view.payload,
                        name: view.name,
                        description: view.description,
                    });
                    context.requestListViews();
                    context.setComponent({
                        views: DefaultViewElement,
                        users: DefaultUsersElement,
                    });
                }}
            >
                Применить настройки
            </button>
            <button
                onClick={() => {
                    context.setComponent({
                        views: DefaultViewElement,
                        users: DefaultUsersElement,
                    });
                }}
            >
                Назад
            </button>
            <div className={style.view__pageInfo}>
                <p>
                    <p>ID:</p> {view.id}
                </p>
                <p>
                    <p>Название:</p> {view.name}
                </p>
                <p>
                    <p>Описание:</p> {view.description}
                </p>
            </div>

            <div className={style.view__params}>
                <СreateFormFromViewPayload payload={view.payload} />
            </div>
        </div>
    );
}

export function DefaultViewElement() {
    const context = useContext(Context);

    useEffect(() => {
        context.requestListViews();
    }, []);

    return (
        <div className={style.view}>
            <h2>Настройка страниц</h2>
            <div className={style.view__list}>
                {context.state.data.views.map((view, index) => (
                    <div className={style.view__box} key={index}>
                        <p>ID: {view.id}</p>
                        <p>Название: {view.name}</p>
                        <p>Описание: {view.description}</p>
                        <button
                            onClick={() => {
                                context.setComponent({
                                    views: () =>
                                        ChangeViewElement({
                                            view,
                                        }),
                                    users: () => '',
                                });
                            }}
                        >
                            Редактировать
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
