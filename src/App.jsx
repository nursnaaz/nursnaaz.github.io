import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from '@cloudscape-design/components/app-layout'
import TopNavigation from '@cloudscape-design/components/top-navigation'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { TutorialPage } from './pages/TutorialPage'
import { tutorials } from './data/tutorials'


function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <>
      <TopNavigation
        identity={{
          href: '/',
          title: 'Noordeen Tutorials',
          logo: {
            src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPjxwYXRoIGQ9Ik0xNiA4TDI0IDI0SDhMMTYgOFoiIGZpbGw9IndoaXRlIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMzIiIHkyPSIzMiI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzY2N2VlYSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzc2NGJhMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==',
            alt: 'Noordeen Tutorials'
          }
        }}
        utilities={[
          {
            type: 'button',
            text: 'GitHub',
            href: 'https://github.com/nursnaaz',
            external: true,
            externalIconAriaLabel: '(opens in new tab)'
          }
        ]}
      />
      
      <AppLayout
        navigation={<Navigation />}
        navigationOpen={navOpen}
        onNavigationChange={({ detail }) => setNavOpen(detail.open)}
        content={
          <Routes>
            <Route path="/" element={<HomePage />} />
            {tutorials.map(tutorial => (
              <Route 
                key={tutorial.id}
                path={`/tutorial/${tutorial.id}`}
                element={<TutorialPage tutorial={tutorial} />}
              />
            ))}
          </Routes>
        }
        toolsHide
        navigationWidth={280}
      />
    </>
  )
}


export default App
