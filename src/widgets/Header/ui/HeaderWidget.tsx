interface IPropsLeftButton {
    text: string;
    href: string;
}
const LeftButton: FC<IPropsLeftButton> = (props) => {
    const { text, href } = props;
    return <a href={href}>{text}</a>;
};

export const HeaderWidget: FC = () => {
    const leftLinks: IPropsLeftButton[] = [
        {
            text: 'Витрина',
            href: '',
        },
        {
            text: 'О нас',
            href: '',
        },
        {
            text: 'Контакты',
            href: '',
        },
    ];

    return (
        <div className='border-b-[1px] border-[#D9D9D9]'>
            <div className='grid grid-cols-3 items-center max-w-[1200px]  h-[103px] m-auto'>
                <div className='flex gap-[15px]'>
                    {leftLinks.map((link) => (
                        <LeftButton {...link} />
                    ))}
                </div>
                <a href='/' className='m-auto'>
                    <img src='/asserts/svg/SmileBaby.svg' alt='' />
                </a>
                <div className='flex ml-auto'>
                    <img src='/asserts/svg/korzina.svg' alt='' />
                    <span className='ml-[6px] text-[16px]'>Корзина</span>
                </div>
            </div>
        </div>
    );
};
