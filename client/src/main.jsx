import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store.js';
import { ToastContainer } from 'react-toastify';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routes} />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);