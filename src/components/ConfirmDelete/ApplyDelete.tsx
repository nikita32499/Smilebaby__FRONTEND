import { useState } from 'react';
import style from './style.module.scss';

interface IPropsApplyDeleteComponent {
  apply: () => void;
}

const ApplyDeleteComponent: FC<IPropsApplyDeleteComponent> = ({ apply }) => {
  const [view, setView] = useState<boolean>(false);

  return (
    <div className={style.ApplyDeleteComponent}>
      {view ? (
        <>
          <button onClick={() => setView(false)}>Отмена</button>
          <button
            onClick={() => {
              apply();
              setView(false);
            }}
          >
            Подтвердить удаление
          </button>
        </>
      ) : (
        <button onClick={() => setView(true)}>Удалить</button>
      )}
    </div>
  );
};

export { ApplyDeleteComponent };
