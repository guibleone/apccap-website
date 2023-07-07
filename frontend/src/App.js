import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Informations from './pages/MyPerfil/Informations';
import UserSingle from './pages/UserSIngle/UserSingle';
import Footer from './components/Footer/Footer';
import Blog from './pages/Blog/Blog';
import RegisterProduct from './pages/Products/RegisterProduct';
import SingleProduct from './pages/Products/SingleProduct';
import Traceability from './pages/Traceability/Traceability';
import Producer from './pages/Credencial/Producer';
import SingleProducer from './pages/Traceability/SingleProducer';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entrar" element={<Login />} />
          <Route path="/registrar" element={<Register />} />
          <Route path='/meu-perfil' element={<Informations />} />
          <Route path='/blog' element={<Blog />} />
          <Route path={`/usuario/:id`} element={<UserSingle /> } />
          <Route path={`/produtos`} element={<RegisterProduct />} />
          <Route path={`/produto/:id`} element={<SingleProduct />}/>
          <Route path={`/rastreabilidade`} element={<Traceability />}/>
          <Route path={`/credencial-produtor`} element={<Producer />} />
          <Route path='/produtor/:id' element={<SingleProducer />} />
        </Routes> 
        <Footer />
      </Router>
      <ToastContainer />

    </>
  );
}

export default App;
