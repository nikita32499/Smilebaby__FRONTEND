import Link from 'next/link';

export const Footer = () => {
    return (
        <div className='flex bottom-0 bg-[#1C1C1E] w-full'>
            <div className='grid grid-cols-2 grid-rows-3-max m-auto max-w-[var(--max-site-width)] w-full pt-[30px]'>
                <div className='flex flex-col gap-[10px] items-start'>
                    <img
                        src='/asserts/svg/footer/SmileBaby.svg'
                        alt=''
                        className='h-[35px]'
                    />
                    <div className='flex gap-[6px]'>
                        <button>
                            <img src='/asserts/svg/footer/telegram.svg' alt='' />
                        </button>
                        <button>
                            <img src='/asserts/svg/footer/vk.svg' alt='' />
                        </button>
                        <button>
                            <img src='/asserts/svg/footer/whatsup.svg' alt='' />
                        </button>
                        <button>
                            <img src='/asserts/svg/footer/youtube.svg' alt='' />
                        </button>
                    </div>
                </div>
                <div className='flex flex-col items-end text-[#888]'>
                    <span className='text-[24px]'>+7 900 555-35-35</span>
                    <span className='text-[16px]'>Ежедневно с 09:00 до 21:00</span>
                    <span className='text-[16px]'>email: emailemailedsf@mail.ru</span>
                </div>
                <div className='col-span-full row-span-1 *:text-[#888] flex gap-[11px] py-[11px] border-y-[1px] border-[#3A3A3A] mt-[30px]'>
                    <Link href={'/store'}>Витрина</Link>
                    <Link href={'#'}>О нас</Link>
                    <Link href={'#'}>Контакты</Link>
                </div>
                <span className='col-span-full row-span-1 text-[#434] text-[14px] my-[30px]'>
                    Оставляя на сайте свои контактные данные, Вы даете согласие на
                    обработку своих персональных данных в соответствии с политикой
                    конфиденциальности. Сайт не является публичной офертой и носит
                    информационный характер.
                </span>
            </div>
        </div>
    );
};
