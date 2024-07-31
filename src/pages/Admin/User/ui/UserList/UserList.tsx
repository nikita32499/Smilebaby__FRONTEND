import { Button, Space, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import { UserApi } from 'entities/user';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { beautifulDate } from 'shared/helpers/date';
import { deepCopy } from 'shared/helpers/object';
import { DeleteButton } from 'shared/ui/DeleteButton/DeleteButton';
import { IUser } from 'shared_SmileBaby/dist/types/user.types';

interface IPropsUserList {
    flow: {
        goCreate: () => void;
    };
}

export const UserList: FC<IPropsUserList> = (props) => {
    const { flow } = props;

    const router = useRouter();

    const UserGetAll = UserApi.useGetAllQuery();

    const [UserDelete] = UserApi.useDeleteMutation();

    const users = useMemo(() => deepCopy(UserGetAll.data ?? []), [UserGetAll.data]);

    const columns: ColumnsType<IUser> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Логин',
            dataIndex: 'login',
            key: 'login',
        },
        {
            title: 'Права',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Последний раз онлайн',
            dataIndex: 'lastAt',
            key: 'lastAt',
            render: (lastAt: number) =>
                lastAt ? beautifulDate(lastAt) : 'Ещё не заходил',
        },
        {
            title: 'Аккаунт Создан',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: number) => beautifulDate(createdAt),
        },
        {
            title: 'Действия',
            key: 'action',
            render: (text: unknown, user: IUser) => {
                if (user.role !== 'admin') {
                    return <DeleteButton confirmDelete={() => UserDelete(user.id)} />;
                } else {
                    return null;
                }
            },
        },
    ];

    return (
        <Space size='large' direction='vertical'>
            <Title style={{ textAlign: 'center' }}>Пользователи</Title>
            <Space>
                <Button type='primary' onClick={flow.goCreate}>
                    Создать пользователя
                </Button>
                <Button onClick={() => router.push('/panel/admin')}>Назад</Button>
            </Space>

            <Table dataSource={users} columns={columns} />
        </Space>
    );
};
