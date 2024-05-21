import type { IUser } from '@/types/user.types';
import { beautifulDate } from '@/utils/date';
import style from './style.module.scss';

interface IPropsDefaultUsersElement {
  users: IUser[];
  deleteUser: (userId: number) => Promise<void>;
  isActiveView: (userId: number) => boolean;
  cancel: () => void;
  init_create: () => void;
  init_delete: (userId: number) => void;
}

export const DefaultUsersElement: FC<IPropsDefaultUsersElement> = (props) => {
  const { users, init_create } = props;

  return (
    <div className={style.users}>
      <h2>Пользователи</h2>
      <button className={style.userButton} onClick={init_create}>
        Создать пользователя
      </button>
      <div className={style.usersList}>
        {users.map((user, index) => (
          <div key={index} className={style.usersEl}>
            <p>ID: {user.id}</p>
            <p>Логин: {user.login}</p>
            <p>Права: {user.role}</p>
            <p>
              Последний раз онлайн:
              {user.lastAt ? beautifulDate(user.lastAt) : 'Ещё не заходил'}
            </p>
            <p>
              Создан аккаунт:
              {beautifulDate(user.createdAt)}
            </p>
            <DeleteUserElement user={user} {...props} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface IPropsDeleteUserElement {
  user: IUser;
  deleteUser: (userId: number) => void;
  isActiveView: (userId: number) => boolean;
  cancel: () => void;
  init_delete: (userId: number) => void;
}
const DeleteUserElement: FC<IPropsDeleteUserElement> = (props) => {
  const { user, isActiveView, deleteUser, cancel, init_delete } = props;

  if (user.role === 'admin') return null;

  return (
    <div className={style.userDeleteBox}>
      {isActiveView(user.id) ? ( //context.isActiveView('delete_user', user.id)
        <>
          <button className={style.userDeleteButton} onClick={() => deleteUser(user.id)}>
            Подтвердить удаление
          </button>
          <button className={style.userDeleteCancel} onClick={cancel}>
            Отмена
          </button>
        </>
      ) : (
        <button className={style.userDeleteButton} onClick={() => init_delete(user.id)}>
          Удалить
        </button>
      )}
    </div>
  );
};
