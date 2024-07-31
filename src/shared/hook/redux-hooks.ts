"use client"
import { bindActionCreators } from '@reduxjs/toolkit'
import { itemsSlice } from 'entities/item'
import { profileSlice } from 'entities/user'
import { useMemo } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const rootActions = {
    ...itemsSlice.actions,
    ...profileSlice.actions,
}

export const useActions = () => {
    const dispath = useDispatch()

    return useMemo(() => bindActionCreators(rootActions, dispath), [dispath])
}
