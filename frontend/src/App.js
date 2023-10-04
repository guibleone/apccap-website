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
import Blog from './pages/Blog/Blog';
import SingleProduct from './pages/Products/SingleProduct';
import Traceability from './pages/Traceability/Traceability';
import SingleProducer from './pages/Traceability/SingleProducer';
import SingleSpread from './pages/Dashboard/Acesses/Tesoureiro/SingleSpread';
import UserSingle from './pages/UserSingle/UserSingle';
import Festival from './pages/Festival/Festival';
import QuemSomos from './pages/QuemSomos/QuemSomos';
import User from './pages/Dashboard/Acesses/Presidente/SingleUserCredenciado';
import StripeBalance from './pages/Dashboard/Acesses/Tesoureiro/StripeBalance';
import AllSpreadSheets from './pages/Dashboard/Acesses/Tesoureiro/AllSpreadSheets';
import AnaliseCredencial from './pages/Dashboard/Acesses/Conselho/AnaliseCredencial';
import ProductAnalise from './pages/Products/ProductAnalise';
import UserProducts from './pages/Dashboard/Acesses/Conselho/Products/UserProducts';
import SingleUserProduct from './pages/Dashboard/Acesses/Conselho/Products/SingleUserProduct';
import Products from './pages/Products/Products';
import RegisterProduct from './pages/Products/RegisterProduct';
import Credencial from './pages/Credencial/CredencialProdutor';
import Reunion from './components/Reunions/Reunion';
import ConvocarReunion from './pages/Dashboard/Acesses/Presidente/ConvocarReunion';
import PDFReunion from './pages/Dashboard/Acesses/Presidente/PDFReunion';
import Produtores from './pages/Dashboard/Acesses/Presidente/Produtores';
import Balancos from './pages/Dashboard/Acesses/Tesoureiro/Balanços';
import SingleReunion from './components/Reunions/SingleReunion';
import DocumentosPublicos from './pages/Documentos/DocumentosPublicos';

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
          <Route path={`/usuario-credenciado/:id`} element={<User /> } />
          <Route path={`/produtos`} element={<Products />} />
          <Route path={`/produto-cadastro`} element={<RegisterProduct />} />
          <Route path={`/produto/:id`} element={<SingleProduct />}/>
          <Route path={`/rastreabilidade`} element={<Traceability />}/>
          <Route path={`/credencial`} element={<Credencial />} />
          <Route path='/produtor/:id' element={<SingleProducer />} />
          <Route path='/planilha/:id' element={<SingleSpread />} />
          <Route path='/planilhas' element={<AllSpreadSheets />} />
          <Route path='/festival-cachaca' element={<Festival />} />
          <Route path='/quem-somos' element={<QuemSomos />} />
          <Route path='/balancete' element={<StripeBalance />} />
          <Route path='/analise-credencial/:id' element={<AnaliseCredencial />} />
          <Route path='/acompanhar-analise/:id' element={<ProductAnalise />} />
          <Route path='/produtos-usuario/:id' element={<UserProducts />} />
          <Route path='/unico-produto-usuario/:id' element={<SingleUserProduct />} />
          <Route path='/reunioes' element={<Reunion />} />
          <Route path='/convocar-reuniao' element={<ConvocarReunion />} />
          <Route path='/pdf-reunion' element={<PDFReunion />} />
          <Route path='/produtores' element={<Produtores />} />
          <Route path='/balancos' element={<Balancos />} />
          <Route path='/reuniao/:id' element={<SingleReunion />} />
          <Route path='/documentos' element={<DocumentosPublicos />} />
          <Route path='*' element={<h1>Not Found 404</h1>} />
        </Routes> 
      </Router>
      <ToastContainer />

    </>
  );
}

export default App;
