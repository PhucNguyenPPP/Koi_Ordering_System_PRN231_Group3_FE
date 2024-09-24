import { useState } from 'react'
import { RouterProvider } from "react-router-dom";
import './App.css'
import ToastWrapper from './routes/ToastWrapper';
import { router } from './routes';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router} />
      <ToastWrapper />
    </>
  )
}

export default App
