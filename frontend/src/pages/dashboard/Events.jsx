import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Events = () => {
  const { hasRole } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    price: '',
    max_attendees: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
      
      if (error) throw error
      setEvents(data)
    } catch (error) {
      console.error('Error al cargar eventos:', error)
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
      if (editingEvent) {
        // Actualizar evento
        const { error } = await supabase
          .from('events')
          .update({
            title: formData.title,
            description: formData.description,
            event_date: formData.event_date,
            location: formData.location,
            price: parseFloat(formData.price),
            max_attendees: parseInt(formData.max_attendees)
          })
          .eq('id', editingEvent.id)
        
        if (error) throw error
      } else {
        // Crear nuevo evento
        const { error } = await supabase
          .from('events')
          .insert([{
            title: formData.title,
            description: formData.description,
            event_date: formData.event_date,
            location: formData.location,
            price: parseFloat(formData.price),
            max_attendees: parseInt(formData.max_attendees)
          }])
        
        if (error) throw error
      }
      
      // Resetear formulario y refrescar lista
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        price: '',
        max_attendees: ''
      })
      setEditingEvent(null)
      setShowForm(false)
      fetchEvents()
    } catch (error) {
      console.error('Error al guardar evento:', error)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location,
      price: event.price.toString(),
      max_attendees: event.max_attendees.toString()
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchEvents()
    } catch (error) {
      console.error('Error al eliminar evento:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      price: '',
      max_attendees: ''
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
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
          Gestión de Eventos
        </h1>
        {(hasRole('administrador') || hasRole('promotor')) && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancelar' : 'Agregar Evento'}
          </button>
        )}
      </div>
      
      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingEvent ? 'Editar Evento' : 'Agregar Nuevo Evento'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Título del Evento
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
                <label htmlFor="event_date" className="block text-gray-700 font-medium mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  id="event_date"
                  className="form-input"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="location"
                  className="form-input"
                  value={formData.location}
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
                <label htmlFor="max_attendees" className="block text-gray-700 font-medium mb-2">
                  Máximo de Asistentes
                </label>
                <input
                  type="number"
                  id="max_attendees"
                  className="form-input"
                  value={formData.max_attendees}
                  onChange={handleInputChange}
                  required
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
                {editingEvent ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="card">
            <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-48" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <span className="text-lg font-bold text-cuban-red">
                  ${event.price.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {formatDate(event.event_date)}
              </p>
              <p className="text-gray-700 mb-2">
                {event.location}
              </p>
              <p className="text-gray-700 mb-4">
                {event.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Máx. {event.max_attendees} asistentes
                </span>
                <div className="flex space-x-2">
                  {(hasRole('administrador') || hasRole('promotor')) && (
                    <>
                      <button
                        onClick={() => handleEdit(event)}
                        className="btn btn-secondary text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
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
      
      {events.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No hay eventos programados
          </h3>
          <p className="text-gray-600">
            {hasRole('administrador') || hasRole('promotor') 
              ? 'Agrega eventos usando el botón "Agregar Evento"'
              : 'No hay eventos registrados en el sistema'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Events