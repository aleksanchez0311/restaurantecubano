import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Users = () => {
  const { hasRole, userRole } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUsers(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    // Verificar permisos
    if (!hasRole('administrador') && userRole !== 'superadministrador') {
      alert('No tienes permiso para cambiar roles')
      return
    }
    
    // El superadministrador no puede cambiar su propio rol
    if (userRole === 'superadministrador' && userId === useAuth().currentUser.uid) {
      alert('No puedes cambiar tu propio rol de superadministrador')
      return
    }
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
      
      if (error) throw error
      
      // Actualizar estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, role: newRole } 
            : user
        )
      )
    } catch (error) {
      console.error('Error al cambiar rol:', error)
      alert('Error al cambiar rol: ' + error.message)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cuban-red"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cuban-blue">
          Gestión de Usuarios
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último acceso
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName || 'Sin nombre'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'superadministrador' ? 'bg-red-100 text-red-800' :
                    user.role === 'administrador' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'promotor' ? 'bg-green-100 text-green-800' :
                    user.role === 'vendedor' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString('es-ES') : 'Nunca'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {(hasRole('administrador') || userRole === 'superadministrador') && user.role !== 'superadministrador' && (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="form-input text-sm"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="vendedor">Vendedor</option>
                      <option value="promotor">Promotor</option>
                      <option value="administrador">Administrador</option>
                      {userRole === 'superadministrador' && (
                        <option value="superadministrador">Superadministrador</option>
                      )}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">👤</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No se encontraron usuarios
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Intenta con otros términos de búsqueda' 
              : 'No hay usuarios registrados en el sistema'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Users