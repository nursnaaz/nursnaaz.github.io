import { useNavigate, useLocation } from 'react-router-dom'
import SideNavigation from '@cloudscape-design/components/side-navigation'
import { tutorials } from '../data/tutorials'


export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()


  const items = [
    { type: 'link', text: 'Home', href: '/' },
    { type: 'divider' },
    {
      type: 'section',
      text: 'Tutorials',
      items: tutorials.map(tutorial => ({
        type: 'link',
        text: tutorial.title,
        href: `/tutorial/${tutorial.id}`,
        info: tutorial.level
      }))
    }
  ]


  return (
    <SideNavigation
      activeHref={location.pathname}
      header={{ text: 'ML/AI Tutorials', href: '/' }}
      items={items}
      onFollow={event => {
        if (!event.detail.external) {
          event.preventDefault()
          navigate(event.detail.href)
        }
      }}
    />
  )
}
