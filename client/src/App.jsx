import './App.css'
import { Outlet } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import Header from './components/Header';
// import Footer from './components/Footer';
function App() {

  return (
    <>
      {/* <Header />  */}
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} />
       {/* <Footer />  */}
     </>
  )
}

export default App
