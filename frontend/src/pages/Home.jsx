import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-cuban-red mb-6">
          Bienvenidos al Restaurante Cubano
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Disfruta de la auténtica cocina cubana con sabores tradicionales y un toque moderno.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/menu" className="btn btn-primary text-lg px-8 py-3">
            Ver Menú
          </Link>
          <Link to="/events" className="btn btn-secondary text-lg px-8 py-3">
            Eventos Especiales
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <div className="card text-center p-6">
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="text-2xl font-bold mb-2">Menú Auténtico</h3>
          <p className="text-gray-600">
            Platos tradicionales preparados con ingredientes frescos y recetas familiares.
          </p>
        </div>
        
        <div className="card text-center p-6">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold mb-2">Eventos Especiales</h3>
          <p className="text-gray-600">
            Celebraciones, conciertos y eventos culturales en un ambiente único.
          </p>
        </div>
        
        <div className="card text-center p-6">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold mb-2">Ofertas Exclusivas</h3>
          <p className="text-gray-600">
            Descuentos especiales para nuestros clientes frecuentes y promociones mensuales.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 my-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-cuban-blue mb-4">
              Nuestra Historia
            </h2>
            <p className="text-gray-600 mb-4">
              Fundado en 2010 por la familia González, nuestro restaurante trae los sabores auténticos de Cuba 
              directamente a tu mesa. Cada plato cuenta una historia de tradición familiar y pasión por la cocina.
            </p>
            <p className="text-gray-600">
              Desde nuestros famosos ropa vieja hasta nuestros deliciosos pasteles, cada bocado es una experiencia 
              que transporta tus sentidos a las calles de La Habana.
            </p>
            <Link to="/about" className="btn btn-primary mt-6">
              Conoce Más
            </Link>
          </div>
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 md:h-80 flex items-center justify-center text-gray-500">
            Imagen del restaurante
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home