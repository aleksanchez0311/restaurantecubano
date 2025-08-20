# Documentación Técnica - Restaurante Cubano

## 📋 Descripción del Proyecto

Aplicación web fullstack para la gestión de un restaurante cubano con funcionalidades de e-commerce, gestión de eventos, sistema de ofertas y roles de usuario.

## 🏗️ Arquitectura del Sistema

### Tecnologías Utilizadas

**Frontend:**
- React 18 con Vite
- Tailwind CSS para estilos
- React Router para navegación
- Firebase Authentication
- Supabase Client

**Backend:**
- Firebase Functions
- Firebase Authentication
- Supabase (Base de datos PostgreSQL)

**Base de Datos:**
- Supabase (PostgreSQL)
- Firebase Firestore (para autenticación y metadata)

### Estructura del Proyecto

```
restaurantecubano/
├── backend/                 # Funciones de Firebase
│   ├── functions/
│   │   ├── index.js         # Punto de entrada
│   │   └── package.json
│   └── firebase.json
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Context API para estado global
│   │   ├── hooks/           # Hooks personalizados
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios y configuración
│   │   └── App.jsx          # Componente principal
│   ├── package.json
│   └── vite.config.js
├── docs/                    # Documentación
├── scripts/                 # Scripts de utilidad
└── README.md               # Documentación principal
```

## 🗄️ Base de Datos

### Tablas en Supabase

1. **users** - Información de usuarios
2. **products** - Productos del menú
3. **events** - Eventos especiales
4. **offers** - Ofertas y promociones
5. **cart_items** - Items en carrito de compras
6. **user_coupons** - Cupones de usuarios
7. **orders** - Pedidos realizados
8. **order_items** - Items en pedidos

### Esquema de la Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location TEXT,
  price DECIMAL(10,2) NOT NULL,
  max_attendees INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de ofertas
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL, -- 'percentage' o 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase DECIMAL(10,2) DEFAULT 0,
  min_events INTEGER DEFAULT 0,
  min_products INTEGER DEFAULT 0,
  expiration_date DATE NOT NULL,
  max_uses INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de items en carrito
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de cupones de usuarios
CREATE TABLE user_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  offer_id UUID REFERENCES offers(id),
  coupon_code TEXT UNIQUE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de items en pedidos
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
```

## 🔐 Sistema de Autenticación y Roles

### Roles de Usuario

1. **cliente** - Usuario registrado, puede comprar productos, participar en eventos, ver ofertas, recibir y usar cupones y eliminar su propia cuenta.
2. **vendedor** - Puede gestionar productos
3. **promotor** - Puede gestionar eventos y ofertas
4. **administrador** - Puede gestionar usuarios, productos, eventos y ofertas; Puede eliminar cuentas de usuarios, menos las administrativas y cambiar direciciones de correos a cuentas no administrativas.
5. **superadministrador** - Tiene todos los permisos, unico usuario que puede cambiar las  direcciones de correo y puede delegar el rol de superadministrador

### Permisos por Rol

| Funcionalidad | cliente | vendedor | promotor | administrador | superadministrador |
|---------------|---------|----------|----------|---------------|-------------------|
| Ver productos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Comprar productos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gestionar carrito | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver eventos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Participar en eventos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver ofertas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recibir y usar cupones | ✅ | ✅ | ✅ | ✅ | ✅ |
| Eliminar su propia cuenta | ✅ | ✅ | ✅ | ✅ | ✅ |
| Gestionar productos | ❌ | ✅ | ❌ | ✅ | ✅ |
| Gestionar eventos | ❌ | ❌ | ✅ | ✅ | ✅ |
| Gestionar ofertas | ❌ | ❌ | ✅ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ | ✅ |
| Cambiar roles | ❌ | ❌ | ❌ | ✅ | ✅ |
| Eliminar cuentas de usuarios no administrativas | ❌ | ❌ | ❌ | ✅ | ✅ |
| Cambiar direcciones de correo a cuentas no administrativas | ❌ | ❌ | ❌ | ❌ | ✅ |
| Delegar superadministrador | ❌ | ❌ | ❌ | ❌ | ✅ |

## 🚀 Despliegue

### Requisitos Previos

1. Node.js 16+
2. npm 8+
3. Firebase CLI
4. Cuenta de Firebase
5. Cuenta de Supabase

### Pasos de Despliegue

1. **Configurar variables de entorno:**
   ```bash
   # En frontend/.env
   REACT_APP_FIREBASE_API_KEY=tu_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
   REACT_APP_SUPABASE_URL=tu_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=tu_supabase_key
   REACT_APP_ROOT_EMAIL="tu_username"
   REACT_APP_ROOT_PASSWORD="tu_password"
   ```

2. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install firebase
   npm install -g firebase-tools
   npm install
   ```

3. **Construir la aplicación:**
   ```bash
   npm run build
   ```

4. **Desplegar en Firebase:**
   ```bash
   firebase login
   firebase init
   firebase deploy
   ```

### Script de Despliegue Automatizado

El proyecto incluye un script `scripts/deploy.bat` que automatiza todo el proceso de despliegue.

## 🛠️ Desarrollo Local

### Iniciar el Frontend

```bash
cd frontend
npm install firebase
npm install -g firebase-tools
npm install
npm run dev
```

### Iniciar el Backend (Firebase Functions)

```bash
cd backend
npm install firebase
npm install -g firebase-tools
npm install
firebase emulators:start
```

## 📱 API y Servicios

### Servicios de Supabase

Todos los servicios están implementados en `frontend/src/services/supabase.js`:

- **Productos:** `getProducts()`, `createProduct()`, `updateProduct()`, `deleteProduct()`
- **Eventos:** `getEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- **Ofertas:** `getOffers()`, `createOffer()`, `updateOffer()`, `deleteOffer()`
- **Carrito:** `getCartItems()`, `addCartItem()`, `updateCartItem()`, `removeCartItem()`
- **Usuarios:** `getUsers()`, `updateUser()`, `deleteUser()`

### Servicios de Firebase

Implementados en `frontend/src/services/firebase.js`:

- **Autenticación:** `auth`
- **Base de datos:** `db`

## 🎨 Componentes Principales

### Componentes Reutilizables

1. **Navbar** - Navegación principal
2. **Footer** - Pie de página
3. **AuthContext** - Contexto de autenticación

### Páginas Principales

1. **Home** - Página de inicio
2. **Login/Register** - Autenticación
3. **Contact** - Formulario de contacto
4. **About** - Información del restaurante
5. **Dashboard** - Panel de control con subpáginas:
   - Dashboard Home
   - Cart (Carrito)
   - Products (Productos)
   - Events (Eventos)
   - Offers (Ofertas)
   - Users (Usuarios)

## 🧪 Pruebas

### Pruebas de Componentes

Las pruebas se pueden ejecutar con:

```bash
cd frontend
npm test
```

### Pruebas de Integración

Para pruebas de integración con Firebase y Supabase, se recomienda usar los emuladores de Firebase.

## 📈 Monitoreo y Logs

### Logging en Frontend

```javascript
// Ejemplo de logging
console.log('Usuario inició sesión:', user.email);
console.error('Error al cargar productos:', error);
```

### Monitoreo de Errores

Los errores se registran en la consola del navegador y pueden ser monitoreados con herramientas como Sentry.

## 🔧 Mantenimiento

### Actualización de Dependencias

```bash
cd frontend
npm outdated
npm update
```

### Backup de Base de Datos

Supabase proporciona backups automáticos. Para backups manuales:

```bash
# Usar la interfaz de Supabase o pg_dump
pg_dump -h db.supabase.co -p 5432 -U usuario -d base_datos > backup.sql
```

## 🆘 Solución de Problemas

### Problemas Comunes

1. **Error de CORS:** Verificar configuración de dominios en Firebase y Supabase
2. **Error de autenticación:** Verificar variables de entorno
3. **Error de conexión a base de datos:** Verificar credenciales de Supabase

### Soporte

Para soporte técnico, contactar a: dev@restaurantecubano.com