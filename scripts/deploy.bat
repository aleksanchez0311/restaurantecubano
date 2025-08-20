@echo off
echo ==================================================
echo 🚀 Despliegue de Restaurante Cubano
echo ==================================================

echo.
echo 1/4 - Verificando requisitos...
echo ================================
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado
    echo Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js y npm verificados

echo.
echo 2/4 - Instalando dependencias del frontend...
echo ============================================
cd ../frontend
if exist "node_modules" (
    echo ✅ Dependencias ya instaladas
) else (
    echo Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias del frontend
        pause
        exit /b 1
    )
    echo ✅ Dependencias del frontend instaladas
)

echo.
echo 3/4 - Construyendo aplicación frontend...
echo ========================================
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error al construir el frontend
    pause
    exit /b 1
)
echo ✅ Frontend construido correctamente

echo.
echo 4/4 - Desplegando en Firebase...
echo ================================
cd ..
if not exist "firebase.json" (
    echo ❌ Archivo firebase.json no encontrado
    echo Por favor, asegúrate de que estás en el directorio correcto
    pause
    exit /b 1
)

firebase deploy
if %errorlevel% neq 0 (
    echo ❌ Error al desplegar en Firebase
    pause
    exit /b 1
)

echo.
echo ==================================================
echo ✅ Despliegue completado exitosamente!
echo ==================================================
echo.
echo 🌐 Tu aplicación está disponible en:
echo    https://tu-proyecto.firebaseapp.com
echo.
echo 📝 Recuerda:
echo    - Cambiar las credenciales del superadministrador
echo    - Configurar las variables de entorno
echo    - Verificar la base de datos en Supabase
echo.
pause