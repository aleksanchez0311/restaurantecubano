import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <nav className="bg-cuban-red text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              🍽️ Restaurante Cubano
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75">
                Inicio
              </Link>
              <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75">
                Acerca de
              </Link>
              <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75">
                Contacto
              </Link>
              
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-cuban-blue hover:bg-opacity-75">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button className="p-2 rounded-md text-white hover:bg-cuban-blue hover:bg-opacity-75">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar