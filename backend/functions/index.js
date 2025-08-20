const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Inicializar Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Helper para verificar roles
const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.get('Authorization')?.split('Bearer ')[1];
      if (!userId) {
        return res.status(401).send('Unauthorized');
      }

      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      if (!userDoc.exists) {
        return res.status(401).send('Unauthorized');
      }

      const userRole = userDoc.data().role || 'cliente';
      const roles = ['cliente', 'vendedor', 'promotor', 'administrador', 'superadministrador'];
      const userRoleIndex = roles.indexOf(userRole);
      const requiredRoleIndex = roles.indexOf(requiredRole);

      if (userRoleIndex < requiredRoleIndex) {
        return res.status(403).send('Forbidden');
      }

      req.user = userDoc.data();
      next();
    } catch (error) {
      console.error('Error checking role:', error);
      res.status(500).send('Internal Server Error');
    }
  };
};

// Función para crear el superadministrador inicial
exports.createSuperAdmin = functions.https.onRequest(async (req, res) => {
  try {
    // Verificar si ya existe un superadministrador
    const superAdminSnapshot = await admin.firestore().collection('users')
      .where('role', '==', 'superadministrador')
      .limit(1)
      .get();

    if (!superAdminSnapshot.empty) {
      return res.status(400).send('Superadministrador ya existe');
    }

    // Crear el superadministrador con credenciales por defecto
    // En producción, estas credenciales deben cambiarse inmediatamente
   
    
    // Crear usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: defaultEmail,
      password: defaultPassword,
      displayName: 'Super Administrador'
    });

    // Crear documento en Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: defaultEmail,
      displayName: 'Super Administrador',
      role: 'superadministrador',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: null
    });

    res.status(201).send({
      message: 'Superadministrador creado exitosamente',
      uid: userRecord.uid,
      email: defaultEmail
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
    res.status(500).send('Error creating super admin: ' + error.message);
  }
});

// API para gestión de productos
app.get('/products', checkRole('cliente'), async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('products')
      .orderBy('createdAt', 'desc')
      .get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

app.post('/products', checkRole('vendedor'), async (req, res) => {
  try {
    const product = req.body;
    product.createdAt = admin.firestore.FieldValue.serverTimestamp();
    product.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const docRef = await admin.firestore().collection('products').add(product);
    
    res.status(201).send({ id: docRef.id, ...product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
});

app.put('/products/:id', checkRole('vendedor'), async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await admin.firestore().collection('products').doc(productId).update(updates);
    
    res.status(200).send({ id: productId, ...updates });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

app.delete('/products/:id', checkRole('administrador'), async (req, res) => {
  try {
    const productId = req.params.id;
    await admin.firestore().collection('products').doc(productId).delete();
    
    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

// API para gestión de eventos
app.get('/events', checkRole('cliente'), async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('events')
      .orderBy('eventDate', 'asc')
      .get();
    
    const events = [];
    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).send(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});

app.post('/events', checkRole('promotor'), async (req, res) => {
  try {
    const event = req.body;
    event.createdAt = admin.firestore.FieldValue.serverTimestamp();
    event.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const docRef = await admin.firestore().collection('events').add(event);
    
    res.status(201).send({ id: docRef.id, ...event });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send('Error creating event');
  }
});

app.put('/events/:id', checkRole('promotor'), async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await admin.firestore().collection('events').doc(eventId).update(updates);
    
    res.status(200).send({ id: eventId, ...updates });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Error updating event');
  }
});

app.delete('/events/:id', checkRole('administrador'), async (req, res) => {
  try {
    const eventId = req.params.id;
    await admin.firestore().collection('events').doc(eventId).delete();
    
    res.status(200).send({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).send('Error deleting event');
  }
});

// API para gestión de ofertas
app.get('/offers', checkRole('cliente'), async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('offers')
      .orderBy('createdAt', 'desc')
      .get();
    
    const offers = [];
    snapshot.forEach(doc => {
      offers.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).send(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).send('Error fetching offers');
  }
});

app.post('/offers', checkRole('promotor'), async (req, res) => {
  try {
    const offer = req.body;
    offer.createdAt = admin.firestore.FieldValue.serverTimestamp();
    offer.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    const docRef = await admin.firestore().collection('offers').add(offer);
    
    res.status(201).send({ id: docRef.id, ...offer });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).send('Error creating offer');
  }
});

app.put('/offers/:id', checkRole('promotor'), async (req, res) => {
  try {
    const offerId = req.params.id;
    const updates = req.body;
    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await admin.firestore().collection('offers').doc(offerId).update(updates);
    
    res.status(200).send({ id: offerId, ...updates });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).send('Error updating offer');
  }
});

app.delete('/offers/:id', checkRole('administrador'), async (req, res) => {
  try {
    const offerId = req.params.id;
    await admin.firestore().collection('offers').doc(offerId).delete();
    
    res.status(200).send({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).send('Error deleting offer');
  }
});

// API para gestión de usuarios (solo administradores)
app.get('/users', checkRole('administrador'), async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

app.put('/users/:id/role', checkRole('administrador'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    // Verificar que el rol sea válido
    const validRoles = ['cliente', 'vendedor', 'promotor', 'administrador', 'superadministrador'];
    if (!validRoles.includes(role)) {
      return res.status(400).send('Invalid role');
    }
    
    await admin.firestore().collection('users').doc(userId).update({ role });
    
    res.status(200).send({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).send('Error updating user role');
  }
});

// Exportar la API como función de Firebase
exports.api = functions.https.onRequest(app);

// Función para generar cupones automáticamente cuando se crean ofertas
exports.generateCoupons = functions.firestore
  .document('offers/{offerId}')
  .onCreate(async (snap, context) => {
    try {
      const offer = snap.data();
      console.log('New offer created:', offer.title);
      
      // Aquí se podría implementar la lógica para generar cupones
      // basada en criterios de elegibilidad de usuarios
      
      return null;
    } catch (error) {
      console.error('Error in generateCoupons:', error);
      return null;
    }
  });

// Función para actualizar última fecha de login
exports.updateLastLogin = functions.auth.user().onCreate(async (user) => {
  try {
    await admin.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email,
      role: 'cliente', // Por defecto todos son clientes
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('User login updated:', user.email);
    return null;
  } catch (error) {
    console.error('Error updating user login:', error);
    return null;
  }
});