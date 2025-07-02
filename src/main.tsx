import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router'
import './style.css';
import { AuthProvider } from './state';
import HomePage from './pages/homepage/HomePage';
import Login from './pages/access/Login';
import Register from './pages/access/Register';
import SingleClient from './pages/homepage/personal/singleClient/SingleClient';
import Esercizi from './pages/homepage/personal/esercizi/Esercizi';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='/fitness' element={<Login />} />
        <Route path='/fitness/register/' element={<Register />} />
        <Route path='/fitness/home/' element={<HomePage />} />
        <Route path='/fitness/cliente/:id' element={<SingleClient />} />
        <Route path='/fitness/esercizi' element={<Esercizi />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)