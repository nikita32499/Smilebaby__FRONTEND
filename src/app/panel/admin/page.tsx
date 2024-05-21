'use client';

// import { deleteUsers } from '@/api/users.api';
import { useMemo, useState } from 'react';

import { uploadOne } from '@/api/file.api';
import { ImagePreviewComponent } from '@/components/ImagePreview/ImagePreview';
import { FileService } from '@/service/file.service';
import { UserRole } from '@/types/user.types';
import { ICreateView, IViewUnion } from '@/types/view.types';
import { getUserData } from '@/utils/localStorage';
import { ChangeViewElement, IViewObject } from './ui/ChangeViewElement/ChangeViewElement';
import { CreateUserElement } from './ui/CreateUserElement/CreateUserElement';
import { DefaultUsersElement } from './ui/DefaultUsersElement/DefaultUsersElement';
import { DefaultViewElement } from './ui/DefaultViewElement/DefaultViewElement';

import { IPropsImagePreview } from '@/components/ImagePreview/ImagePreview';
import { UserApi } from '@/store/api/users.api';
import { ViewApi } from '@/store/api/view.api';
// import { ItemsApi } from '@/store/api/users.api';

type TViewsState = string | number | boolean;

interface IStateAdminPanel {
  data: {
    imagePreview?: IPropsImagePreview;
    filesUploadQueue: Map<object, Record<string, () => Promise<void>>>;
    editView?: IViewUnion;
  };
  view: {
    view?: TViewsState;
    users_create?: TViewsState;
    users_delete?: TViewsState;
    view_edit?: TViewsState;
  };

  errors: {
    users: string | null;
    views: string | null;
  };
}

type TypeSetErrors = Partial<IStateAdminPanel['errors']>;

export default function AdminPage() {
  const [state, setState] = useState<IStateAdminPanel>({
    data: {
      filesUploadQueue: new Map(),
    },
    view: {},
    errors: {
      views: null,
      users: null,
    },
  });

  const UserGetAll = UserApi.useGetAllQuery();
  const [createUser, {}] = UserApi.useCreateMutation();
  const [UserDelete, {}] = UserApi.useDeleteMutation();

  const ViewGetAll = ViewApi.useGetAllQuery();
  const [ViewSet] = ViewApi.useSetMutation();

  const users = useMemo(() => JSON.parse(JSON.stringify(UserGetAll.data ?? [])), [UserGetAll.data]);
  const views = useMemo(() => JSON.parse(JSON.stringify(ViewGetAll.data ?? [])), [ViewGetAll.data]);

  function setError(name: keyof TypeSetErrors, error: string | null) {
    const fn = (name: keyof TypeSetErrors, error: string | null) => {
      setState((prev) => {
        prev.errors[name] = error;
        return { ...prev };
      });
    };
    setTimeout(() => {
      fn(name, null);
    }, 15000);
    fn(name, error);
  }

  function isActiveView(name: keyof IStateAdminPanel['view'], id?: TViewsState): boolean {
    return state.view[name] && typeof state.view[name] === 'boolean' ? true : state.view[name] === id;
  }

  function setView(...views: { name: keyof IStateAdminPanel['view']; id: TViewsState }[]) {
    setState((prev) => {
      views.forEach((view) => {
        prev.view[view.name] = view.id;
      });
      return { ...prev };
    });
  }

  const userData = getUserData(); //TODO:переделать на redux persist

  return (
    <div>
      {state.view.view_edit && state.data.editView ? (
        <ChangeViewElement
          uploadFile={async (file: File) => {
            const result = await uploadOne(file);
            return result.path;
          }}
          chooseImage={(file: File, setData: (src: string) => void) => {
            setState((prev) => {
              prev.data.imagePreview = {
                file,
                apply: async () => {
                  const src = await FileService.getImageBlob(file);
                  setData(src);
                  setState((prev) => {
                    delete prev.data.imagePreview;
                    return { ...prev };
                  });
                },
                cancel: () =>
                  setState((prev) => {
                    delete prev.data.imagePreview;
                    return { ...prev };
                  }),
              };
              return { ...prev };
            });
          }}
          isImage={(key) => FileService.isImage(key)}
          view={state.data.editView}
          save={async ({ name, description, payload }: ICreateView) => {
            const promises: Promise<void>[] = [];
            state.data.filesUploadQueue.forEach(async (value, key) => {
              for (const uploadFunc of Object.values(value)) {
                promises.push(uploadFunc());
              }
            });
            await Promise.all(promises);

            // const newView = await setViews({
            //   name: name,
            //   description: description,
            //   payload: payload,
            // });
            // requestListViews();
            await ViewSet({
              name: name,
              description: description,
              payload: payload,
            });

            setView({ name: 'view_edit', id: false });
          }}
          cancel={() => {
            setView({ name: 'view_edit', id: false });
          }}
          rerender={() => setState((prev) => ({ ...prev }))}
          changeImage={({ file, obj, key }: { file: File; obj: IViewObject; key: string }) => {
            setState((prev) => {
              prev.data.imagePreview = {
                file,
                apply: async () => {
                  const blobSrc = await FileService.getImageBlob(file);
                  setState((prev) => {
                    if (!prev.data.filesUploadQueue.has(obj)) {
                      prev.data.filesUploadQueue.set(obj, {});
                    }

                    const QueueObject = prev.data.filesUploadQueue.get(obj);
                    if (!QueueObject) throw new Error('Нет объекта');

                    QueueObject[key] = async () => {
                      const result = await uploadOne(file);
                      obj[key] = result.path;
                    };
                    setState((prev) => {
                      delete prev.data.imagePreview;
                      return { ...prev };
                    });
                    obj[key] = blobSrc;
                    return { ...prev };
                  });
                },
                cancel: () =>
                  setState((prev) => {
                    delete prev.data.imagePreview;
                    return { ...prev };
                  }),
              };
              return { ...prev };
            });
          }}
        />
      ) : (
        <DefaultViewElement
          views={views}
          init_edit={(view: IViewUnion) => {
            setState((prev) => {
              prev.data.editView = view;
              return { ...prev };
            });
            setView({ name: 'view_edit', id: true });
          }}
        />
      )}

      {typeof userData === 'object' &&
        userData.role === 'admin' &&
        (state.view.users_create ? (
          <CreateUserElement
            errors={state.errors.users}
            setError={(error: string) => {
              setError('users', error);
            }}
            cancel={() => {
              setView({ name: 'users_create', id: false });
            }}
            createUser={async (login: string, password: string, role: UserRole) => {
              try {
                await createUser({ login, password, role });

                setView({ name: 'users_create', id: false });
              } catch (error) {
                if (error instanceof Error) {
                  setError('users', error.message ?? 'Не удалось создать пользователя');
                }
              }
            }}
          />
        ) : (
          <DefaultUsersElement
            users={users}
            init_create={() => {
              setView({ name: 'users_create', id: true });
            }}
            cancel={() => {
              setView({ name: 'users_delete', id: false }, { name: 'users_create', id: false });
            }}
            init_delete={(userId: number) => {
              setView({ name: 'users_delete', id: userId });
            }}
            deleteUser={async (userId: number) => {
              await UserDelete(userId);

              setView({ name: 'users_delete', id: false });
            }}
            isActiveView={(userId: number) => {
              return isActiveView('users_delete', userId);
            }}
          />
        ))}

      {state.data.imagePreview instanceof Object && <ImagePreviewComponent {...state.data.imagePreview} />}
    </div>
  );
}
