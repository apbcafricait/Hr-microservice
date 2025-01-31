import './App.css'
import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import Header from './components/Header';
import Footer from './components/Footer';
function App() {

  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer />
      <Footer />
     </>
  )
}

export default App
