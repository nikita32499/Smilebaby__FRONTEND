import { ICreateView, IViewUnion } from '@/types/view.types';
import { createContext } from 'react';

//

import { IViewObject } from './ChangeViewElement';

export interface IPropsChangeViewElement {
  view: IViewUnion;
  save: (saveData: ICreateView) => Promise<void>;
  cancel: () => void;
  rerender: () => void;
  //загрузка фаила на сервер, возвращает путь до фаила
  uploadFile: (file: File) => Promise<string>;
  changeImage: (params: { file: File; obj: IViewObject; key: string }) => void;
  chooseImage: (file: File, setData: (src: string) => void) => void;
  isImage: (key: string) => boolean;
}

const ContextChangeViewElement = createContext<IPropsChangeViewElement>(null!);

export { ContextChangeViewElement };
