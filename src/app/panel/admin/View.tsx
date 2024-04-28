import { useContext, useEffect } from 'react'
import { Context } from './context'

import { IViewUnion } from '@/types/view.types'
import { DefaultUsersElement } from './Users'

import { setView } from '@/api/view.api'
import style from './view.module.scss'

interface IPropsChangeViewElement {
    view: IViewUnion;
}



type Value = string | number | boolean | null



interface IPropAttrValue {
    attr:{
        description: string;
        value: string | object;
    }
}

interface IPropObject {
    object:{
        description: string;
        value: string | object;
    }
}

interface IPropArray{
    array:(IPropObject | Value)[]
}


function TypesElement({value}:{value:(IPropObject | Value)}){
    return Array.isArray(value)?<ArrayElement array={value}/>?typeof value==="object"?<ObjectElement object={value}/>:<div>Значение:{value}</div>
}


function AttrElement({attr}:IPropAttrValue) {
    return (
        <div>
            <div>Описание:{attr.description}</div>
            
        </div>
    );
}

function ObjectElement({object}: IPropObject) {
    return <div>p</div>;
}

function ArrayElement({array}: IPropArray) {
    return <div>
        {array.map((el,index)=>(
            <div>

            </div>
        ))}
    </div>;
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
                {/* <СreateFormFromViewPayload payload={view.payload} /> */}
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
