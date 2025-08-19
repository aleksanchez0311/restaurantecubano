import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-cuban-blue text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🍽️ Restaurante Cubano</h3>
            <p className="text-gray-300">
              Disfruta de la auténtica cocina cubana en cada bocado.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Inicio</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">Acerca de</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contacto</Link></li>
              <li><Link to="/menu" className="text-gray-300 hover:text-white">Menú</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <address className="not-italic text-gray-300">
              <p>123 Calle Principal</p>
              <p>La Habana, Cuba</p>
              <p className="mt-2">Tel: (555) 123-4567</p>
              <p>Email: info@restaurantecubano.com</p>
            </address>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
