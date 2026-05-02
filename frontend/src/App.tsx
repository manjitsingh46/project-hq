import { Suspense } from 'react'
import { AppRouter } from './routes/AppRouter'
import { LoadingScreen } from './components/LoadingScreen'

function App() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading workspace" />}>
      <AppRouter />
    </Suspense>
  )
}

export default App
