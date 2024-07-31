import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ItemApi } from 'entities/item';
import { DeleteButton } from 'shared/ui/DeleteButton/DeleteButton';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { fieldItem } from '../../constants/field';

interface IPropsItemList {
    flow: {
        goUpdateItem: (item: IItem) => void;
        goCreate: () => void;
    };
}

export const ItemList: FC<IPropsItemList> = (props) => {
    const { flow } = props;
    const ItemGetAll = ItemApi.useGetAllQuery();

    const [ItemDelete] = ItemApi.useDeleteMutation();

    const tableFields: ColumnsType<IItem> = [
        {
            title: 'Действия',
            dataIndex: '',
            key: 'action',
            render: (text: unknown, item: IItem) => (
                <>
                    <DeleteButton confirmDelete={() => ItemDelete(item.id)} />
                    <Button
                        onClick={() => {
                            flow.goUpdateItem(item);
                        }}
                    >
                        Изменить
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type='primary' onClick={flow.goCreate}>
                Создать товар
            </Button>
            <Table
                dataSource={ItemGetAll.data}
                columns={fieldItem.concat(tableFields)}
            ></Table>
        </div>
    );
};
