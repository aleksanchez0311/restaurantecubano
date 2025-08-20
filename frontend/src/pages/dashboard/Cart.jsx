import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'

const Cart = () => {
  const { currentUser } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (currentUser) {
      fetchCartItems()
    }
  }, [currentUser])

  const fetchCartItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', currentUser.uid)
      
      if (error) throw error
      
      setCartItems(data)
      
      // Calcular total
      const totalPrice = data.reduce((sum, item) => {
        return sum + (item.product.price * item.quantity)
      }, 0)
      
      setTotal(totalPrice)
    } catch (error) {
      console.error('Error al cargar el carrito:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)
      
      if (error) throw error
      
      // Actualizar estado local
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      )
      
      // Recalcular total
      const newTotal = cartItems.reduce((sum, item) => {
        if (item.id === itemId) {
          return sum + (item.product.price * newQuantity)
        }
        return sum + (item.product.price * item.quantity)
      }, 0)
      
      setTotal(newTotal)
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
      
      if (error) throw error
      
      // Actualizar estado local
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
      
      // Recalcular total
      const itemToRemove = cartItems.find(item => item.id === itemId)
      if (itemToRemove) {
        setTotal(prevTotal => prevTotal - (itemToRemove.product.price * itemToRemove.quantity))
      }
    } catch (error) {
      console.error('Error al eliminar item:', error)
    }
  }

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUser.uid)
      
      if (error) throw error
      
      setCartItems([])
      setTotal(0)
    } catch (error) {
      console.error('Error al vaciar carrito:', error)
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
          Carrito de Compras
        </h1>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart}
            className="btn btn-danger"
          >
            Vaciar Carrito
          </button>
        )}
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            Tu carrito está vacío
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega productos para comenzar tu pedido
          </p>
          <a href="/menu" className="btn btn-primary">
            Ver Menú
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="card p-4 flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="ml-4 font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 font-bold">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
              
              <button className="btn btn-primary w-full">
                Proceder al Pago
              </button>
              
              <div className="mt-4 text-center">
                <a href="/menu" className="text-cuban-red hover:underline">
                  Seguir comprando
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart