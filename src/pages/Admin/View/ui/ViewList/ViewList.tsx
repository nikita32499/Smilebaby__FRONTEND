import { EditFilled } from '@ant-design/icons';
import { Button, Table } from 'antd';
import Title from 'antd/es/typography/Title';
import { IViewUnion } from 'shared_SmileBaby/dist/types/view-custom.types';

import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';

interface IPropsViewList {
    viewsList: IViewUnion[];
    flow: {
        goEdit: (view: IViewUnion) => void;
    };
}

export const ViewList: FC<IPropsViewList> = (props) => {
    const { viewsList, flow } = props;
    const router = useRouter();

    const columns: ColumnsType<IViewUnion> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Название', dataIndex: 'name', key: 'name' },
        { title: 'Описание', dataIndex: 'description', key: 'description' },
        {
            title: 'Действие',
            key: 'action',
            render: (text: unknown, view: IViewUnion) => (
                <Button
                    icon={<EditFilled />}
                    onClick={() => {
                        flow.goEdit(view);
                    }}
                >
                    Изменить
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Button type='default' onClick={() => router.push('/panel/admin')}>
                Назад
            </Button>
            <Title>Настройка страниц</Title>
            <Table dataSource={viewsList} columns={columns} />
        </div>
    );
};
