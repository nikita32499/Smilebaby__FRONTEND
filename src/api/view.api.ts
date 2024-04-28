import { ICreateView, IViewUnion } from '@/types/view.types';
import axios from 'axios';

export async function getAllViews(): Promise<IViewUnion[]> {
    const response = await axios.get<IViewUnion[]>(
        `${window.location.origin}/api/view/getAll`,
    );

    return response.data;
}

export async function setView(viewData: ICreateView): Promise<IViewUnion> {
    const response = await axios.post<IViewUnion>(
        `${window.location.origin}/api/view/setView`,
        viewData,
    );
    return response.data;
}
