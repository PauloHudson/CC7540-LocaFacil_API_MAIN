
INSERT INTO insurance_options (name, description, daily_price, coverage_type) VALUES
('Cobertura Básica', 'Cobertura de danos ao terceiro', 25.00, 'basic'),
('Cobertura Média', 'Cobertura completa com franquia reduzida', 45.00, 'medium'),
('Cobertura Máxima', 'Cobertura total sem franquia', 75.00, 'full')
ON CONFLICT DO NOTHING;


INSERT INTO vehicles (name, brand, model, year, color, license_plate, daily_price, status) VALUES
('Sedan Executivo', 'Toyota', 'Corolla', 2023, 'Prata', 'ABC-1234', 150.00, 'available'),
('SUV Confort', 'Hyundai', 'Creta', 2023, 'Preto', 'DEF-5678', 180.00, 'available'),
('Hatch Econômico', 'Fiat', 'Uno', 2022, 'Branco', 'GHI-9012', 100.00, 'available'),
('Pickup Robusta', 'Ford', 'Ranger', 2023, 'Cinza', 'JKL-3456', 220.00, 'available'),
('Minivan Familiar', 'Kia', 'Carnival', 2023, 'Branco', 'MNO-7890', 200.00, 'available')
ON CONFLICT DO NOTHING;


INSERT INTO electronics (name, brand, model, specifications, daily_price, status) VALUES
('Smartphone Flagship', 'Samsung', 'Galaxy S24', '6.1" Display, 200MP Camera, 5G', 80.00, 'available'),
('Smartphone Premium', 'Apple', 'iPhone 15 Pro', '6.1" Display, 48MP Camera, A17 Pro', 100.00, 'available'),
('Tablet Profissional', 'iPad', 'Pro 12.9"', '12.9" Liquid Retina XDR, M2 Chip', 120.00, 'available'),
('Smartphone Intermediário', 'Xiaomi', 'Redmi Note 13', '6.67" Display, 108MP Camera', 50.00, 'available'),
('Smartwatch', 'Samsung', 'Galaxy Watch 6', 'AMOLED Display, Saúde, Fitness', 40.00, 'available'),
('Laptop Portátil', 'Dell', 'XPS 13', '13.4" FHD, Intel i7, 16GB RAM', 150.00, 'available'),
('Tablet Budget', 'Samsung', 'Galaxy Tab A9', '8.7" Display, Snapdragon 695', 60.00, 'available')
ON CONFLICT DO NOTHING;
