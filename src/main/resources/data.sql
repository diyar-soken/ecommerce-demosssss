-- Inserimento Categorie (con gestione duplicati)
INSERT IGNORE INTO categories (id, name, description) VALUES
(1, 'Computers', 'High-performance computers and laptops'),
(2, 'Tablets', 'Innovative tablets for work and creativity'),
(3, 'Smartphones', 'Cutting-edge smartphones'),
(4, 'Displays', 'Professional displays and monitors'),
(5, 'Audio', 'Premium audio accessories'),
(6, 'Accessories', 'Essential tech accessories');

-- Inserimento Prodotti Pear (con gestione duplicati)
INSERT IGNORE INTO products (id, name, description, price, image_url, category_id) VALUES
-- Computers
(1, 'PearBook Air', 'Supercharged by the P1 Neural Engine. 13-inch MacBook Air with incredible performance and all-day battery life.', 1299.0, '/assets/images/macbook-air-mini.png', 1),
(2, 'PearBook Pro', 'Pro performance for demanding tasks. 14-inch MacBook Pro with advanced M2 Pro chip and ProMotion display.', 1999.0, '/assets/images/macbook-pro.png', 1),

-- Tablets  
(3, 'PearPad Pro', 'The ultimate creative companion. 12.9-inch iPad Pro with M2 chip and Apple Pencil support.', 1099.0, '/assets/images/ipadpro-mini.png', 2),

-- Smartphones
(4, 'PearPhone 15', 'Innovation in your pocket. 6.7-inch display with A17 Pro chip and advanced camera system.', 999.0, '/assets/images/iphone16-mini.png', 3),

-- Displays
(5, 'Studio Display', 'Immersive viewing experience. 27-inch 5K Retina display with True Tone and P3 wide color.', 1599.0, '/assets/images/applestudio-mini.png', 4),

-- Audio
(6, 'PearPod Pro', 'Spatial audio perfection. Wireless earbuds with active noise cancellation and transparency mode.', 249.0, '/assets/images/airpods-mini.png', 5);

-- Accessories
--(7, 'Magic Keyboard', 'Precision typing experience. Backlit keys with scissor mechanism and Touch ID.', 299.0, '/assets/images/magic-keyboard.png', 6),
--(8, 'Magic Mouse', 'Wireless precision. Multi-Touch surface with gesture support and rechargeable battery.', 199.0, '/assets/images/magic-mouse.png', 6),
--(9, 'PearWatch Ultra', 'Ultimate fitness companion. GPS + Cellular with titanium case and Action Button.', 799.0, '/assets/images/watch-ultra.png', 6),
--(10, 'AirTag 4-Pack', 'Find your things. Precision Finding with Ultra Wideband technology.', 99.0, '/assets/images/airtag.png', 6);


