import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Offers = () => {
  const { hasRole, currentUser } = useAuth()
  const [offers, setOffers] = useState([])
  const [userCoupons, setUserCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_purchase: '',
    min_events: '',
    min_products: '',
    expiration_date: '',
    max_uses: ''
  })

  useEffect(() => {
    fetchOffers()
    if (hasRole('cliente')) {
      fetchUserCoupons()
    }
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setOffers(data)
    } catch (error) {
      console.error('Error al cargar ofertas:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('user_coupons')
        .select(`
          *,
          offer:offers(*)
        `)
        .eq('user_id', currentUser.uid)
        .eq('used', false)
      
      if (error) throw error
      setUserCoupons(data)
    } catch (error) {
      console.error('Error al cargar cupones:', error)
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
      if (editingOffer) {
        // Actualizar oferta
        const { error } = await supabase
          .from('offers')
          .update({
            title: formData.title,
            description: formData.description,
            discount_type: formData.discount_type,
            discount_value: parseFloat(formData.discount_value),
            min_purchase: parseFloat(formData.min_purchase) || 0,
            min_events: parseInt(formData.min_events) || 0,
            min_products: parseInt(formData.min_products) || 0,
            expiration_date: formData.expiration_date,
            max_uses: parseInt(formData.max_uses) || null
          })
          .eq('id', editingOffer.id)
        
        if (error) throw error
      } else {
        // Crear nueva oferta
        const { error } = await supabase
          .from('offers')
          .insert([{
            title: formData.title,
            description: formData.description,
            discount_type: formData.discount_type,
            discount_value: parseFloat(formData.discount_value),
            min_purchase: parseFloat(formData.min_purchase) || 0,
            min_events: parseInt(formData.min_events) || 0,
            min_products: parseInt(formData.min_products) || 0,
            expiration_date: formData.expiration_date,
            max_uses: parseInt(formData.max_uses) || null
          }])
        
        if (error) throw error
      }
      
      // Resetear formulario y refrescar lista
      setFormData({
        title: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase: '',
        min_events: '',
        min_products: '',
        expiration_date: '',
        max_uses: ''
      })
      setEditingOffer(null)
      setShowForm(false)
      fetchOffers()
    } catch (error) {
      console.error('Error al guardar oferta:', error)
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value.toString(),
      min_purchase: offer.min_purchase?.toString() || '',
      min_events: offer.min_events?.toString() || '',
      min_products: offer.min_products?.toString() || '',
      expiration_date: offer.expiration_date,
      max_uses: offer.max_uses?.toString() || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchOffers()
    } catch (error) {
      console.error('Error al eliminar oferta:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_purchase: '',
      min_events: '',
      min_products: '',
      expiration_date: '',
      max_uses: ''
    })
    setEditingOffer(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  const formatDiscount = (type, value) => {
    if (type === 'percentage') {
      return `${value}% de descuento`
    } else {
      return `$${value.toFixed(2)} de descuento`
    }
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
          {hasRole('cliente') ? 'Mis Ofertas y Cupones' : 'Gestión de Ofertas'}
        </h1>
        {hasRole('cliente') ? (
          <span className="bg-cuban-red text-white px-3 py-1 rounded-full">
            {userCoupons.length} cupones disponibles
          </span>
        ) : (
          (hasRole('administrador') || hasRole('promotor')) && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn btn-primary"
            >
              {showForm ? 'Cancelar' : 'Agregar Oferta'}
            </button>
          )
        )}
      </div>
      
      {hasRole('cliente') && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Tus Cupones Activos</h2>
          
          {userCoupons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userCoupons.map(coupon => (
                <div key={coupon.id} className="card border-2 border-cuban-gold">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{coupon.offer.title}</h3>
                      <span className="text-lg font-bold text-cuban-red">
                        {formatDiscount(coupon.offer.discount_type, coupon.offer.discount_value)}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">
                      {coupon.offer.description}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>Válido hasta: {formatDate(coupon.offer.expiration_date)}</p>
                      <p className="mt-1">Código: <span className="font-mono font-bold">{coupon.coupon_code}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center mb-8">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No tienes cupones disponibles
              </h3>
              <p className="text-gray-600">
                Participa más en nuestros eventos y compra productos para recibir ofertas personalizadas.
              </p>
            </div>
          )}
          
          <h2 className="text-2xl font-bold mb-4">Ofertas Disponibles</h2>
        </div>
      )}
      
      {(hasRole('administrador') || hasRole('promotor')) && showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingOffer ? 'Editar Oferta' : 'Agregar Nueva Oferta'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Título de la Oferta
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="discount_type" className="block text-gray-700 font-medium mb-2">
                  Tipo de Descuento
                </label>
                <select
                  id="discount_type"
                  className="form-input"
                  value={formData.discount_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="percentage">Porcentaje</option>
                  <option value="fixed">Monto Fijo</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="discount_value" className="block text-gray-700 font-medium mb-2">
                  Valor del Descuento
                </label>
                <input
                  type="number"
                  id="discount_value"
                  step="0.01"
                  className="form-input"
                  value={formData.discount_value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="expiration_date" className="block text-gray-700 font-medium mb-2">
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  id="expiration_date"
                  className="form-input"
                  value={formData.expiration_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="min_purchase" className="block text-gray-700 font-medium mb-2">
                  Compra Mínima ($)
                </label>
                <input
                  type="number"
                  id="min_purchase"
                  step="0.01"
                  className="form-input"
                  value={formData.min_purchase}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="min_events" className="block text-gray-700 font-medium mb-2">
                  Eventos Mínimos
                </label>
                <input
                  type="number"
                  id="min_events"
                  className="form-input"
                  value={formData.min_events}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="min_products" className="block text-gray-700 font-medium mb-2">
                  Productos Mínimos
                </label>
                <input
                  type="number"
                  id="min_products"
                  className="form-input"
                  value={formData.min_products}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="max_uses" className="block text-gray-700 font-medium mb-2">
                  Usos Máximos (opcional)
                </label>
                <input
                  type="number"
                  id="max_uses"
                  className="form-input"
                  value={formData.max_uses}
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
                {editingOffer ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="card">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{offer.title}</h3>
                <span className="text-lg font-bold text-cuban-red">
                  {formatDiscount(offer.discount_type, offer.discount_value)}
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                {offer.description}
              </p>
              <div className="text-sm text-gray-600 mb-4">
                <p>Válido hasta: {formatDate(offer.expiration_date)}</p>
                {offer.min_purchase > 0 && (
                  <p className="mt-1">Compra mínima: ${offer.min_purchase.toFixed(2)}</p>
                )}
                {offer.min_events > 0 && (
                  <p className="mt-1">Mínimo {offer.min_events} eventos</p>
                )}
                {offer.min_products > 0 && (
                  <p className="mt-1">Mínimo {offer.min_products} productos</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {offer.max_uses ? `Máx. ${offer.max_uses} usos` : 'Usos ilimitados'}
                </span>
                <div className="flex space-x-2">
                  {(hasRole('administrador') || hasRole('promotor')) && (
                    <>
                      <button
                        onClick={() => handleEdit(offer)}
                        className="btn btn-secondary text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="btn btn-danger text-sm"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {offers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No hay ofertas disponibles
          </h3>
          <p className="text-gray-600">
            {hasRole('administrador') || hasRole('promotor') 
              ? 'Agrega ofertas usando el botón "Agregar Oferta"'
              : 'No hay ofertas registradas en el sistema'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Offers