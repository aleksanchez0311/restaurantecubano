import React from 'react'

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-cuban-blue mb-4">
          Acerca de Restaurante Cubano
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra historia, valores y compromiso con la auténtica cocina cubana.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold text-cuban-red mb-4">
            Nuestra Historia
          </h2>
          <p className="text-gray-600 mb-4">
            Fundado en 2010 por la familia González, Restaurante Cubano nació del amor por la cocina tradicional 
            de la isla y el deseo de compartir estos sabores únicos con el mundo. Nuestros abuelos emigraron de 
            Cuba en los años 60, trayendo consigo recetas familiares que han sido cuidadosamente preservadas 
            y transmitidas de generación en generación.
          </p>
          <p className="text-gray-600 mb-4">
            Desde nuestros humildes comienzos como un pequeño food truck en el corazón de la ciudad, hemos 
            crecido hasta convertirnos en un destino gastronómico reconocido, manteniendo siempre la esencia 
            familiar que nos define.
          </p>
          <p className="text-gray-600">
            Cada plato que servimos cuenta una historia, y cada bocado es un homenaje a nuestra herencia 
            cubana y al espíritu de comunidad que nos ha traído hasta aquí.
          </p>
        </div>
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center text-gray-500">
          Imagen histórica del restaurante
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-cuban-blue mb-8">
          Nuestros Valores
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-cuban-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Pasión</h3>
            <p className="text-gray-600">
              Cocinamos con amor y dedicación, transmitiendo la pasión por la gastronomía cubana en cada plato.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-cuban-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Calidad</h3>
            <p className="text-gray-600">
              Utilizamos solo los ingredientes más frescos y de la mejor calidad para garantizar una experiencia 
              gastronómica excepcional.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-cuban-red text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Comunidad</h3>
            <p className="text-gray-600">
              Creemos en la importancia de construir una comunidad fuerte y acogedora donde todos se sientan 
              bienvenidos y valorados.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-cuban-blue mb-4">
          Únete a Nuestra Familia
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Ya sea que visites nuestro restaurante o te unas a nuestro equipo, te invitamos a ser parte de 
          nuestra familia cubana. ¡Estamos encantados de conocerte!
        </p>
        <a href="/contact" className="btn btn-primary text-lg px-8 py-3">
          Contáctanos
        </a>
      </div>
    </div>
  )
}

export default About