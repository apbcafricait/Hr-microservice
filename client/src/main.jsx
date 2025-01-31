import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import React from 'react'
import { Provider } from 'react-redux';
import store from './store.js'

const routes = createBrowserRouter(
  createRoutesFromElements(

    <>
     
      <Route path="/" element={<App />} >
        {/* insert all app routes here */}


      </Route>
      
    </>
    
  
  ))

const root = ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
        
          <RouterProvider router={routes} />
      
      </Provider>
  </React.StrictMode>
)
