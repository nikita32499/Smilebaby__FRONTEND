import { ApplyDeleteComponent } from '@/components/ConfirmDelete/ApplyDelete';
import { PropsWithChildren, useContext, useRef, useState } from 'react';

import { ContextChangeViewElement, IPropsChangeViewElement } from './context';
import style from './style.module.scss';

type IViewValue = string | number | boolean | null;

type IViewAttrExtend = {
  text: string;
  object: Record<string, string>;
};

type IViewAttr = {
  description: string | IViewAttrExtend;
  value: IViewValue | IViewObject | IViewArray;
};

//

type IViewArray = (IViewObject | IViewValue)[];

interface IStateCreateViewElement {
  view: boolean;
  fields: Record<string, string | null | { src: string; file: File }>;
}

export type IViewObject = Record<string, IViewValue | IViewAttr>;

function CreateViewElement({ description, array }: { description: IViewAttrExtend['object']; array: IViewArray }) {
  const [state, setState] = useState<IStateCreateViewElement>({
    view: false,
    fields: Object.entries(description).reduce((current, [key, value]) => {
      if (key === 'id') return current;
      current[key] = null;
      return current;
    }, {} as any),
  });

  const context = useContext(ContextChangeViewElement);

  return (
    <div>
      {state.view ? (
        <>
          {Object.entries(description).map(([key, value], index) => {
            const fieldValue = state.fields[key];
            return key !== 'id' ? (
              <div>
                <p>{value}</p>
                {context.isImage(key) ? (
                  <>
                    <input
                      className={style.CreateViewElement__fileInput}
                      type="file"
                      name=""
                      id=""
                      // onChange={(event) => changeFile({ event, key })}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        context.chooseImage(file, (src: string) => {
                          setState((prev) => {
                            prev.fields[key] = { src, file };

                            return { ...prev };
                          });
                        });
                      }}
                    />
                    {fieldValue instanceof Object ? <img src={fieldValue.src} alt="" /> : null}
                  </>
                ) : (
                  <input
                    type="text"
                    onChange={(event) => {
                      setState((prev) => {
                        prev.fields[key] = event.target.value;
                        return { ...prev };
                      });
                    }}
                  />
                )}
              </div>
            ) : null;
          })}

          <button
            onClick={async () => {
              if (Object.values(state.fields).some((value) => value == null)) return;

              for (const key of Object.keys(state.fields)) {
                const value = state.fields[key];
                if (value instanceof Object && 'file' in value) {
                  const src = await context.uploadFile(value.file);
                  state.fields[key] = src;
                }
              }

              array.unshift({
                ...state.fields,
                id: Math.random() * 10e16,
              });
              setState((prev): IStateCreateViewElement => {
                prev.view = false;
                return { ...prev };
              });
              context.rerender();
            }}
          >
            Сохранить
          </button>
          <button
            onClick={() => {
              setState((prev) => {
                prev.view = false;
                return { ...prev };
              });
            }}
          >
            Отмена
          </button>
        </>
      ) : (
        <>
          <button
            className={style.CreateViewElement__createButton}
            onClick={() => {
              setState((prev) => {
                prev.view = true;

                return { ...prev };
              });
            }}
          >
            Создать элемент
          </button>
        </>
      )}
    </div>
  );
}

function ImageElement({ path }: { path: string }) {
  return (
    <>
      <img src={path} alt="" className={style.ImageElement__image} />
    </>
  );
}

function DescriptionElement({ description }: { description: string }) {
  return (
    <div className={style['viewDescriptionElement-box']}>
      <strong>Описание:</strong>
      {description}
    </div>
  );
}

function ValueElement({ value }: { value: IViewValue }) {
  return (
    <div className={style['viewValueElement-box']}>
      <strong>Значение:</strong>
      {value}
    </div>
  );
}

const DefineTypesElement: FC<
  PropsWithChildren<{
    value: IViewArray | IViewAttr | IViewObject | IViewValue;
    description?: IViewAttr['description'] | undefined;
  }>
> = ({ value, description, children }) => {
  return Array.isArray(value) ? (
    <ArrayElement array={value} description={description} />
  ) : typeof value === 'object' && value != null ? (
    'description' in value && 'value' in value ? (
      <AttrElement attr={value as IViewAttr} />
    ) : (
      <ObjectElement obj={value} description={description}>
        {children}
      </ObjectElement>
    )
  ) : (
    <ValueElement value={value} />
  );
};

function AttrElement({ attr }: Readonly<{ attr: IViewAttr }>) {
  return (
    <>
      {typeof attr.description === 'string' ? (
        <div className={style.AttrElement__description}>
          <strong>Описание:</strong>
          {attr.description}
        </div>
      ) : null}

      <div className={style.viewAttrValue}>
        <DefineTypesElement value={attr.value} description={attr.description} />
      </div>
    </>
  );
}

const ObjectElement: FC<
  PropsWithChildren<{
    obj: IViewObject;
    description?: IViewAttr['description'] | undefined;
  }>
> = ({ obj, description, children }) => {
  const context = useContext(ContextChangeViewElement);

  return (
    <div className={style.ObjectElement}>
      {Object.entries(obj)
        .map(([key, value], index) => {
          if (key === 'id') return null;
          const [view, setView] = useState<boolean>(false);
          const ref = {
            input: useRef<HTMLInputElement>(null),
          };
          const descriptionOfElement = typeof description === 'object' && description.object[key];

          return view && typeof value !== 'object' ? (
            <div className={style.ObjectElement__editBox}>
              {context.isImage(key) ? (
                <input
                  type="file"
                  name=""
                  id=""
                  ref={ref.input}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setView((prev) => !prev);
                    context.changeImage({
                      file,
                      obj,
                      key,
                    });
                  }}
                />
              ) : (
                <>
                  <input
                    className={style.ObjectElement__input}
                    ref={ref.input}
                    type="text"
                    defaultValue={value?.toString()}
                  />
                  <button
                    className={style.ObjectElement__saveButton}
                    onClick={() => {
                      const value = ref.input.current?.value;
                      if (!value) return;
                      obj[key] = value;
                      setView((prev): boolean => !prev);
                    }}
                  >
                    Сохранить
                  </button>
                </>
              )}
              <button
                className={style.ObjectElement__cancelButton}
                onClick={() => {
                  setView((prev): boolean => !prev);
                }}
              >
                Отмена
              </button>
            </div>
          ) : (
            <div className={style.ObjectElement__property}>
              {descriptionOfElement ? <DescriptionElement description={descriptionOfElement} /> : null}

              {typeof value === 'string' && context.isImage(key) ? (
                <ImageElement path={value} />
              ) : (
                <DefineTypesElement value={value} />
              )}

              {typeof value !== 'object' ? (
                <>
                  <button
                    className={style.ObjectElement__editButton}
                    onClick={() => {
                      setView((prev): boolean => !prev);
                    }}
                  >
                    Изменить
                  </button>
                </>
              ) : null}
            </div>
          );
        })
        .filter((el) => el)}
      {children}
    </div>
  );
};

function ArrayElement({
  array,
  description,
}: Readonly<{
  array: IViewArray;
  description?: IViewAttr['description'] | undefined;
}>) {
  const context = useContext(ContextChangeViewElement);

  return (
    <>
      {typeof description === 'object' ? (
        <>
          <DescriptionElement description={description.text} />
          <CreateViewElement array={array} description={description.object} />
        </>
      ) : null}

      <div className={style.ArrayElement__arrayList}>
        {array.map((el, index) => (
          <DefineTypesElement value={el} description={description}>
            <ApplyDeleteComponent
              apply={() => {
                let index = array.findIndex((obj) => obj === el);
                if (index !== -1) {
                  array.splice(index, 1);
                }

                context.rerender();
              }}
            />
          </DefineTypesElement>
        ))}
      </div>
    </>
  );
}

export const ChangeViewElement: FC<IPropsChangeViewElement> = (props) => {
  const { view, save, cancel } = props;

  return (
    <ContextChangeViewElement.Provider value={props}>
      <div className={style.viewSetting}>
        <div>
          <button
            onClick={() => {
              save({ name: view.name, description: view.description, payload: view.payload });
            }}
          >
            Применить настройки
          </button>
          <button onClick={cancel}>Назад</button>
        </div>
        <div className={style.viewPageInfo}>
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

        <div className={style.viewParams}>
          <DefineTypesElement value={view.payload} />
        </div>
      </div>
    </ContextChangeViewElement.Provider>
  );
};
