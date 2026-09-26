USE fitfoot_store;

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin User', 'admin@fitfoot.com', '$2a$10$QwM3Yx/7U2Qk3v1P7e8FQe2Hj7mB7K0jO4IGS2u5W9F7q9eGz6Q2', 'admin'),
  ('Demo Customer', 'customer@fitfoot.com', '$2a$10$QwM3Yx/7U2Qk3v1P7e8FQe2Hj7mB7K0jO4IGS2u5W9F7q9eGz6Q2', 'customer');

INSERT INTO products (name, price, color, stock, image_url, description) VALUES
  ('Air Glide Runner', 119.99, 'purple', 18, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', 'Lightweight daily runner with premium cushioning.'),
  ('Urban Flex Pro', 159.99, 'blue', 12, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80', 'Structured everyday sneaker for city movement.'),
  ('Trail Max X1', 139.50, 'green', 15, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80', 'Rugged outsole built for outdoor comfort.'),
  ('CityStep Lite', 89.99, 'purple', 22, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80', 'Minimal style with a soft, breathable upper.'),
  ('Sprint Motion', 109.00, 'blue', 20, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80', 'Performance-focused support for active routines.'),
  ('Summit Grip', 149.50, 'green', 14, 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80', 'Stability-driven walking shoe for long wear.' );

INSERT INTO orders (user_id, total, status) VALUES
  (2, 119.99, 'Paid'),
  (2, 279.48, 'Processing');

INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, size, color) VALUES
  (1, 1, 1, 119.99, '8', 'purple'),
  (2, 2, 1, 159.99, '7', 'blue'),
  (2, 3, 1, 119.49, '9', 'green');

INSERT INTO wishlist (user_id, product_id) VALUES
  (2, 4),
  (2, 6);

INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
  (1, 2, 5, 'Very comfortable and stylish.'),
  (2, 2, 4, 'Perfect fit for everyday use.');
