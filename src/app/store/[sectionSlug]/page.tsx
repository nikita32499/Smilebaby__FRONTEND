"server-only"
import { nextGetAllEntries } from 'entities/entries/api/next/entries'
import { StorePage } from 'pages/Store'
import { mapSECTION } from 'shared/helpers/entries'

export default StorePage


export async function generateStaticParams() {
	const sections = mapSECTION(await nextGetAllEntries())
	

	return sections.map(section=>{
		sectionSlug:section.data.slug
	})
}