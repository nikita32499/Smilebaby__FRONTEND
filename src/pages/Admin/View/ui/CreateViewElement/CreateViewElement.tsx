import { UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Input, Space, Typography, Upload } from 'antd';
import { useContext, useEffect } from 'react';
import { getImageBlob, isImage } from 'shared/helpers/image';
import { useImmerState } from 'shared/hook/useImmerState';
import { ViewContext } from 'shared/ui/ViewProvider/ViewProvider';
import { IViewArray, IViewAttrExtend } from '../../model/ui.types';
import { ContextChangeViewElement } from '../ChangeViewElement/context';

interface IPropsCreateViewElement {
    description: IViewAttrExtend['object'];
    array: IViewArray;
}

const { Text } = Typography;

export interface IStateCreateViewElement {
    error?: string;
    fields: Record<string, string | null | { src: string; file: File }>;
    action: 'create' | null;
}

export const CreateViewElement: FC<IPropsCreateViewElement> = (props) => {
    const { description, array } = props;

    const [state, setState] = useImmerState<IStateCreateViewElement>({
        fields: Object.entries(description).reduce(
            (current, [key, value]) => {
                if (key === 'id') return current;
                current[key] = null;
                return current;
            },
            {} as IStateCreateViewElement['fields'],
        ),
        action: null,
    });

    const flow = {
        goBack: () => setState((prev) => (prev.action = null)),
        goCreate: () => setState((prev) => (prev.action = 'create')),
    };

    useEffect(() => {
        if (state.error) {
            setTimeout(() => {
                setState((prev) => {
                    delete prev.error;
                });
            }, 15000);
        }
    }, [state.error]);

    const context = useContext(ContextChangeViewElement);

    const viewContext = useContext(ViewContext);

    const save = async () => {
        const hasEmpty = Object.values(state.fields).some((value) => value == null);
        if (hasEmpty)
            return setState((prev) => {
                prev.error = 'Заполните все поля';
            });

        const fields: typeof state.fields = { ...state.fields };

        // for (const key of Object.keys(state.fields)) {
        //   const value = state.fields[key];
        //   if (value instanceof Object && 'file' in value) {
        //     const result = await uploadOne(value.file);
        //     fields[key] = result.path;
        //   }
        // }//TODO:проверить это

        array.unshift({
            ...fields,
            id: Math.random() * 10e16,
        });

        context.rerender();
    };

    const uploadFile = (file: File, key: string) => {
        viewContext.setState((prev) => {
            prev.imagePreview = {
                file,
                apply: async () => {
                    const src = await getImageBlob(file);
                    setState((prev) => {
                        prev.fields[key] = { src, file };
                    });
                    viewContext.setState((prev) => {
                        prev.imagePreview = null;
                    });
                },
            };
        });
        return false;
    };

    return (
        <div>
            {state.action === 'create' ? (
                <Flex vertical>
                    {
                        <Flex vertical>
                            {Object.entries(state.fields).map(
                                ([key, fieldValue], index) => {
                                    return (
                                        <div key={index}>
                                            <Text type='secondary'>
                                                {description[key]}
                                            </Text>
                                            {isImage(key) ? (
                                                <Flex vertical>
                                                    <Upload
                                                        beforeUpload={(file) =>
                                                            uploadFile(file, key)
                                                        }
                                                        showUploadList={false}
                                                    >
                                                        <Button icon={<UploadOutlined />}>
                                                            Загрузить изображение
                                                        </Button>
                                                    </Upload>
                                                    {fieldValue instanceof Object && (
                                                        <Image
                                                            src={fieldValue.src}
                                                            alt=''
                                                        />
                                                    )}
                                                </Flex>
                                            ) : (
                                                <Input
                                                    type='text'
                                                    onChange={(event) => {
                                                        setState((prev) => {
                                                            prev.fields[key] =
                                                                event.target.value;
                                                        });
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                },
                            )}
                            {state.error && <Text type='danger'>{state.error}</Text>}
                        </Flex>
                    }
                    <Space>
                        <Button
                            onClick={() => {
                                save();
                            }}
                        >
                            Сохранить
                        </Button>
                        <Button type='primary' onClick={flow.goBack}>
                            Отмена
                        </Button>
                    </Space>
                </Flex>
            ) : (
                <Button type='primary' onClick={flow.goCreate}>
                    Создать элемент
                </Button>
            )}
            {}
        </div>
    );
};
