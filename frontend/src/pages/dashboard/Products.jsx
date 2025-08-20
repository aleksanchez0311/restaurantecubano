import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Products = () => {
  const { hasRole } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setProducts(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingProduct) {
        // Actualizar producto
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image_url: formData.image_url
          })
          .eq('id', editingProduct.id)
        
        if (error) throw error
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('products')
          .insert([{
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image_url: formData.image_url
          }])
        
        if (error) throw error
      }
      
      // Resetear formulario y refrescar lista
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        image_url: ''
      })
      setEditingProduct(null)
      setShowForm(false)
      fetchProducts()
    } catch (error) {
      console.error('Error al guardar producto:', error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchProducts()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: ''
    })
    setEditingProduct(null)
    setShowForm(false)
  }

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
          Gestión de Productos
        </h1>
        {(hasRole('administrador') || hasRole('vendedor')) && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        )}
      </div>
      
      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                  Precio ($)
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                  Categoría
                </label>
                <select
                  id="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="plato-principal">Plato Principal</option>
                  <option value="entrada">Entrada</option>
                  <option value="postre">Postre</option>
                  <option value="bebida">Bebida</option>
                  <option value="aperitivo">Aperitivo</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="image_url" className="block text-gray-700 font-medium mb-2">
                  URL de Imagen
                </label>
                <input
                  type="text"
                  id="image_url"
                  className="form-input"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  rows="3"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingProduct ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="card">
            <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{product.name}</h3>
                <span className="text-lg font-bold text-cuban-red">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 capitalize">
                {product.category}
              </p>
              <p className="text-gray-700 mb-4">
                {product.description}
              </p>
              <div className="flex justify-end space-x-2">
                {(hasRole('administrador') || hasRole('vendedor')) && (
                  <>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-secondary text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-danger text-sm"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-gray-600">
            {hasRole('administrador') || hasRole('vendedor') 
              ? 'Agrega productos usando el botón "Agregar Producto"'
              : 'No hay productos registrados en el sistema'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Products
