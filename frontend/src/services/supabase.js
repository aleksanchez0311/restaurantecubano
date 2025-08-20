import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Products functions
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// Events functions
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  
  if (error) throw error
  return data
}

export const getEventById = async (id) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createEvent = async (event) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateEvent = async (id, updates) => {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteEvent = async (id) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// Offers functions
export const getOffers = async () => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const getOfferById = async (id) => {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createOffer = async (offer) => {
  const { data, error } = await supabase
    .from('offers')
    .insert([offer])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateOffer = async (id, updates) => {
  const { data, error } = await supabase
    .from('offers')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const deleteOffer = async (id) => {
  const { error } = await supabase
    .from('offers')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

// Cart functions
export const getCartItems = async (userId) => {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export const addCartItem = async (cartItem) => {
  const { data, error } = await supabase
    .from('cart_items')
    .insert([cartItem])
    .select()
  
  if (error) throw error
  return data[0]
}

export const updateCartItem = async (id, updates) => {
  const { data, error } = await supabase
    .from('cart_items')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export const removeCartItem = async (id) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return true
}

export const clearCart = async (userId) => {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
  
  if (error) throw error
  return true
}

// User functions
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) throw error
  return data
}

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const updateUser = async (id, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export default supabase