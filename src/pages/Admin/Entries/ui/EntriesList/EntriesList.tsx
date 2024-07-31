import { Button, Card, Image, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EntriesApi } from 'entities/entries';
import { isIEntriesSection } from 'shared/helpers/entries';
import { DeleteButton } from 'shared/ui/DeleteButton/DeleteButton';
import { IEntriesUnion } from 'shared_SmileBaby/dist/types/entries.types';
import { nameResolver } from '../../constants/constants';

const field: ColumnsType<IEntriesUnion> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Группа',
        dataIndex: 'name',
        key: 'name',
        render: (text, entries) => {
            return nameResolver[entries.name];
        },
    },
    {
        title: 'Значение',
        dataIndex: 'value',
        key: 'value',
    },
    {
        title: 'Прочее',
        dataIndex: 'data',
        key: 'data',
        render: (text, entry) => {
            if (isIEntriesSection(entry)) {
                return <Image src={entry.data.img} alt='' className='!w-[150px]' />;
            } else {
                return null;
            }
        },
    },
];

export interface IPropsEntriesList {
    flow: {
        goEditEntry: (entries: IEntriesUnion) => void;
        goCreateEntry: () => void;
        goBack: () => void;
    };
}

export const EntriesList: FC<IPropsEntriesList> = (props) => {
    const { flow } = props;
    const EntriesData = EntriesApi.useGetAllQuery();

    const [DeleteEntry] = EntriesApi.useDeleteMutation();

    const ActionFields: ColumnsType<IEntriesUnion> = [
        {
            title: 'Действия',
            dataIndex: '',
            key: 'action',
            render: (text: unknown, entries: IEntriesUnion) => (
                <>
                    <DeleteButton confirmDelete={() => DeleteEntry(entries.id)} />
                    <Button
                        onClick={() => {
                            flow.goEditEntry(entries);
                        }}
                    >
                        Изменить
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Card>
            <Button onClick={flow.goCreateEntry}>Создать запись</Button>
            <Table dataSource={EntriesData.data} columns={field.concat(ActionFields)} />
        </Card>
    );
};
