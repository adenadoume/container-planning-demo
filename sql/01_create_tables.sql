-- Container Planning Demo - Database Schema
-- Run this first to create all tables

-- Containers table
CREATE TABLE IF NOT EXISTS containers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id BIGSERIAL PRIMARY KEY,
  reference_code TEXT UNIQUE NOT NULL,
  supplier TEXT,
  product TEXT,
  cbm DECIMAL(10,2),
  product_cost DECIMAL(10,2),
  freight_cost DECIMAL(10,2),
  payment DECIMAL(10,2),
  payment_date DATE,
  status TEXT DEFAULT 'PENDING',
  production_days INTEGER,
  production_ready DATE,
  remarks TEXT,
  contact_person TEXT,
  email TEXT,
  contact_number TEXT,
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Container Items table
CREATE TABLE IF NOT EXISTS container_items (
  id BIGSERIAL PRIMARY KEY,
  reference_code TEXT NOT NULL,
  container_name TEXT,
  cbm DECIMAL(10,2),
  product_cost DECIMAL(10,2),
  freight_cost DECIMAL(10,2),
  payment DECIMAL(10,2),
  payment_date DATE,
  remaining DECIMAL(10,2),
  status TEXT DEFAULT 'PENDING',
  production_days INTEGER,
  production_ready DATE,
  remarks TEXT,
  contact_person TEXT,
  email TEXT,
  contact_number TEXT,
  address TEXT,
  client TEXT,
  awaiting TEXT[],
  need TEXT[],
  price_terms TEXT,
  cartons INTEGER,
  gross_weight DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Arrivals table
CREATE TABLE IF NOT EXISTS arrivals (
  id BIGSERIAL PRIMARY KEY,
  container_code TEXT UNIQUE NOT NULL,
  departure_port TEXT,
  bl TEXT,
  ref TEXT,
  etd DATE,
  eta DATE,
  piraeus DATE,
  paleros DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENTYPO PARALAVIS table
CREATE TABLE IF NOT EXISTS entypo_paralavis (
  id BIGSERIAL PRIMARY KEY,
  row_number INTEGER NOT NULL,
  description_of_goods TEXT,
  material TEXT,
  color TEXT,
  supplier_code TEXT,
  qty_meters DECIMAL(10, 2),
  r_field TEXT,
  remarks_paralavi TEXT,
  remarks TEXT,
  picture_items TEXT,
  aroma_code TEXT,
  aroma_description TEXT,
  client TEXT,
  price_existing DECIMAL(10, 2),
  new_price DECIMAL(10, 2),
  photography TEXT,
  length DECIMAL(10, 2),
  width DECIMAL(10, 2),
  height DECIMAL(10, 2),
  price_usd DECIMAL(10, 2),
  ship_to_forwarder DECIMAL(10, 2) DEFAULT 1.09,
  multiplier_base DECIMAL(10, 2) DEFAULT 1.09,
  multiplier_1 DECIMAL(10, 2) DEFAULT 2,
  multiplier_2 DECIMAL(10, 2) DEFAULT 2.5,
  multiplier_3 DECIMAL(10, 2) DEFAULT 3,
  multiplier_4 DECIMAL(10, 2) DEFAULT 3.5,
  price_with_vat DECIMAL(10, 2) DEFAULT 4.5,
  existing_price_calc DECIMAL(10, 2),
  proposal_price DECIMAL(10, 2),
  profit_margin_1 DECIMAL(10, 2) DEFAULT 1,
  profit_margin_2 DECIMAL(10, 2) DEFAULT -0.4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_row_number UNIQUE(row_number)
);

-- Enable RLS on all tables
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE container_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE entypo_paralavis ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo purposes)
CREATE POLICY "Enable all for containers" ON containers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for container_items" ON container_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for arrivals" ON arrivals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for entypo_paralavis" ON entypo_paralavis FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_container_items_container ON container_items(container_name);
CREATE INDEX IF NOT EXISTS idx_container_items_status ON container_items(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(active);
CREATE INDEX IF NOT EXISTS idx_arrivals_container_code ON arrivals(container_code);
