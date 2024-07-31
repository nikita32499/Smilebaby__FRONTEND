import { Button, Image, Modal } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { getImageBlob } from 'shared/helpers/image';
import { ViewContext } from '../ViewProvider/ViewProvider';

export const ImagePreviewComponent: FC = () => {
    const { state, setState } = useContext(ViewContext);

    const { imagePreview } = state;

    const [src, setSrc] = useState<string>();

    useEffect(() => {
        if (!imagePreview) return;
        getImageBlob(imagePreview.file).then((blobSrc) => setSrc(blobSrc));
    }, [imagePreview?.file]);

    const cancel = () =>
        setState((prev) => {
            prev.imagePreview = null;
        });

    if (!imagePreview) return null;

    return (
        <Modal
            visible={true}
            title='Предпросмотр'
            onCancel={cancel}
            footer={[
                <Button
                    key='cancel'
                    onClick={() => {
                        cancel();
                    }}
                >
                    Отмена
                </Button>,
                <Button
                    key='apply'
                    type='primary'
                    onClick={() => {
                        imagePreview.apply();
                        cancel();
                    }}
                >
                    Загрузить
                </Button>,
            ]}
        >
            {src && <Image src={src} alt='Предпросмотр изображения' />}
        </Modal>
    );
};
