import { FileService } from '@/service/file.service';
import { useEffect, useState } from 'react';
import style from './style.module.scss';

export interface IPropsImagePreview {
  file: File;
  apply: () => void;
  cancel: () => void;
}

export const ImagePreviewComponent: FC<IPropsImagePreview> = (props) => {
  const { file, apply, cancel } = props;

  const [src, setSrc] = useState<string>();

  useEffect(() => {
    (async () => {
      setSrc(await FileService.getImageBlob(file));
    })();
  }, [file]);

  return (
    <div className={style.ImagePreviewComponent}>
      <div className={style.ImagePreviewComponent__box}>
        <p className={style.ImagePreviewComponent__title}>Предпросмотр</p>
        {src ? <img src={src} alt="" /> : <div>Изображение загружается...</div>}
        <button
          className={style.ImagePreviewComponent__button + ' ' + style.ImagePreviewComponent__button_apply}
          onClick={apply}
        >
          Загрузить
        </button>
        <button
          className={style.ImagePreviewComponent__button + ' ' + style.ImagePreviewComponent__button_cancel}
          onClick={cancel}
        >
          Отмена
        </button>
      </div>
    </div>
  );
};
