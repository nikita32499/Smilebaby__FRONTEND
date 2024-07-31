"use client"

import { useAppSelector } from 'shared/hook/redux-hooks'
import { IEntriesSection } from 'shared_SmileBaby/dist/types/entries.types'
import { IItem } from 'shared_SmileBaby/dist/types/item.types'



type TSortCases = { [key: string]: (a: IItem, b: IItem) => number }

const sortCases = {
	"default": (a, b) => a.id - b.id, "by price+": (a, b) => a.price - b.price, "by price-": (a, b) => b.price - a.price
} as const satisfies TSortCases

export const useFilterItem = (items: IItem[], section: IEntriesSection | undefined) => {
	const filter = useAppSelector(store => store.itemsSlice.filter)

	const filteredItem = items.filter(item => {

		const maxPriceFilterErr = filter.price.max && item.price > filter.price.max
		const minPriceFilterErr = filter.price.min && item.price < filter.price.min
		const seasonFilterErr = filter.season.length > 0 && filter.season.includes(item.season.value)

		const sizeFilterErr = filter.size.length > 0 && item.amount.some(amount => filter.size.includes(amount.size))


		const sectionFilterErr = section && section.id !== item.sectionId

		if (sectionFilterErr) {
			return false
		}

		if (maxPriceFilterErr || minPriceFilterErr || seasonFilterErr || sizeFilterErr) {
			return false
		} else {
			return true
		}
	})

	const sortedItem = filteredItem.sort(sortCases[filter.sort])

	return sortedItem
}