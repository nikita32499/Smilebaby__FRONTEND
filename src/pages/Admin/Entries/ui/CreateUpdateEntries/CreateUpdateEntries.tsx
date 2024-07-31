'use client';

import { Button, Card, Form, Image, Input, Select, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { EntriesApi } from 'entities/entries';
import { useImmerState } from 'shared/hook/useImmerState';
import { UploadImage } from 'shared/ui/UploadImage/UploadImage';
import {
    SchemaEntriesCreate,
    SchemaEntriesUpdate,
} from 'shared_SmileBaby/dist/contract/entries.contract';
import {
    EnumEntries,
    IEntriesUnion,
    IEntriesUpsertData,
} from 'shared_SmileBaby/dist/types/entries.types';
import { nameResolver } from '../../constants/constants';

const { Option } = Select;

interface IPropsImagePreview {
    src: string;
    deleteCb?: () => void;
}

const ImagePreview: FC<IPropsImagePreview> = (props) => {
    const { src, deleteCb } = props;
    return (
        <Card>
            <Image src={src} className='w-[150px]' />
            {deleteCb && <Button onClick={deleteCb}>Удалить</Button>}
        </Card>
    );
};

export interface IPropsCreateUpdateEntries {
    updateEntry?: IEntriesUnion;
    flow: {
        goBack: () => void;
    };
}

type TEntriesUpsertForm = Partial<IEntriesUpsertData> & { data: {} };

interface IStateCreateUpdateEntries {
    newEntryData: TEntriesUpsertForm;
    error: string | null;
}

export const CreateUpdateEntries: FC<IPropsCreateUpdateEntries> = (props) => {
    const { flow, updateEntry } = props;

    const [CreateEntries] = EntriesApi.useCreateMutation();
    const [UpdateEntry] = EntriesApi.useUpdateMutation();

    const [state, setState] = useImmerState<IStateCreateUpdateEntries>({
        newEntryData: updateEntry ?? {
            data: {},
        },
        error: null,
    });

    const currentName = updateEntry?.name ?? state.newEntryData.name;

    const submitHandler = async () => {
        let result;

        if (updateEntry) {
            const newEntryDataResult = SchemaEntriesUpdate.safeParse({
                id: updateEntry.id,
                update: state.newEntryData,
            });
            if (!newEntryDataResult.success) {
                return setState((prev) => {
                    prev.error = 'Укажите все поля';
                });
            }
            result = await UpdateEntry(newEntryDataResult.data);
        } else {
            const newEntryDataResult = SchemaEntriesCreate.safeParse({
                createData: state.newEntryData,
            });
            if (!newEntryDataResult.success) {
                return setState((prev) => {
                    prev.error = 'Укажите все поля';
                });
            }
            result = await CreateEntries(newEntryDataResult.data);
        }

        if (result.data) {
            flow.goBack();
        } else {
            throw result.error;
        }
    };

    const optionalForm = () => {
        return (
            <Form.Item>
                <UploadImage
                    setImage={(src) => {
                        setState((prev) => {
                            prev.newEntryData.name = EnumEntries.SECTION;

                            if (prev.newEntryData.name === EnumEntries.SECTION) {
                                prev.newEntryData.data = {
                                    img: src,
                                    slug: 'это строка должна быть заменена на стороне сервера',
                                };
                            } else {
                                throw new Error(
                                    'указан не верный name атрибут в Entries',
                                );
                            }
                        });
                    }}
                />
                {state.newEntryData.name === EnumEntries.SECTION && (
                    <ImagePreview
                        src={state.newEntryData.data.img}
                        deleteCb={() => {
                            setState((prev) => {
                                if (prev.newEntryData.name === EnumEntries.SECTION) {
                                    prev.newEntryData.data.img = '';
                                }
                            });
                        }}
                    />
                )}
            </Form.Item>
        );
    };

    return (
        <Form onSubmitCapture={submitHandler}>
            <Title>{updateEntry ? 'Изменение записи' : 'Создание Записи'}</Title>

            <Form.Item
                name='name'
                label='Группа'
                rules={[{ required: true, message: '' }]}
            >
                <Select
                    placeholder='Выберите группу'
                    defaultValue={state.newEntryData.name}
                    onChange={(name: EnumEntries) => {
                        //TODO:тут any если убрать тип, нежно сделать так чтобы ts server ругался на any
                        setState((prev) => {
                            prev.newEntryData.data = {};
                            prev.newEntryData.name = name;
                        });
                    }}
                >
                    <Option key={''} value={''}>
                        {'Выберите группу'}
                    </Option>
                    {Object.values(EnumEntries).map((name, index) => (
                        <Option key={index} value={name}>
                            {nameResolver[name]}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name='value'
                label='value'
                rules={[{ required: true, message: '' }]}
            >
                <Input
                    placeholder='Введите значение'
                    defaultValue={state.newEntryData.value}
                    onChange={(event) => {
                        setState((prev) => {
                            prev.newEntryData.value = event.target.value;
                        });
                    }}
                />
            </Form.Item>
            {currentName === EnumEntries.SECTION && optionalForm()}

            <Form.Item>
                <Space>
                    <Button type='primary' htmlType='submit'>
                        {updateEntry ? 'Сохранить' : 'Создать'}
                    </Button>
                    <Button onClick={flow.goBack}>Назад</Button>
                </Space>
            </Form.Item>
            <Typography.Text
                type='danger'
                style={{ opacity: `${state.error ? '1' : '0'}` }}
            >
                {state.error ?? '!'}
            </Typography.Text>
        </Form>
    );
};
