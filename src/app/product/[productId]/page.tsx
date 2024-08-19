import { nextGetAllEntries } from 'entities/entries';
import { ProductPage } from 'pages/Product';
import { mapSECTION } from 'shared/helpers/entries';

export default ProductPage;

export async function generateStaticParams() {
    const sections = mapSECTION(await nextGetAllEntries());

    return sections.map((section) => {
        productId: section.data.slug;
    });
}
