import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FacebookSDK from './components/FacebookSDK'

function App() {
  const appId = '2141939222818030'
  const apiVersion = 'v19.0'

  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>

      <div className="card">
        <FacebookSDK appId={appId} apiVersion={apiVersion} />
        {/* Your other React components */}
      </div>
    </>
  )
}

export default App
