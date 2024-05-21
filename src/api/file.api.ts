import { AxiosResponse } from 'axios';
import { appAxios } from './axios';

export const uploadOne = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  let response: AxiosResponse;
  response = await appAxios({
    method: 'post',
    url: `${window.location.origin}/api/files/uploadOne`,
    data: formData,
    headers: {
      'Content-Type': `multipart/form-data;`,
    },
  });

  return response.data as { path: string };
};
