import { nextGetAllItems } from 'entities/item';
import { PageParams } from 'shared/types/params';
import { ProductClient } from './ProductClient/ProductClient';

interface IPropsProductPage extends PageParams {
    params: {
        productId: string;
    };
}

export const ProductPage: FC<IPropsProductPage> = async (props) => {
    const { params } = props;

    const items = await nextGetAllItems();

    const currentItem = items.find((item) => item.id === Number(params.productId));

    return currentItem ? (
        <div>
            <ProductClient item={currentItem} />
        </div>
    ) : (
        <div>Товар не найден</div>
    );
};
