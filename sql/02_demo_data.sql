-- Container Planning Demo - Sample Data
-- All data is fictional for demonstration purposes

-- Insert containers
INSERT INTO containers (name) VALUES
  ('DEMO-001 SOUTH'),
  ('DEMO-002 NORTH'),
  ('DEMO-003 SOUTH'),
  ('DEMO-004 SOUTH')
ON CONFLICT (name) DO NOTHING;

-- Insert sample suppliers (fictional data)
INSERT INTO suppliers (reference_code, supplier, product, cbm, product_cost, freight_cost, payment, status, production_days, contact_person, email, contact_number, address) VALUES
  ('SUP-001', 'Acme Trading Co.', 'Industrial Components A', 2.5, 1500.00, 200.00, 850.00, 'READY TO SHIP', 15, 'John Smith', 'demo@example.com', '+1-555-0100', '123 Demo Street, Sample City'),
  ('SUP-002', 'Global Supplies Ltd.', 'Electronic Parts B', 1.8, 2200.00, 180.00, 1100.00, 'IN PRODUCTION', 20, 'Jane Doe', 'demo2@example.com', '+1-555-0101', '456 Test Avenue, Demo Town'),
  ('SUP-003', 'Pacific Exports Inc.', 'Furniture Set C', 5.2, 3500.00, 450.00, 1750.00, 'AWAITING SUPPLIER', 25, 'Bob Wilson', 'demo3@example.com', '+1-555-0102', '789 Sample Road, Test City'),
  ('SUP-004', 'Eastern Materials', 'Textile Products D', 3.0, 1800.00, 220.00, 900.00, 'NEED PAYMENT', 12, 'Alice Brown', 'demo4@example.com', '+1-555-0103', '321 Example Blvd, Demo State'),
  ('SUP-005', 'Summit Industries', 'Metal Parts E', 4.5, 4200.00, 380.00, 2100.00, 'PENDING', 30, 'Charlie Davis', 'demo5@example.com', '+1-555-0104', '654 Mock Lane, Sample County')
ON CONFLICT (reference_code) DO NOTHING;

-- Insert container items (fictional data)
INSERT INTO container_items (reference_code, container_name, cbm, product_cost, freight_cost, payment, remaining, status, production_days, contact_person, email, contact_number, client) VALUES
  ('SUP-001', 'DEMO-001 SOUTH', 2.5, 1500.00, 200.00, 850.00, 650.00, 'READY TO SHIP', 15, 'John Smith', 'demo@example.com', '+1-555-0100', 'Client Alpha'),
  ('SUP-002', 'DEMO-001 SOUTH', 1.8, 2200.00, 180.00, 1100.00, 1100.00, 'IN PRODUCTION', 20, 'Jane Doe', 'demo2@example.com', '+1-555-0101', 'Client Beta'),
  ('SUP-003', 'DEMO-002 NORTH', 5.2, 3500.00, 450.00, 1750.00, 1750.00, 'AWAITING SUPPLIER', 25, 'Bob Wilson', 'demo3@example.com', '+1-555-0102', 'Client Gamma'),
  ('SUP-004', 'DEMO-002 NORTH', 3.0, 1800.00, 220.00, 900.00, 900.00, 'NEED PAYMENT', 12, 'Alice Brown', 'demo4@example.com', '+1-555-0103', 'Client Delta'),
  ('SUP-005', 'DEMO-003 SOUTH', 4.5, 4200.00, 380.00, 2100.00, 2100.00, 'PENDING', 30, 'Charlie Davis', 'demo5@example.com', '+1-555-0104', 'Client Epsilon')
ON CONFLICT DO NOTHING;

-- Insert arrivals (fictional data with various statuses)
INSERT INTO arrivals (container_code, departure_port, bl, ref, etd, piraeus, paleros) VALUES
  ('DEMO-001 SOUTH', 'Shanghai', 'BL-2024-001', 'REF-001', '2024-12-01', '2024-12-20', '2024-12-25'),
  ('DEMO-002 NORTH', 'Ningbo', 'BL-2024-002', 'REF-002', '2024-12-10', '2024-12-28', NULL),
  ('DEMO-003 SOUTH', 'Shenzhen', 'BL-2024-003', 'REF-003', '2024-12-15', NULL, NULL),
  ('DEMO-004 SOUTH', 'Guangzhou', 'BL-2024-004', 'REF-004', '2025-01-05', NULL, NULL)
ON CONFLICT (container_code) DO NOTHING;

-- Insert ENTYPO PARALAVIS sample data
INSERT INTO entypo_paralavis (row_number, description_of_goods, material, color, supplier_code, qty_meters, price_usd, aroma_code, aroma_description, client) VALUES
  (1, 'Premium Fabric A', 'Cotton', 'Navy Blue', 'FAB-001', 100, 5.50, 'AR-001', 'Lavender', 'Client Alpha'),
  (2, 'Industrial Textile B', 'Polyester', 'Grey', 'FAB-002', 250, 3.25, 'AR-002', 'Fresh Linen', 'Client Beta'),
  (3, 'Decorative Material C', 'Silk Blend', 'Burgundy', 'FAB-003', 75, 12.00, 'AR-003', 'Rose Garden', 'Client Gamma'),
  (4, 'Standard Cloth D', 'Cotton/Poly', 'White', 'FAB-004', 500, 2.80, 'AR-004', 'Ocean Breeze', 'Client Delta'),
  (5, 'Luxury Fabric E', 'Wool', 'Charcoal', 'FAB-005', 50, 18.50, 'AR-005', 'Cedar Wood', 'Client Epsilon')
ON CONFLICT (row_number) DO NOTHING;
