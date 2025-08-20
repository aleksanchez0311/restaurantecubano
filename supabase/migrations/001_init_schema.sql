-- Crear extensión para UUIDs
create extension if not exists "uuid-ossp";

-- Tabla de usuarios
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  display_name text,
  role text default 'cliente',
  created_at timestamp with time zone default now(),
  last_login timestamp with time zone
);

-- Tabla de productos
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de eventos
create table events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  location text,
  price decimal(10,2) not null,
  max_attendees integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de ofertas
create table offers (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  discount_type text not null, -- 'percentage' o 'fixed'
  discount_value decimal(10,2) not null,
  min_purchase decimal(10,2) default 0,
  min_events integer default 0,
  min_products integer default 0,
  expiration_date date not null,
  max_uses integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tabla de items en carrito
create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  product_id uuid references products(id),
  quantity integer not null default 1,
  created_at timestamp with time zone default now()
);

-- Tabla de cupones de usuarios
create table user_coupons (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  offer_id uuid references offers(id),
  coupon_code text unique not null,
  used boolean default false,
  used_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Tabla de pedidos
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  total_amount decimal(10,2) not null,
  status text default 'pending',
  shipping_address text,
  created_at timestamp with time zone default now()
);

-- Tabla de items en pedidos
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id),
  product_id uuid references products(id),
  quantity integer not null,
  price decimal(10,2) not null
);

-- Índices
create index idx_products_category on products(category);
create index idx_events_date on events(event_date);
create index idx_offers_expiration on offers(expiration_date);
create index idx_cart_user on cart_items(user_id);
create index idx_orders_user on orders(user_id);
create index idx_order_items_order on order_items(order_id);

-- Insertar el superadministrador por defecto
-- NOTA: Esta contraseña debe cambiarse inmediatamente después del primer despliegue
insert into users (email, display_name, role) 
values ('admin@restaurantecubano.com', 'Super Administrador', 'superadministrador');