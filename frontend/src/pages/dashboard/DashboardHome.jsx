import React from 'react'
import { useAuth } from '../../context/AuthContext'

const DashboardHome = () => {
  const { currentUser, userRole } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-cuban-blue mb-6">
        Bienvenido al Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-2">👤</div>
          <h3 className="text-xl font-bold mb-2">Perfil</h3>
          <p className="text-gray-600">
            {currentUser.displayName || currentUser.email}
          </p>
          <p className="text-gray-600 capitalize">
            Rol: {userRole}
          </p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-4xl mb-2">📅</div>
          <h3 className="text-xl font-bold mb-2">Eventos</h3>
          <p className="text-gray-600">
            Próximos eventos
          </p>
        </div>
        
        <div className="card p-6 text-center">
          <div className="text-4xl mb-2">🎁</div>
          <h3 className="text-xl font-bold mb-2">Ofertas</h3>
          <p className="text-gray-600">
            Ofertas disponibles
          </p>
        </div>
      </div>
      
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Resumen Rápido</h2>
        
        {userRole === 'cliente' && (
          <div>
            <p className="text-gray-600 mb-4">
              Bienvenido a tu panel de control. Aquí puedes ver tu historial de pedidos, 
              gestionar tu carrito de compras y ver las ofertas disponibles para ti.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Ver y editar tu perfil</li>
              <li>Gestionar tu carrito de compras</li>
              <li>Ver historial de pedidos</li>
              <li>Acceder a ofertas personalizadas</li>
            </ul>
          </div>
        )}
        
        {userRole === 'vendedor' && (
          <div>
            <p className="text-gray-600 mb-4">
              Como vendedor, puedes gestionar los productos del restaurante y ver 
              estadísticas de ventas.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Gestionar productos (crear, editar, eliminar)</li>
              <li>Ver estadísticas de ventas</li>
              <li>Ver pedidos pendientes</li>
            </ul>
          </div>
        )}
        
        {userRole === 'promotor' && (
          <div>
            <p className="text-gray-600 mb-4">
              Como promotor, puedes crear y gestionar eventos y ofertas especiales.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Crear y gestionar eventos</li>
              <li>Crear y gestionar ofertas</li>
              <li>Ver estadísticas de participación</li>
            </ul>
          </div>
        )}
        
        {(userRole === 'administrador' || userRole === 'superadministrador') && (
          <div>
            <p className="text-gray-600 mb-4">
              Como administrador, tienes acceso completo al sistema para gestionar 
              usuarios, productos, eventos y ofertas.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Gestionar todos los usuarios</li>
              <li>Gestionar productos, eventos y ofertas</li>
              <li>Ver estadísticas completas</li>
              <li>Configurar el sistema</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardHome