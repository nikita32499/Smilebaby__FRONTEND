import { PropsWithChildren, useContext, useRef } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Collapse,
    Divider,
    Flex,
    Image,
    Input,
    Space,
    Typography,
    Upload,
} from 'antd';
import { ViewApi } from 'entities/view';
import { uploadOne } from 'shared/api/file.api';
import { isImage } from 'shared/helpers/image';
import { useImmerState } from 'shared/hook/useImmerState';
import { DeleteButton } from 'shared/ui/DeleteButton/DeleteButton';
import { ViewContext } from 'shared/ui/ViewProvider/ViewProvider';
import { IViewArray, IViewAttr, IViewObject, IViewValue } from '../../model/ui.types';
import { CreateViewElement } from '../CreateViewElement/CreateViewElement';
import { ContextChangeViewElement, IPropsChangeViewElement } from './context';

const { Panel } = Collapse;
const { Text } = Typography;

type TPropsDefinedTypesElement = PropsWithChildren<{
    value: IViewArray | IViewAttr | IViewObject | IViewValue;
    description?: IViewAttr['description'] | undefined;
}>;

type TPropsObjectElement = PropsWithChildren<{
    obj: IViewObject;
    description?: IViewAttr['description'] | undefined;
}>;

type TPropsArrayElement = {
    array: IViewArray;
    description?: IViewAttr['description'] | undefined;
};

function ImageElement({ path }: { path: string }) {
    return (
        <>
            <Image src={path} alt='Image' />
        </>
    );
}

function DescriptionElement({ description }: { description: string }) {
    return (
        <div>
            <Text strong>Описание:</Text> {description}
        </div>
    );
}

function ValueElement({ value }: { value: IViewValue }) {
    return (
        <div>
            <Text strong>Значение:</Text> {value}
        </div>
    );
}

const DefineTypesElement: FC<TPropsDefinedTypesElement> = ({
    value,
    description,
    children,
}) => {
    const isArray = Array.isArray(value);
    const isObject = typeof value === 'object' && value != null;
    const isDescriptionObject = isObject && 'description' in value && 'value' in value;

    if (isArray) {
        return <ArrayElement array={value} description={description} />;
    } else if (isObject) {
        if (isDescriptionObject) {
            return <AttrElement attr={value as IViewAttr} />;
        } else {
            return (
                <ObjectElement obj={value} description={description}>
                    {children}
                </ObjectElement>
            );
        }
    } else {
        return <ValueElement value={value} />;
    }
};

function AttrElement({ attr }: Readonly<{ attr: IViewAttr }>) {
    return (
        <Card>
            {typeof attr.description === 'string' ? (
                <Text>
                    <Text strong>Описание</Text>
                    {attr.description}
                </Text>
            ) : null}

            <div>
                <DefineTypesElement value={attr.value} description={attr.description} />
            </div>
        </Card>
    );
}

const ObjectElement: FC<TPropsObjectElement> = ({ obj, description, children }) => {
    const context = useContext(ContextChangeViewElement);

    const viewContext = useContext(ViewContext);

    const uploadFile = (file: File, key: string) => {
        viewContext.setState((prev) => {
            prev.imagePreview = {
                file,
                apply: async () => {
                    const result = await uploadOne(file);
                    obj[key] = result.path;
                    context.rerender();
                },
            };
        });
    };

    return (
        <Flex>
            {Object.entries(obj).map(([key, value], index) => {
                if (key === 'id') return null;

                const descriptionOfElement =
                    typeof description === 'object' && description.object[key];

                const tempValue = useRef<string>();

                const [action, setAction] = useImmerState<null | 'edit'>(null);

                const flow = {
                    goBack: () => setAction((prev) => (prev = null)),
                    goEdit: () => setAction((prev) => (prev = 'edit')),
                };

                return action === 'edit' ? (
                    <div>
                        {isImage(key) ? (
                            <Upload
                                showUploadList={false}
                                beforeUpload={(file) => {
                                    uploadFile(file, key);
                                    flow.goBack();
                                }}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Загрузить изображение
                                </Button>
                            </Upload>
                        ) : (
                            <>
                                <Input
                                    defaultValue={value?.toString()}
                                    onChange={(event) => {
                                        tempValue.current = event.target.value;
                                    }}
                                />
                                <Button
                                    type='primary'
                                    onClick={() => {
                                        if (!tempValue.current)
                                            throw new Error('Пустое значение');
                                        obj[key] = tempValue.current;
                                        flow.goBack();
                                        context.rerender();
                                    }}
                                >
                                    Сохранить
                                </Button>
                            </>
                        )}
                        <Button onClick={flow.goBack} type='primary'>
                            Отмена
                        </Button>
                    </div>
                ) : (
                    <Card>
                        {descriptionOfElement ? (
                            <DescriptionElement description={descriptionOfElement} />
                        ) : null}

                        {typeof value === 'string' && isImage(key) ? (
                            <ImageElement path={value} />
                        ) : (
                            <DefineTypesElement value={value} />
                        )}

                        {typeof value !== 'object' ? (
                            <>
                                <Button type='primary' onClick={flow.goEdit}>
                                    Изменить
                                </Button>
                            </>
                        ) : null}
                    </Card>
                );
            })}
            {children}
        </Flex>
    );
};

function ArrayElement({ array, description }: TPropsArrayElement) {
    const context = useContext(ContextChangeViewElement);

    return (
        <>
            {typeof description === 'object' ? (
                <>
                    <DescriptionElement description={description.text} />
                    <CreateViewElement array={array} description={description.object} />
                </>
            ) : null}

            <div>
                {array.map((el, index) => (
                    <>
                        <DefineTypesElement
                            value={el}
                            description={description}
                            key={index}
                        >
                            <DeleteButton
                                confirmDelete={() => {
                                    const index = array.findIndex((obj) => obj === el);
                                    if (index !== -1) {
                                        array.splice(index, 1);
                                    }

                                    context.rerender();
                                }}
                            />

                            <Divider />
                        </DefineTypesElement>
                    </>
                ))}
            </div>
        </>
    );
}

export const ChangeViewElement: FC<IPropsChangeViewElement> = (props) => {
    const { view, flow } = props;

    const [ViewSet] = ViewApi.useSetViewMutation();

    const saveView = async () => {
        await ViewSet({
            name: view.name,
            description: view.description,
            payload: view.payload,
        });

        flow.goBack();
    };

    return (
        <ContextChangeViewElement.Provider value={props}>
            <div>
                <Card>
                    <Card style={{ marginBottom: '1rem' }}>
                        <div>
                            <Text strong>ID:</Text> <Text>{view.id}</Text>
                        </div>
                        <div>
                            <Text strong>Название:</Text> <Text>{view.name}</Text>
                        </div>
                        <div>
                            <Text strong>Описание:</Text> <Text>{view.description}</Text>
                        </div>
                        <Space size='middle'>
                            <Button type='primary' onClick={saveView}>
                                Применить настройки
                            </Button>
                            <Button onClick={flow.goBack}>Назад</Button>
                        </Space>
                    </Card>
                </Card>

                <DefineTypesElement value={view.payload} />
            </div>
        </ContextChangeViewElement.Provider>
    );
};
