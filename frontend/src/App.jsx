import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './App.css'

// Componentes principales
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Páginas
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import About from './pages/About'
import Dashboard from './pages/Dashboard'

// Páginas del dashboard
import DashboardHome from './pages/dashboard/DashboardHome'
import Cart from './pages/dashboard/Cart'
import Products from './pages/dashboard/Products'
import Events from './pages/dashboard/Events'
import Offers from './pages/dashboard/Offers'
import Users from './pages/dashboard/Users'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              
              {/* Rutas del dashboard */}
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                <Route path="cart" element={<Cart />} />
                <Route path="products" element={<Products />} />
                <Route path="events" element={<Events />} />
                <Route path="offers" element={<Offers />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App