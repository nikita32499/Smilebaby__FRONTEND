import { SchemaFileCreate } from 'shared_SmileBaby/dist/contract/file.contract';
import { appAxios } from './axios';
export const uploadOne = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await appAxios({
        method: 'post',
        url: `${window.location.origin}/api/files/uploadOne`,
        data: formData,
        headers: {
            'Content-Type': `multipart/form-data;`,
        },
    });

    return SchemaFileCreate.parse(response.data);
};
