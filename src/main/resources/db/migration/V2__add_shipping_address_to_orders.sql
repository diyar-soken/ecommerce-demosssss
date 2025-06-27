-- Aggiunta colonne per l'indirizzo di spedizione alla tabella orders
ALTER TABLE orders ADD COLUMN shipping_full_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_address_line1 VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_address_line2 VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_postal_code VARCHAR(10);
ALTER TABLE orders ADD COLUMN shipping_province VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_country VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_phone_number VARCHAR(20);