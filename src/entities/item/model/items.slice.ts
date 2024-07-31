// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IInitStateItems {
    meta: {
        maxPrice?: number
        minPrice?: number
        sectionId?: number
    }
    filter: {
        sort: 'default' | 'by price+' | 'by price-'
        price: { min: number | null; max: number | null }
        size: string[]
        season: string[]
        modified: boolean
    }
}

const initialState: IInitStateItems = {
    meta: {
        maxPrice: 99999,
        minPrice: 0,
    },
    filter: {
        sort: 'default',
        price: { max: null, min: null },
        size: [],
        season: [],
        modified: false,
    },
}



import { createSlice, PayloadAction } from '@reduxjs/toolkit'



export const itemsSlice = createSlice({
    name: 'itemsSlice',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<IInitStateItems["filter"]>) => {
            state.filter = {
                ...state.filter,
                ...action.payload,
                modified: true
            }
        },
        resetFilter: (state, action: PayloadAction<void>) => {
            state.filter = initialState.filter
        },

    },
})
