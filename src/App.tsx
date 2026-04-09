import { Provider } from 'react-redux'
import { store } from './redux/store'
import Router from './router/Router'
import './App.scss'

function App() {
  return (
    <>
      <Provider store={store}>
        <Router /> 
      </Provider>
    </>
  )
}

export default App
