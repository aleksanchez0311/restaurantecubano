import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet, Link } from 'react-router-dom'

const Dashboard = () => {
  const { currentUser, userRole, hasRole } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-bold">{currentUser.displayName || currentUser.email}</h3>
              <p className="text-gray-600 capitalize">{userRole}</p>
            </div>
            
            <nav className="space-y-2">
              <Link 
                to="/dashboard" 
                className="block py-2 px-4 rounded hover:bg-gray-100"
              >
                Dashboard
              </Link>
              
              {hasRole('cliente') && (
                <>
                  <Link 
                    to="/dashboard/cart" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Carrito de Compras
                  </Link>
                  <Link 
                    to="/dashboard/orders" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Mis Pedidos
                  </Link>
                </>
              )}
              
              {hasRole('vendedor') && (
                <>
                  <Link 
                    to="/dashboard/products" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Productos
                  </Link>
                </>
              )}
              
              {hasRole('promotor') && (
                <>
                  <Link 
                    to="/dashboard/events" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Eventos
                  </Link>
                  <Link 
                    to="/dashboard/offers" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Ofertas
                  </Link>
                </>
              )}
              
              {hasRole('administrador') && (
                <>
                  <Link 
                    to="/dashboard/users" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Usuarios
                  </Link>
                  <Link 
                    to="/dashboard/products" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Productos
                  </Link>
                  <Link 
                    to="/dashboard/events" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Eventos
                  </Link>
                  <Link 
                    to="/dashboard/offers" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Ofertas
                  </Link>
                </>
              )}
              
              {hasRole('superadministrador') && (
                <>
                  <Link 
                    to="/dashboard/users" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Usuarios
                  </Link>
                  <Link 
                    to="/dashboard/products" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Productos
                  </Link>
                  <Link 
                    to="/dashboard/events" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Eventos
                  </Link>
                  <Link 
                    to="/dashboard/offers" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Gestión de Ofertas
                  </Link>
                  <Link 
                    to="/dashboard/settings" 
                    className="block py-2 px-4 rounded hover:bg-gray-100"
                  >
                    Configuración del Sistema
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="card p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard