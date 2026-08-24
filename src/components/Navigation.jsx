import { useNavigate, useLocation } from 'react-router-dom'
import SideNavigation from '@cloudscape-design/components/side-navigation'
import { tutorials } from '../data/tutorials'

const SECTIONS = [
  { id: 'search', text: 'Search & embeddings' },
  { id: 'transformers', text: 'Transformers' },
  { id: 'llms', text: 'Working with LLMs' },
  { id: 'rag', text: 'RAG' },
  { id: 'agents', text: 'Agents' },
  { id: 'production', text: 'Production' },
]

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { type: 'link', text: 'Home', href: '/' },
    { type: 'divider' },
    ...SECTIONS.map((section) => ({
      type: 'section',
      text: section.text,
      items: tutorials
        .filter((t) => t.series === section.id)
        .map((tutorial) => ({
          type: 'link',
          text: tutorial.title,
          href: `/tutorial/${tutorial.id}`,
          info: tutorial.level,
        })),
    })),
  ]

  return (
    <SideNavigation
      activeHref={location.pathname}
      header={{ text: 'Tutorials', href: '/' }}
      items={items}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault()
          navigate(event.detail.href)
        }
      }}
    />
  )
}
