
INSERT INTO users (name, email, password, phone, cpf, is_admin, is_active) VALUES
('Admin Test', 'admin@locafacil.com', '$2a$10$YourHashedPasswordHere', '11999999999', '12345678901', TRUE, TRUE)
ON CONFLICT DO NOTHING;

