import { createSlice } from '@reduxjs/toolkit';

interface IInitStateItems {
  meta: {
    maxPrice?: number;
    minPrice?: number;
    sectionId?: number;
  };
  filter: {
    sort: 'default' | 'by price+' | 'by price-';
    price?: { min: number; max: number };
    size: string[];
    season: string[];
    modified: boolean;
  };
}

const initialState: IInitStateItems = {
  meta: {
    maxPrice: 99999,
    minPrice: 0,
  },
  filter: {
    sort: 'default',
    size: [],
    season: [],
    modified: false,
  },
};

export const itemsSlice = createSlice({
  name: 'itemsSlice',
  initialState,
  reducers: {},
});
