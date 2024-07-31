import { Button, Card, Form, Image, Input, Select, Space } from 'antd';
import { EntriesApi } from 'entities/entries';
import { ItemApi } from 'entities/item';
import { generateUUID } from 'shared/helpers/date';
import { switchCheckDefault } from 'shared/helpers/switch';
import { useImmerState } from 'shared/hook/useImmerState';
import { UploadImage } from 'shared/ui/UploadImage/UploadImage';
import {
    SchemaItemCreate,
    SchemaItemUpdate,
} from 'shared_SmileBaby/dist/contract/item.contract';
import { IItem, IItemUpdate } from 'shared_SmileBaby/dist/types/item.types';
import { fieldCreateItem } from '../../constants/field';
import { AmountElement } from './ui/AmountElement';
const { Option } = Select;

interface IPropsCreateItem {
    updateItem?: IItem;
    flow: {
        goBack: () => void;
    };
}

interface IPropsImagePreview {
    src: string;
    deleteCb?: () => void;
}

const ImagePreview: FC<IPropsImagePreview> = (props) => {
    const { src, deleteCb } = props;
    return (
        <Card>
            <Image src={src} className='!w-[150px] ' />
            {deleteCb && <Button onClick={deleteCb}>Удалить</Button>}
        </Card>
    );
};

export interface IStateCreateUpdateItem {
    newItemData: Partial<IItemUpdate['update']>;
    error: string | null;
}

export const CreateUpdateItem = (props: IPropsCreateItem): React.ReactNode => {
    const { flow, updateItem } = props;

    const { data: entries = [] } = EntriesApi.useGetAllQuery();
    const [CreateItem] = ItemApi.useCreateMutation();
    const [UpdateItem] = ItemApi.useUpdateMutation();

    const [state, setState] = useImmerState<IStateCreateUpdateItem>({
        newItemData: updateItem ?? {
            img_prev: [],
            amount: [],
        },
        error: null,
    });

    //

    const submitHandler = async () => {
        let result;
        if (updateItem) {
            const updateItemDataResult = SchemaItemUpdate.safeParse({
                id: updateItem.id,
                update: state.newItemData,
            });
            if (!updateItemDataResult.success) {
                return setState((prev) => {
                    prev.error = 'укажите все полня';
                });
            }
            result = await UpdateItem(updateItemDataResult.data);
        } else {
            const createItemDataResult = SchemaItemCreate.safeParse({
                createData: state.newItemData,
            });
            if (!createItemDataResult.success) {
                return setState((prev) => {
                    prev.error = 'укажите все полня';
                });
            }
            result = await CreateItem(createItemDataResult.data);
        }

        if (result.data) {
            flow.goBack();
        }
    };

    return (
        <Form onSubmitCapture={submitHandler} className='flex'>
            <Space className='w-min items-start'>
                <Button type='primary' htmlType='submit'>
                    {updateItem ? 'Обновить' : 'Создать'}
                </Button>
                <Button onClick={flow.goBack}>Назад</Button>
            </Space>
            <span>{state.error}</span>
            <div className='flex flex-col w-[50%]'>
                {fieldCreateItem.map((element, index) => {
                    const renderField = () => {
                        switch (element.type) {
                            case 'image':
                                const img_main = state.newItemData.img_main;

                                return (
                                    <>
                                        <UploadImage
                                            setImage={(src) => {
                                                setState((prev) => {
                                                    prev.newItemData.img_main = src;
                                                });
                                            }}
                                        />
                                        {img_main && <ImagePreview src={img_main} />}
                                    </>
                                );
                            case 'images':
                                const img_prev = state.newItemData.img_prev;
                                return (
                                    <>
                                        <UploadImage
                                            setImage={(src) => {
                                                setState((prev) => {
                                                    prev.newItemData.img_prev?.push(src);
                                                });
                                            }}
                                        />
                                        <div className='flex '>
                                            {img_prev &&
                                                img_prev.map((src) => (
                                                    <ImagePreview
                                                        src={src}
                                                        deleteCb={() => {
                                                            setState((prev) => {
                                                                if (
                                                                    Array.isArray(
                                                                        prev.newItemData
                                                                            .img_prev,
                                                                    )
                                                                ) {
                                                                    prev.newItemData.img_prev =
                                                                        prev.newItemData.img_prev.filter(
                                                                            (el) =>
                                                                                el !==
                                                                                src,
                                                                        );
                                                                }
                                                            });
                                                        }}
                                                    />
                                                ))}
                                        </div>
                                    </>
                                );
                            case 'amount':
                                const amountList = state.newItemData.amount;

                                const addAmount = () => {
                                    const newAmount = {
                                        uuid: generateUUID(),
                                        quantity: 0,
                                        size: '',
                                    };
                                    setState((prev) => {
                                        prev.newItemData.amount?.push(newAmount);
                                    });
                                };

                                return (
                                    <div>
                                        <Button type='default' onClick={addAmount}>
                                            Добавить
                                        </Button>

                                        <div>
                                            {amountList &&
                                                amountList.map((amount, index) => {
                                                    return (
                                                        <AmountElement
                                                            {...{
                                                                amount,
                                                                key: amount.uuid,
                                                                setState,
                                                            }}
                                                        />
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );

                            case 'string':
                                return (
                                    <Input
                                        placeholder={element.title}
                                        onChange={(event) => {
                                            setState((prev) => {
                                                prev.newItemData[element.key] =
                                                    event.target.value;
                                            });
                                        }}
                                    />
                                );

                            case 'many-text':
                                return (
                                    <Input.TextArea
                                        placeholder={element.title}
                                        rows={4}
                                        onChange={(event) => {
                                            setState((prev) => {
                                                prev.newItemData[element.key] =
                                                    event.target.value;
                                            });
                                        }}
                                    />
                                );

                            case 'number':
                                return (
                                    <Input
                                        placeholder={element.title}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            if (isNaN(value)) {
                                                return setState((prev) => {
                                                    prev.error = 'укажите число';
                                                });
                                            } else {
                                                setState((prev) => {
                                                    prev.newItemData[element.key] = value;
                                                });
                                            }
                                        }}
                                    />
                                );

                            case 'entries':
                                return (
                                    <Select
                                        placeholder={`Не выбрано`}
                                        onChange={(value: string) => {
                                            setState((prev) => {
                                                const id = Number(value);
                                                if (isNaN(id)) {
                                                    throw new Error('id это NaN');
                                                }
                                                prev.newItemData[element.key] = id;
                                            });
                                        }}
                                    >
                                        {entries
                                            .filter(
                                                (entry) => entry.name === element.name,
                                            )
                                            .map((entry, index) => (
                                                <Option key={index} value={entry.id}>
                                                    {entry.value}
                                                </Option>
                                            ))}
                                    </Select>
                                );

                            default:
                                return switchCheckDefault(element);
                        }
                    };

                    return (
                        <Form.Item>
                            <span>{element.title}</span>
                            {renderField()}
                        </Form.Item>
                    );
                })}
            </div>
        </Form>
    );
};
