import { IView__HOME, SchemaView__HOME } from '@/types/view.types';
import Ajv from 'ajv';

const ajv = new Ajv();

export const validationView__HOME = ajv.compile<IView__HOME>(SchemaView__HOME);
