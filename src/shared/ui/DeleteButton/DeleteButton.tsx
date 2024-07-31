import { DeleteOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useImmerState } from 'shared/hook/useImmerState';

interface IPropsDeleteButton {
    confirmDelete: () => void;
}

interface IStateDeleteButton {
    view: boolean;
}

export const DeleteButton: FC<IPropsDeleteButton> = (props) => {
    const { confirmDelete } = props;

    const [state, setState] = useImmerState<IStateDeleteButton>({ view: false });

    const flow = {
        goBack: () =>
            setState((prev) => {
                prev.view = false;
            }),
        goNext: () =>
            setState((prev) => {
                prev.view = true;
            }),
    };

    return (
        <div>
            {state.view ? (
                <Space>
                    <Button
                        onClick={() => {
                            confirmDelete();
                            flow.goBack();
                        }}
                    >
                        Подтвердить удаление
                    </Button>
                    <Button onClick={flow.goBack} type='primary'>
                        Отмена
                    </Button>
                </Space>
            ) : (
                <Button onClick={flow.goNext} icon={<DeleteOutlined />}>
                    Удалить
                </Button>
            )}
        </div>
    );
};
