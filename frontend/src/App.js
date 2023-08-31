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

import Footer from './components/Footer/Footer';
import Blog from './pages/Blog/Blog';
import RegisterProduct from './pages/Products/RegisterProduct';
import SingleProduct from './pages/Products/SingleProduct';
import Traceability from './pages/Traceability/Traceability';
import Producer from './pages/Credencial/Credencial';
import SingleProducer from './pages/Traceability/SingleProducer';
import SingleSpread from './pages/Dashboard/Acesses/Tesoureiro/SingleSpread';
import UserSingle from './pages/UserSingle/UserSingle';
import Festival from './pages/Festival/Festival';
import QuemSomos from './pages/QuemSomos/QuemSomos';
import User from './pages/Dashboard/Acesses/Presidente/SingleUserCredenciado';
import StripeBalance from './pages/Dashboard/Acesses/Tesoureiro/StripeBalance';
import AllSpreadSheets from './pages/Dashboard/Acesses/Tesoureiro/AllSpreadSheets';
import SeloRelatory from './pages/Dashboard/Acesses/Presidente/SeloRelatory';

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
          <Route path={`/usuario/selo/:id`} element={<SeloRelatory /> } />
          <Route path={`/usuario-credenciado/:id`} element={<User /> } />
          <Route path={`/produtos`} element={<RegisterProduct />} />
          <Route path={`/produto/:id`} element={<SingleProduct />}/>
          <Route path={`/rastreabilidade`} element={<Traceability />}/>
          <Route path={`/credencial-produtor`} element={<Producer />} />
          <Route path='/produtor/:id' element={<SingleProducer />} />
          <Route path='/planilha/:id' element={<SingleSpread />} />
          <Route path='/planilhas' element={<AllSpreadSheets />} />
          <Route path='/festival-cachaca' element={<Festival />} />
          <Route path='/quem-somos' element={<QuemSomos />} />
          <Route path='/balancete' element={<StripeBalance />} />
          <Route path='*' element={<h1>Not Found 404</h1>} />
        </Routes> 
        <Footer />
      </Router>
      <ToastContainer />

    </>
  );
}

export default App;
