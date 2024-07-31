import { Button, Card, Input } from 'antd';
import { useImmerState } from 'shared/hook/useImmerState';
import { IItemUpsertData } from 'shared_SmileBaby/dist/types/item.types';
import { IStateCreateUpdateItem } from '../CreateUpdateItem';

interface IPropsAmountElement {
    amount: IItemUpsertData['amount'][number];
    setState: (updater: (prev: IStateCreateUpdateItem) => void) => void;
}

interface IStateAmountElement {
    error: string | null;
}

export const AmountElement: FC<IPropsAmountElement> = (props) => {
    const { amount, setState } = props;

    const [{ error }, setStateAmountElement] = useImmerState<IStateAmountElement>({
        error: null,
    });

    const clearError = () =>
        setStateAmountElement((prev) => {
            prev.error = null;
        });

    const deleteAmount = () => {
        setState((prev) => {
            if (!prev.newItemData.amount) {
                prev.newItemData.amount = [];
            }
            prev.newItemData.amount = prev.newItemData.amount.filter(
                (el) => el.uuid !== amount.uuid,
            );
        });
    };

    return (
        <Card key={amount.uuid}>
            <span>
                <span>Кол-во</span>
                <Input
                    placeholder='Кол-во'
                    onChange={(event) => {
                        const quantity: number = Number(event.target.value ?? '');
                        if (isNaN(quantity)) {
                            return setStateAmountElement((prev) => {
                                prev.error = 'укажите число';
                            });
                        }

                        setState((prev) => {
                            const currentAmount = prev.newItemData.amount?.find(
                                (currentAmount) => currentAmount.uuid === amount.uuid,
                            );
                            if (currentAmount) {
                                currentAmount.quantity = quantity;
                            }
                        });
                        clearError();
                    }}
                />
            </span>
            <span>
                <span>Размер</span>
                <Input
                    placeholder='Размер'
                    onChange={(event) => {
                        const size: string | undefined = event.target.value;
                        if (!size) {
                            return setStateAmountElement((prev) => {
                                prev.error = 'укажите размер';
                            });
                        }
                        // amount.size = size;
                        // form.setValue('amount', amountValue);

                        setState((prev) => {
                            const currentAmount = prev.newItemData.amount?.find(
                                (currentAmount) => currentAmount.uuid === amount.uuid,
                            );
                            if (currentAmount) {
                                currentAmount.size = size;
                            }
                        });

                        clearError();

                        setState((prev) => {
                            prev.newItemData.amount;
                        });
                    }}
                />
            </span>
            <Button onClick={deleteAmount}>Удалить</Button>
            {error && <div>{error}</div>}
        </Card>
    );
};
