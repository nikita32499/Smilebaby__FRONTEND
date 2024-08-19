'use client';

import lodash from 'lodash';

interface IInitStateItems {
    meta: {
        absoluteMaxPrice: number;
        absoluteMinPrice: number;
    };
    filter: {
        sort: 'default' | 'by price+' | 'by price-';
        price: { min: number; max: number };
        country: string[];
        size: string[];
        season: string[];
        modified: boolean;
    };
    cart: IPurchase[];
}

export type IPurchase = {
    item: IItem;
    size: IItem['amount'][number]['size'];
    quantity: IItem['amount'][number]['quantity'];
};

const initialState: IInitStateItems = {
    meta: {
        absoluteMaxPrice: Infinity,
        absoluteMinPrice: 0,
    },
    filter: {
        sort: 'default',
        price: { max: Infinity, min: 0 },
        country: [],
        size: [],
        season: [],
        modified: false,
    },
    cart: [],
} as const;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mergeAndRemoveDuplicates } from 'shared/helpers/object';
import { IItem } from 'shared_SmileBaby/dist/types/item.types';
import { ItemApi } from '../api/item.api';
import { findPurchase } from '../helper/cart';
type DiscriminatedUnion<T> = {
    [K in keyof T]: { key: K; value: T[K] extends Array<infer U> ? U : T[K] };
}[keyof T];

type ISetFilter = DiscriminatedUnion<IInitStateItems['filter']>;

export const itemsSlice = createSlice({
    name: 'itemsSlice',
    initialState,
    reducers: {
        addInCart: (state, action: PayloadAction<IInitStateItems['cart'][number]>) => {
            const existItem = findPurchase(state.cart, action.payload.item);
            if (existItem) {
                existItem.quantity += 1;
            } else {
                state.cart.push(action.payload);
            }
        },
        removeFromCart: (
            state,
            action: PayloadAction<IInitStateItems['cart'][number]>,
        ) => {
            const existItem = findPurchase(state.cart, action.payload.item);
            if (existItem) {
                if (existItem.quantity - action.payload.quantity >= 1) {
                    existItem.quantity -= action.payload.quantity;
                } else {
                    state.cart = state.cart.filter((purchase) => purchase !== existItem);
                }
            }
        },
        setFilter: (state, action: PayloadAction<ISetFilter[]>) => {
            for (const option of action.payload) {
                if (
                    'size' === option.key ||
                    'country' === option.key ||
                    'season' === option.key
                ) {
                    state.filter[option.key] = mergeAndRemoveDuplicates(
                        state.filter[option.key],
                        [option.value],
                    );
                } else if ('sort' === option.key) {
                    state.filter[option.key] = option.value;
                } else if ('price' === option.key) {
                    if (option.value.min >= option.value.max) {
                        return;
                    }
                    state.filter[option.key] = {
                        ...state.filter[option.key],
                        ...option.value,
                    };
                }
            }

            if (
                lodash.isEqual({ ...state.filter, modified: false }, initialState.filter)
            ) {
                state.filter.modified = false;
            } else {
                state.filter.modified = true;
            }
        },
        resetFilter: (state, action: PayloadAction<void>) => {
            state.filter = initialState.filter;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(ItemApi.endpoints.getAll.matchFulfilled, (state, action) => {
            state.meta = {
                ...state.meta,
                absoluteMaxPrice: action.payload.reduce(
                    (max, { price }) => (max < price ? price : max),
                    0,
                ),
                absoluteMinPrice: action.payload.reduce(
                    (min, { price }) => (min > price ? price : min),
                    ('0' in action.payload && action.payload[0].price) || 0,
                ),
            };
        });
    },
});
