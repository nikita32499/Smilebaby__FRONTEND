import { Image } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';

interface IExtendColumnsType<Type, Meta> extends ColumnsType<Type> {
    meta?: Meta;
}

export const fieldItem: IExtendColumnsType<IItem, string> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Название',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Описание',
        dataIndex: 'descriptions',
        key: 'descriptions',
    },
    {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Наличие',
        dataIndex: 'amount',
        key: 'amount',
        render: (text: unknown, item: IItem) => {
            return (
                <div className='flex flex-col gap-4 overflow-y-scroll'>
                    {item.amount.map((amount) => (
                        <div className='flex flex-col'>
                            <span>
                                <strong>Размер</strong>
                                {amount.size}
                            </span>
                            <span>
                                <strong>Кол-во</strong>
                                {amount.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            );
        },
    },
    {
        title: 'Превью',
        dataIndex: 'img_main',
        key: 'img_main',
        render: (text: unknown, item: IItem) => {
            return <Image src={item.img_main} className='!w-[150px]' />;
        },
    },
    {
        title: 'Картинки',
        dataIndex: 'img_prev',
        render: (text: unknown, item: IItem) => {
            return (
                <div className='flex overflow-x-scroll'>
                    {item.img_prev.map((src) => (
                        <Image src={src} className='!w-[150px]' />
                    ))}
                </div>
            );
        },
    },
    {
        title: 'Сезон',
        dataIndex: 'season',
        key: 'season',
        render: (text: unknown, item: IItem) => item.season.value,
    },
    {
        title: 'Страна производитель',
        dataIndex: 'country',
        key: 'country',
        render: (text: unknown, item: IItem) => item.country.value,
    },
    {
        title: 'Раздел',
        dataIndex: 'section',
        key: 'section',
        render: (text: unknown, item: IItem) => item.section.value,
    },
    {
        title: 'SLUG',
        dataIndex: 'slug',
        key: 'slug',
    },
];

type dd = {
    key: keyof IItem;
};

type TFieldCreateItem = ((
    | {
          type: 'amount';
          key: 'amount';
      }
    | {
          type: 'string';
          key: 'name';
      }
    | {
          type: 'many-text';
      }
    | {
          type: 'number';
      }
    | {
          type: 'image';
      }
    | {
          type: 'images';
      }
    | {
          type: 'entries';
          name: 'SEASON' | 'COUNTRY' | 'SECTION';
      }
) & {
    title: string;
    key: string;
})[];

export const fieldCreateItem = [
    {
        title: 'Название',
        key: 'name',
        type: 'string',
    },
    {
        title: 'Описание',
        key: 'descriptions',
        type: 'many-text',
    },
    {
        title: 'Цена',
        key: 'price',
        type: 'number',
    },
    {
        title: 'Превью',
        key: 'img_main',
        type: 'image',
    },
    {
        title: 'Картинки',
        key: 'img_prev',
        type: 'images',
    },
    {
        title: 'Наличие',
        key: 'amount',
        type: 'amount',
    },
    {
        title: 'Сезон',
        key: 'seasonId',
        type: 'entries',
        name: 'SEASON',
    },
    {
        title: 'Страна производитель',
        key: 'countryId',
        type: 'entries',
        name: 'COUNTRY',
    },
    {
        title: 'Раздел',
        key: 'sectionId',
        type: 'entries',
        name: 'SECTION',
    },
] as const satisfies TFieldCreateItem;
