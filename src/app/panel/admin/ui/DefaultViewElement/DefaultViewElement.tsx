import type { IViewUnion } from '@/types/view.types';
import style from './style.module.scss';

interface IPropsDefaultViewElement {
  views: IViewUnion[];
  init_edit: (view: IViewUnion) => void;
}

export const DefaultViewElement: FC<IPropsDefaultViewElement> = (props) => {
  const { views, init_edit } = props;

  return (
    <div className={style.view}>
      <h2>Настройка страниц</h2>
      <div className={style.viewList}>
        {views.map((view, index) => (
          <div key={index}>
            <p>ID: {view.id}</p>
            <p>Название: {view.name}</p>
            <p>Описание: {view.description}</p>
            <button className={style.viewDefaultBoxButton} onClick={() => init_edit(view)}>
              Редактировать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
