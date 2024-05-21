'use client';

import { useRef } from 'react';

import { UserRole, isUserRole } from '@/types/user.types';

import style from './style.module.scss';

interface IPropsCreateUserElement {
  errors: string | null;
  cancel: () => void;
  setError: (error: string) => void;
  createUser: (login: string, password: string, role: UserRole) => Promise<void>;
}

export const CreateUserElement: FC<IPropsCreateUserElement> = (props) => {
  const { errors, cancel, setError, createUser } = props;

  const ref = {
    login: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    role: useRef<HTMLSelectElement>(null),
  };

  return (
    <div className={style.userCreateBox}>
      <h2>Создание пользователя</h2>
      <div className={style.userInputBox}>
        <p>Логин</p>
        <input ref={ref.login} type="text" placeholder={'Придумайте логин'} />
      </div>
      <div className={style.userInputBox}>
        <p>Пароль</p>
        <input ref={ref.password} type="password" placeholder={'Придумайте пароль'} />
      </div>
      <div className={style.userSelectBox}>
        <p>Права</p>
        <select ref={ref.role} name="role" id="">
          <option value="">Выберите права</option>
          {Object.values(UserRole)
            .filter((role) => role !== 'admin' && role !== 'user') //TODO: когда нужно будет создать обычных пользователей нужно убрать 'user'
            .map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
        </select>
      </div>
      <button
        className={style.userButton}
        onClick={async () => {
          const login = ref.login.current?.value;
          const password = ref.password.current?.value;
          const role = ref.role.current?.value;

          if (!login || !password || !role)
            return setError(`Укажите ${!login ? 'логин' : !password ? 'пароль' : !role ? 'права' : ''}`);

          if (!isUserRole(role)) throw new Error('Не существующая роль');

          await createUser(login, password, role);
        }}
      >
        Создать
      </button>
      <button className={style.userButton} onClick={cancel}>
        Назад
      </button>
      <p className={style.userError} style={{ opacity: `${errors ? '1' : '0'}` }}>
        {errors ?? '!'}
      </p>
    </div>
  );
};
