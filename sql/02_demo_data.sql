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

-- Insert container items (fictional data with 20+ entries per container)
INSERT INTO container_items (reference_code, container_name, cbm, product_cost, freight_cost, payment, remaining, status, production_days, contact_person, email, contact_number, client) VALUES
  -- DEMO-001 SOUTH (20 items)
  ('SUP-001', 'DEMO-001 SOUTH', 2.5, 1500.00, 200.00, 850.00, 650.00, 'READY TO SHIP', 15, 'John Smith', 'demo@example.com', '+1-555-0100', 'Client Alpha'),
  ('SUP-002', 'DEMO-001 SOUTH', 1.8, 2200.00, 180.00, 1100.00, 1100.00, 'IN PRODUCTION', 20, 'Jane Doe', 'demo2@example.com', '+1-555-0101', 'Client Beta'),
  ('SUP-006', 'DEMO-001 SOUTH', 3.2, 1800.00, 220.00, 900.00, 900.00, 'READY TO SHIP', 18, 'Mike Johnson', 'demo6@example.com', '+1-555-0105', 'Client Alpha'),
  ('SUP-007', 'DEMO-001 SOUTH', 2.1, 1300.00, 150.00, 700.00, 600.00, 'IN PRODUCTION', 22, 'Sarah Williams', 'demo7@example.com', '+1-555-0106', 'Client Beta'),
  ('SUP-008', 'DEMO-001 SOUTH', 4.0, 2500.00, 300.00, 1250.00, 1250.00, 'AWAITING SUPPLIER', 25, 'Tom Brown', 'demo8@example.com', '+1-555-0107', 'Client Gamma'),
  ('SUP-009', 'DEMO-001 SOUTH', 1.5, 900.00, 120.00, 450.00, 450.00, 'NEED PAYMENT', 10, 'Lisa Garcia', 'demo9@example.com', '+1-555-0108', 'Client Delta'),
  ('SUP-010', 'DEMO-001 SOUTH', 3.8, 2100.00, 250.00, 1050.00, 1050.00, 'PENDING', 28, 'David Martinez', 'demo10@example.com', '+1-555-0109', 'Client Epsilon'),
  ('SUP-011', 'DEMO-001 SOUTH', 2.7, 1600.00, 190.00, 800.00, 800.00, 'READY TO SHIP', 16, 'Emma Rodriguez', 'demo11@example.com', '+1-555-0110', 'Client Alpha'),
  ('SUP-012', 'DEMO-001 SOUTH', 1.9, 1100.00, 140.00, 550.00, 550.00, 'IN PRODUCTION', 19, 'James Wilson', 'demo12@example.com', '+1-555-0111', 'Client Beta'),
  ('SUP-013', 'DEMO-001 SOUTH', 3.5, 2000.00, 240.00, 1000.00, 1000.00, 'AWAITING SUPPLIER', 24, 'Olivia Lee', 'demo13@example.com', '+1-555-0112', 'Client Gamma'),
  ('SUP-014', 'DEMO-001 SOUTH', 2.3, 1400.00, 170.00, 700.00, 700.00, 'NEED PAYMENT', 14, 'William Taylor', 'demo14@example.com', '+1-555-0113', 'Client Delta'),
  ('SUP-015', 'DEMO-001 SOUTH', 4.2, 2800.00, 320.00, 1400.00, 1400.00, 'PENDING', 32, 'Sophia Anderson', 'demo15@example.com', '+1-555-0114', 'Client Epsilon'),
  ('SUP-016', 'DEMO-001 SOUTH', 1.7, 1000.00, 130.00, 500.00, 500.00, 'READY TO SHIP', 12, 'Benjamin Thomas', 'demo16@example.com', '+1-555-0115', 'Client Alpha'),
  ('SUP-017', 'DEMO-001 SOUTH', 3.1, 1900.00, 230.00, 950.00, 950.00, 'IN PRODUCTION', 21, 'Ava Jackson', 'demo17@example.com', '+1-555-0116', 'Client Beta'),
  ('SUP-018', 'DEMO-001 SOUTH', 2.4, 1500.00, 180.00, 750.00, 750.00, 'AWAITING SUPPLIER', 23, 'Lucas White', 'demo18@example.com', '+1-555-0117', 'Client Gamma'),
  ('SUP-019', 'DEMO-001 SOUTH', 3.6, 2300.00, 270.00, 1150.00, 1150.00, 'NEED PAYMENT', 17, 'Mia Harris', 'demo19@example.com', '+1-555-0118', 'Client Delta'),
  ('SUP-020', 'DEMO-001 SOUTH', 2.0, 1200.00, 150.00, 600.00, 600.00, 'PENDING', 26, 'Ethan Martin', 'demo20@example.com', '+1-555-0119', 'Client Epsilon'),
  ('SUP-021', 'DEMO-001 SOUTH', 3.3, 2100.00, 250.00, 1050.00, 1050.00, 'READY TO SHIP', 20, 'Isabella Thompson', 'demo21@example.com', '+1-555-0120', 'Client Alpha'),
  ('SUP-022', 'DEMO-001 SOUTH', 1.6, 950.00, 125.00, 475.00, 475.00, 'IN PRODUCTION', 15, 'Mason Garcia', 'demo22@example.com', '+1-555-0121', 'Client Beta'),
  ('SUP-023', 'DEMO-001 SOUTH', 4.1, 2700.00, 310.00, 1350.00, 1350.00, 'AWAITING SUPPLIER', 29, 'Charlotte Martinez', 'demo23@example.com', '+1-555-0122', 'Client Gamma'),
  
  -- DEMO-002 NORTH (20 items)
  ('SUP-003', 'DEMO-002 NORTH', 5.2, 3500.00, 450.00, 1750.00, 1750.00, 'AWAITING SUPPLIER', 25, 'Bob Wilson', 'demo3@example.com', '+1-555-0102', 'Client Gamma'),
  ('SUP-004', 'DEMO-002 NORTH', 3.0, 1800.00, 220.00, 900.00, 900.00, 'NEED PAYMENT', 12, 'Alice Brown', 'demo4@example.com', '+1-555-0103', 'Client Delta'),
  ('SUP-024', 'DEMO-002 NORTH', 2.8, 1700.00, 210.00, 850.00, 850.00, 'READY TO SHIP', 18, 'Harper Robinson', 'demo24@example.com', '+1-555-0123', 'Client Alpha'),
  ('SUP-025', 'DEMO-002 NORTH', 3.4, 2200.00, 260.00, 1100.00, 1100.00, 'IN PRODUCTION', 22, 'Elijah Clark', 'demo25@example.com', '+1-555-0124', 'Client Beta'),
  ('SUP-026', 'DEMO-002 NORTH', 4.5, 3000.00, 350.00, 1500.00, 1500.00, 'AWAITING SUPPLIER', 27, 'Amelia Rodriguez', 'demo26@example.com', '+1-555-0125', 'Client Gamma'),
  ('SUP-027', 'DEMO-002 NORTH', 2.2, 1300.00, 160.00, 650.00, 650.00, 'NEED PAYMENT', 14, 'Logan Lewis', 'demo27@example.com', '+1-555-0126', 'Client Delta'),
  ('SUP-028', 'DEMO-002 NORTH', 3.7, 2400.00, 280.00, 1200.00, 1200.00, 'PENDING', 30, 'Evelyn Lee', 'demo28@example.com', '+1-555-0127', 'Client Epsilon'),
  ('SUP-029', 'DEMO-002 NORTH', 2.6, 1600.00, 195.00, 800.00, 800.00, 'READY TO SHIP', 16, 'Alexander Walker', 'demo29@example.com', '+1-555-0128', 'Client Alpha'),
  ('SUP-030', 'DEMO-002 NORTH', 3.9, 2600.00, 300.00, 1300.00, 1300.00, 'IN PRODUCTION', 24, 'Abigail Hall', 'demo30@example.com', '+1-555-0129', 'Client Beta'),
  ('SUP-031', 'DEMO-002 NORTH', 2.1, 1250.00, 155.00, 625.00, 625.00, 'AWAITING SUPPLIER', 20, 'Daniel Allen', 'demo31@example.com', '+1-555-0130', 'Client Gamma'),
  ('SUP-032', 'DEMO-002 NORTH', 4.8, 3200.00, 380.00, 1600.00, 1600.00, 'NEED PAYMENT', 28, 'Emily Young', 'demo32@example.com', '+1-555-0131', 'Client Delta'),
  ('SUP-033', 'DEMO-002 NORTH', 3.2, 2000.00, 240.00, 1000.00, 1000.00, 'PENDING', 26, 'Matthew Hernandez', 'demo33@example.com', '+1-555-0132', 'Client Epsilon'),
  ('SUP-034', 'DEMO-002 NORTH', 2.9, 1800.00, 220.00, 900.00, 900.00, 'READY TO SHIP', 19, 'Elizabeth King', 'demo34@example.com', '+1-555-0133', 'Client Alpha'),
  ('SUP-035', 'DEMO-002 NORTH', 3.5, 2300.00, 270.00, 1150.00, 1150.00, 'IN PRODUCTION', 23, 'Joseph Wright', 'demo35@example.com', '+1-555-0134', 'Client Beta'),
  ('SUP-036', 'DEMO-002 NORTH', 4.2, 2800.00, 330.00, 1400.00, 1400.00, 'AWAITING SUPPLIER', 25, 'Sofia Lopez', 'demo36@example.com', '+1-555-0135', 'Client Gamma'),
  ('SUP-037', 'DEMO-002 NORTH', 2.5, 1500.00, 185.00, 750.00, 750.00, 'NEED PAYMENT', 15, 'Samuel Hill', 'demo37@example.com', '+1-555-0136', 'Client Delta'),
  ('SUP-038', 'DEMO-002 NORTH', 3.8, 2500.00, 290.00, 1250.00, 1250.00, 'PENDING', 31, 'Avery Scott', 'demo38@example.com', '+1-555-0137', 'Client Epsilon'),
  ('SUP-039', 'DEMO-002 NORTH', 2.3, 1400.00, 175.00, 700.00, 700.00, 'READY TO SHIP', 17, 'David Green', 'demo39@example.com', '+1-555-0138', 'Client Alpha'),
  ('SUP-040', 'DEMO-002 NORTH', 4.0, 2700.00, 315.00, 1350.00, 1350.00, 'IN PRODUCTION', 21, 'Ella Adams', 'demo40@example.com', '+1-555-0139', 'Client Beta'),
  ('SUP-041', 'DEMO-002 NORTH', 3.1, 1950.00, 235.00, 975.00, 975.00, 'AWAITING SUPPLIER', 22, 'Michael Baker', 'demo41@example.com', '+1-555-0140', 'Client Gamma'),
  
  -- DEMO-003 SOUTH (20 items)
  ('SUP-005', 'DEMO-003 SOUTH', 4.5, 4200.00, 380.00, 2100.00, 2100.00, 'PENDING', 30, 'Charlie Davis', 'demo5@example.com', '+1-555-0104', 'Client Epsilon'),
  ('SUP-042', 'DEMO-003 SOUTH', 2.7, 1650.00, 200.00, 825.00, 825.00, 'READY TO SHIP', 18, 'Victoria Gonzalez', 'demo42@example.com', '+1-555-0141', 'Client Alpha'),
  ('SUP-043', 'DEMO-003 SOUTH', 3.3, 2100.00, 250.00, 1050.00, 1050.00, 'IN PRODUCTION', 20, 'Christopher Nelson', 'demo43@example.com', '+1-555-0142', 'Client Beta'),
  ('SUP-044', 'DEMO-003 SOUTH', 4.1, 2750.00, 320.00, 1375.00, 1375.00, 'AWAITING SUPPLIER', 26, 'Madison Carter', 'demo44@example.com', '+1-555-0143', 'Client Gamma'),
  ('SUP-045', 'DEMO-003 SOUTH', 2.4, 1450.00, 180.00, 725.00, 725.00, 'NEED PAYMENT', 13, 'Andrew Mitchell', 'demo45@example.com', '+1-555-0144', 'Client Delta'),
  ('SUP-046', 'DEMO-003 SOUTH', 3.6, 2350.00, 275.00, 1175.00, 1175.00, 'PENDING', 28, 'Scarlett Perez', 'demo46@example.com', '+1-555-0145', 'Client Epsilon'),
  ('SUP-047', 'DEMO-003 SOUTH', 2.0, 1200.00, 150.00, 600.00, 600.00, 'READY TO SHIP', 16, 'Joshua Roberts', 'demo47@example.com', '+1-555-0146', 'Client Alpha'),
  ('SUP-048', 'DEMO-003 SOUTH', 3.8, 2550.00, 295.00, 1275.00, 1275.00, 'IN PRODUCTION', 24, 'Grace Turner', 'demo48@example.com', '+1-555-0147', 'Client Beta'),
  ('SUP-049', 'DEMO-003 SOUTH', 2.9, 1850.00, 225.00, 925.00, 925.00, 'AWAITING SUPPLIER', 21, 'Ryan Phillips', 'demo49@example.com', '+1-555-0148', 'Client Gamma'),
  ('SUP-050', 'DEMO-003 SOUTH', 4.3, 2900.00, 340.00, 1450.00, 1450.00, 'NEED PAYMENT', 27, 'Chloe Campbell', 'demo50@example.com', '+1-555-0149', 'Client Delta'),
  ('SUP-051', 'DEMO-003 SOUTH', 2.6, 1600.00, 195.00, 800.00, 800.00, 'PENDING', 29, 'Nathan Parker', 'demo51@example.com', '+1-555-0150', 'Client Epsilon'),
  ('SUP-052', 'DEMO-003 SOUTH', 3.4, 2200.00, 260.00, 1100.00, 1100.00, 'READY TO SHIP', 19, 'Lillian Evans', 'demo52@example.com', '+1-555-0151', 'Client Alpha'),
  ('SUP-053', 'DEMO-003 SOUTH', 2.2, 1350.00, 165.00, 675.00, 675.00, 'IN PRODUCTION', 22, 'Dylan Edwards', 'demo53@example.com', '+1-555-0152', 'Client Beta'),
  ('SUP-054', 'DEMO-003 SOUTH', 3.9, 2650.00, 305.00, 1325.00, 1325.00, 'AWAITING SUPPLIER', 25, 'Zoey Collins', 'demo54@example.com', '+1-555-0153', 'Client Gamma'),
  ('SUP-055', 'DEMO-003 SOUTH', 2.5, 1550.00, 190.00, 775.00, 775.00, 'NEED PAYMENT', 14, 'Tyler Stewart', 'demo55@example.com', '+1-555-0154', 'Client Delta'),
  ('SUP-056', 'DEMO-003 SOUTH', 4.0, 2700.00, 315.00, 1350.00, 1350.00, 'PENDING', 31, 'Hannah Sanchez', 'demo56@example.com', '+1-555-0155', 'Client Epsilon'),
  ('SUP-057', 'DEMO-003 SOUTH', 2.8, 1750.00, 215.00, 875.00, 875.00, 'READY TO SHIP', 17, 'Jack Morris', 'demo57@example.com', '+1-555-0156', 'Client Alpha'),
  ('SUP-058', 'DEMO-003 SOUTH', 3.5, 2300.00, 270.00, 1150.00, 1150.00, 'IN PRODUCTION', 23, 'Aria Rogers', 'demo58@example.com', '+1-555-0157', 'Client Beta'),
  ('SUP-059', 'DEMO-003 SOUTH', 2.1, 1300.00, 160.00, 650.00, 650.00, 'AWAITING SUPPLIER', 20, 'Luke Reed', 'demo59@example.com', '+1-555-0158', 'Client Gamma'),
  ('SUP-060', 'DEMO-003 SOUTH', 4.4, 3000.00, 355.00, 1500.00, 1500.00, 'NEED PAYMENT', 26, 'Layla Cook', 'demo60@example.com', '+1-555-0159', 'Client Delta')
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
