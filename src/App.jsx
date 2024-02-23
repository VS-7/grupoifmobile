import './App.css';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
//context 
import { AuthProvider  } from '../context/AuthContext';

// hooks 
import { useAuthentication } from './hooks/useAuthentication';
import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
// pages

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/Search/Search';
import Post from './pages/Post/Post';
import EditPost from './pages/EditPost/EditPost';

function App() {

  const [theme, setTheme] = useState('dark'); // Tema padrão definido como 'dark'

   // Função para alternar entre os temas
   const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };

   // Aplica a classe do tema ao corpo do documento
   useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const [user, setUser] = useState(undefined)
  const {auth} = useAuthentication()

  const loadingUser = user === undefined

  useEffect (() => {
    
    onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

  }, [auth]);

  if(loadingUser)
  return (
    <div className="loading-container">

      <p className="loading-text">Carregando...</p>
    </div>
  );

  return (
    <div className='App'>
     <button onClick={toggleTheme} style={{ position: 'fixed', zIndex: 1000, top: '15px', right: '50px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
        {theme === 'dark' ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>
      <AuthProvider value={ { user }}>
        <BrowserRouter>
        <div className='navbarContainer'>
          <Navbar />
        </div>
        
          <div className='container'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path='/posts/:id' element={<Post />} />
              <Route 
                path='/login' 
                element={!user ? <Login /> : <Navigate to="/" />} />
              <Route 
                path="/register" 
                element={!user ? <Register /> : <Navigate to="/" />} />
              <Route 
                path='/posts/edit/:id' 
                element={user ? <EditPost /> : <Navigate to='/login' />} 
              />
              <Route 
                path='/posts/create' 
                element={user ? <CreatePost /> : <Navigate to='/login' />} 
              
              />
              <Route 
                path='/dashboard'
                element={user ? <Dashboard /> : <Navigate to='/login' />} />
            </Routes>
          </div>
          
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
