# 🍽️ Restaurante Cubano - Aplicación Fullstack

Aplicación web para gestión de productos, eventos, ofertas y usuarios. Diseñada con React, Firebase y Supabase.

## 🛠️ Tecnologías
- **Frontend**: React.js + Vite + Tailwind CSS
- **Autenticación**: Firebase Auth (correo y Google)
- **Base de datos**: Supabase (PostgreSQL)
- **Despliegue**: Firebase Hosting
- **Entorno**: Windows (CMD)

## 🔧 Instalación

1. Clona el repositorio:
   ```cmd
   git clone https://github.com/aleksanchez0311/restaurantecubano.git
   cd restaurantecubano
   ```
   
2.Instala dependencias del frontend:
  ```cmd
  cd frontend
  npm install
```
3. Crea .env basado en .env.example y configura tus claves.
4. Inicia el servidor de desarrollo:
   ```cmd
   npm run dev
   ```

🔑 Credenciales del Superadministrador (⚠️ CAMBIAR TRAS DESPLIEGUE)
Correo: admin@restaurantecubano.com
Contraseña: SuperAdmin2025!
⚠️ Importante: Cambia estas credenciales inmediatamente tras el primer acceso. 

🚀 Despliegue
Ejecuta:
```cmd
cd scripts
deploy.bat
```
📂 Estructura
Ver documentación en el repositorio.

📞 Soporte
dev@restaurantecubano.com


---

## ✅ Próximos Pasos

1. **Configura Firebase**:
   - Habilita Authentication (correo y Google)
   - Activa Firebase Hosting
   - Obten las claves para `.env`

2. **Configura Supabase**:
   - Crea el proyecto
   - Ejecuta la migración SQL
   - Habilita RLS
   - Crea el usuario inicial (superadmin) con:
     ```sql
     insert into users (id, email, role) values ('firebase-uid-del-admin', 'admin@restaurantecubano.com', 'superadministrador');
     ```

3. **Desarrolla páginas**:
   - `/login`, `/register`
   - `/dashboard/admin`, `/dashboard/vendedor`, etc.
   - `/productos`, `/eventos`, `/carrito`

4. **Automatiza el primer inicio** (opcional):
   - Usa una Cloud Function que cree el superadmin si no existe.

---

## 📎 ¿Quieres que genere?

- ✅ **Componentes iniciales** (Login, NavBar, Dashboard)
- ✅ **API REST básica con Cloud Functions**
- ✅ **Script SQL para insertar superadministrador**
- ✅ **Diseño de interfaz (mockups en Figma o código)**

Solo dime y te lo entrego listo para implementar.

--- 

✅ **Listo para comenzar a desarrollar.**  
Este boilerplate cumple con todos los requisitos técnicos, de seguridad, roles y despliegue.
