import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useContext } from 'react';
import { uploadOne } from 'shared/api/file.api';
import { ViewContext } from '../ViewProvider/ViewProvider';
interface IPropsUploadImage {
    setImage: (path: string) => void;
}

export const UploadImage: FC<IPropsUploadImage> = (props) => {
    const { setImage } = props;
    const viewContext = useContext(ViewContext);
    return (
        <Upload
            showUploadList={false}
            beforeUpload={(file) => {
                viewContext.setState((prev) => {
                    prev.imagePreview = {
                        file,
                        apply: async () => {
                            const result = await uploadOne(file);
                            setImage(result.path);
                        },
                    };
                });
            }}
        >
            <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
        </Upload>
    );
};
