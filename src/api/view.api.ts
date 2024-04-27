import { ICreateView, IViewUnion } from '@/types/view.types';
import axios from 'axios';

export async function getAllViews(): Promise<IViewUnion[]> {
    try {
        const response = await axios.get<IViewUnion[]>(
            `${window.location.origin}/api/view/getAll`,
        );

        return response.data;
    } catch (error) {
        console.error('Не удалось получить список View');
        throw error;
    }
}

export async function setView(viewData: ICreateView): Promise<IViewUnion> {
    try {
        const response = await axios.post<IViewUnion>(
            `${window.location.origin}/api/view/setView`,
            viewData,
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
