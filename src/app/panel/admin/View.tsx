import { useContext, useEffect } from 'react';
import { Context } from './context';

import { IViewUnion } from '@/types/view.types';
import { DefaultUsersElement } from './Users';

import { setView } from '@/api/view.api';
import style from './view.module.scss';

interface IPropsChangeViewElement {
    view: IViewUnion;
}

export interface IViewAttrExtend {
    description: string;
    object: Record<string, string>;
}

type IViewValue = string | number | boolean | null;

type IViewAttr = {
    description: string;
    value: IViewValue | IViewObject | IViewArray;
};

//

type IViewObject = Record<string, IViewValue | IViewAttr>;

type IViewArray = (IViewObject | IViewValue)[];

function DefineTypesElement({
    value,
    description,
}: {
    value: IViewArray | IViewAttr | IViewObject | IViewValue;
    description?: IViewAttr['description'];
}) {
    return Array.isArray(value) ? (
        <ArrayElement array={value} description={description} />
    ) : typeof value === 'object' && value != null ? (
        'description' in value && 'value' in value ? (
            <AttrElement attr={value as IViewAttr} />
        ) : (
            <ObjectElement obj={value} description={description} />
        )
    ) : (
        <div>
            <strong>Значение:</strong>
            {value}
        </div>
    );
}

function AttrElement({ attr }: { attr: IViewAttr }) {
    return (
        <div>
            {typeof attr.description === 'string' ? (
                <div>
                    <strong>Описание:</strong>
                    {attr.description}
                </div>
            ) : null}
            <DefineTypesElement value={attr.value} description={attr.description} />
        </div>
    );
}

function ObjectElement({
    obj,
    description,
}: {
    obj: IViewObject;
    description?: IViewAttr['description'];
}) {
    return (
        <div>
            {Object.entries(obj).map(([key, value], index) => (
                <>
                    {typeof description === 'object' && key in description.object ? (
                        <p>
                            <strong>Описание:</strong>
                            {description.object[key]}
                        </p>
                    ) : null}
                    <DefineTypesElement value={value} />
                </>
            ))}
        </div>
    );
}

function ArrayElement({
    array,
    description,
}: {
    array: IViewArray;
    description?: IViewAttr['description'];
}) {
    return (
        <div>
            {array.map((el, index) => (
                <DefineTypesElement value={el} description={description} />
            ))}
        </div>
    );
}

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
                <DefineTypesElement value={view.payload} />
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
