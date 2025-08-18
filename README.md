# Restaurant App - Boilerplate Configurable

Aplicación web completa para gestión de productos, eventos, ofertas y ventas de cualquier restaurante.

## 🧩 Características

- ✅ Autenticación con Firebase (Email/Password y Google)
- ✅ Roles de usuario: Superadmin, Admin, Promoter, Seller, Cliente
- ✅ Gestión completa de usuarios
- ✅ Carrito de compras
- ✅ Gestión de eventos y ofertas
- ✅ Notificaciones por correo
- ✅ Diseño responsivo
- ✅ Configurable para cualquier restaurante
- ✅ Arquitectura Fullstack

## ⚙️ Configuración del Restaurante

La aplicación se configura completamente desde la configuración del restaurante:

### Configuración General
RESTAURANT_NAME=Nombre del Restaurante
RESTAURANT_DESCRIPTION=Descripción del restaurante
RESTAURANT_ADDRESS=Dirección completa
RESTAURANT_PHONE=Teléfono de contacto
RESTAURANT_EMAIL=Correo electrónico
RESTAURANT_LOGO_URL=URL del logo
RESTAURANT_COLOR_PRIMARY=#000000
RESTAURANT_COLOR_SECONDARY=#ffffff

### Horarios de Atención
OPENING_HOURS=09:00-22:00
DELIVERY_HOURS=10:00-21:00


### Configuración de Pagos
PAYMENT_METHODS=efectivo,enzona,transfermovil
DELIVERY_COST=location
MIN_ORDER_AMOUNT=0.01

### Configuración de Ofertas
OFFER_EXPIRATION_DAYS=7
MAX_OFFERS_PER_USER=3


## 🔐 Superadmin
El superadministrador se crea automáticamente en el primer inicio.  
**Credenciales por defecto (deben cambiarse):**
EMAIL: admin@restaurante.com
PASSWORD: 123456789
Reemplaza estas credenciales en `.env` antes de desplegar.

## 🚀 Despliegue
Ver `scripts/deploy.sh`.

## 🛠️ Tecnologías
- Frontend: React + TailwindCSS
- Backend: Node.js + Express
- Base de datos: Supabase
- Autenticación: Firebase Auth
- Hosting: Firebase Hosting

## 📦 Requisitos
- Node.js >= 16.x
- Firebase CLI
- Supabase account
- Firebase project configurado

## 🚀 Instalación
### 1. Clonar el repositorio

```bash
git clone <restaurantecubano>
cd restaurantecubano
