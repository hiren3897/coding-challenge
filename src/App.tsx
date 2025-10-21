import './App.css'
import { CounterDemo } from './components/CounterDemo'
import { EventBus } from './components/EventBus';

const bus = new EventBus();

function App() {

  return (
    <>
      <div>
        Welcome to Coding Challenge
      </div>
      <CounterDemo bus={bus} />
    </>
  )
}

export default App
