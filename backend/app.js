import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import pool from './db.js'

const app = express()
const demoUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@fitfoot.com',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
  {
    id: 2,
    name: 'Demo Customer',
    email: 'customer@fitfoot.com',
    password_hash: bcrypt.hashSync('customer123', 10),
    role: 'customer',
  },
]

const demoProducts = [
  {
    id: 1,
    name: 'Air Glide Runner',
    price: 119.99,
    color: 'purple',
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    description: 'Lightweight daily runner with premium cushioning.',
  },
  {
    id: 2,
    name: 'Urban Flex Pro',
    price: 159.99,
    color: 'blue',
    stock: 12,
    image_url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
    description: 'Structured everyday sneaker for city movement.',
  },
  {
    id: 3,
    name: 'Trail Max X1',
    price: 139.5,
    color: 'green',
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    description: 'Rugged outsole built for outdoor comfort.',
  },
  {
    id: 4,
    name: 'CityStep Lite',
    price: 89.99,
    color: 'purple',
    stock: 22,
    image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
    description: 'Minimal style with a soft, breathable upper.',
  },
  {
    id: 5,
    name: 'Sprint Motion',
    price: 109,
    color: 'blue',
    stock: 20,
    image_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80',
    description: 'Performance-focused support for active routines.',
  },
  {
    id: 6,
    name: 'Summit Grip',
    price: 149.5,
    color: 'green',
    stock: 14,
    image_url: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80',
    description: 'Stability-driven walking shoe for long wear.',
  },
]

const demoOrders = [
  { id: 1, user_id: 2, total: 119.99, status: 'Paid', customer_name: 'Demo Customer' },
  { id: 2, user_id: 2, total: 279.48, status: 'Processing', customer_name: 'Demo Customer' },
]

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api', (req, res) => {
  res.json({
    name: 'FitFoot ShoeStore API',
    status: 'ok',
    version: '1.0.0',
  })
})

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok')
    res.json({
      status: 'ok',
      db: rows.length > 0 ? 'connected' : 'not connected',
    })
  } catch (error) {
    res.json({
      status: 'ok',
      db: 'demo-mode',
      message: 'Database unavailable; using local demo fallback.',
      details: error.message,
    })
  }
})

const sanitizeUser = (user) => {
  if (!user) return null
  const { password_hash, ...safeUser } = user
  return safeUser
}

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()

    try {
      const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail])

      if (existingUsers.length > 0) {
        return res.status(409).json({ message: 'An account with that email already exists.' })
      }

      const passwordHash = await bcrypt.hash(password, 10)

      await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [
        String(name).trim(),
        cleanEmail,
        passwordHash,
        'customer',
      ])

      return res.status(201).json({ message: 'User created successfully.' })
    } catch (dbError) {
      const duplicateUser = demoUsers.find((user) => user.email.toLowerCase() === cleanEmail)

      if (duplicateUser) {
        return res.status(409).json({ message: 'An account with that email already exists.' })
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = {
        id: Date.now(),
        name: String(name).trim(),
        email: cleanEmail,
        password_hash: passwordHash,
        role: 'customer',
      }

      demoUsers.push(newUser)
      return res.status(201).json({
        message: 'User created successfully.',
        user: sanitizeUser(newUser),
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', details: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()

    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail])

      if (!rows.length) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }

      const user = rows[0]
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }

      return res.json({
        message: 'Login successful.',
        user: sanitizeUser(user),
      })
    } catch (dbError) {
      const user = demoUsers.find((item) => item.email.toLowerCase() === cleanEmail)

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password.' })
      }

      return res.json({
        message: 'Login successful.',
        user: sanitizeUser(user),
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', details: error.message })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC')
    return res.json(rows)
  } catch (error) {
    return res.json(demoProducts)
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, color, stock, image_url, description } = req.body

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' })
    }

    try {
      const [result] = await pool.query(
        'INSERT INTO products (name, price, color, stock, image_url, description) VALUES (?, ?, ?, ?, ?, ?)',
        [
          String(name).trim(),
          Number(price),
          color || 'purple',
          Number(stock || 0),
          image_url || '',
          description || '',
        ],
      )

      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId])
      return res.status(201).json(rows[0])
    } catch (dbError) {
      const newProduct = {
        id: Date.now(),
        name: String(name).trim(),
        price: Number(price),
        color: color || 'purple',
        stock: Number(stock || 0),
        image_url: image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        description: description || `${String(name).trim()} premium footwear for everyday performance.`,
      }
      demoProducts.unshift(newProduct)
      return res.status(201).json(newProduct)
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', details: error.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    try {
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id])

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found.' })
      }

      return res.json({ message: 'Product deleted successfully.' })
    } catch (dbError) {
      const index = demoProducts.findIndex((product) => String(product.id) === String(id))

      if (index === -1) {
        return res.status(404).json({ message: 'Product not found.' })
      }

      demoProducts.splice(index, 1)
      return res.json({ message: 'Product deleted successfully.' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', details: error.message })
  }
})

app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.*, u.name AS customer_name
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `)

    return res.json(rows)
  } catch (error) {
    return res.json(
      demoOrders.map((order) => ({
        ...order,
        customer_name: order.customer_name || 'Demo Customer',
      })),
    )
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { user_id, items, total } = req.body

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'User and items are required.' })
    }

    try {
      const connection = await pool.getConnection()

      try {
        await connection.beginTransaction()

        const [orderResult] = await connection.query(
          'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
          [user_id, Number(total || 0), 'Paid'],
        )

        const orderId = orderResult.insertId

        for (const item of items) {
          await connection.query(
            'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, size, color) VALUES (?, ?, ?, ?, ?, ?)',
            [
              orderId,
              item.product_id,
              Number(item.quantity || 1),
              Number(item.price || 0),
              item.size || '',
              item.color || '',
            ],
          )

          await connection.query(
            'UPDATE products SET stock = stock - ? WHERE id = ?',
            [Number(item.quantity || 1), item.product_id],
          )
        }

        await connection.commit()

        return res.status(201).json({
          message: 'Order created successfully.',
          orderId,
        })
      } catch (transactionError) {
        await connection.rollback()
        throw transactionError
      } finally {
        connection.release()
      }
    } catch (dbError) {
      const orderId = Date.now()
      demoOrders.unshift({
        id: orderId,
        user_id,
        total: Number(total || 0),
        status: 'Paid',
        customer_name: 'Customer',
      })
      return res.status(201).json({
        message: 'Order created successfully.',
        orderId,
      })
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', details: error.message })
  }
})

app.get('/api/admin/stats', async (req, res) => {
  try {
    const [revenueResult] = await pool.query('SELECT COALESCE(SUM(total), 0) AS revenue, COUNT(*) AS order_count FROM orders')
    const [productResult] = await pool.query('SELECT COUNT(*) AS product_count, COALESCE(SUM(stock), 0) AS total_stock FROM products')
    const [userResult] = await pool.query('SELECT COUNT(*) AS customer_count FROM users WHERE role = ?', ['customer'])

    return res.json({
      revenue: Number(revenueResult[0]?.revenue || 0),
      order_count: Number(revenueResult[0]?.order_count || 0),
      product_count: Number(productResult[0]?.product_count || 0),
      total_stock: Number(productResult[0]?.total_stock || 0),
      customer_count: Number(userResult[0]?.customer_count || 0),
    })
  } catch (error) {
    return res.json({
      revenue: 24580,
      order_count: 1284,
      product_count: demoProducts.length,
      total_stock: demoProducts.reduce((sum, item) => sum + (Number(item.stock) || 0), 0),
      customer_count: demoUsers.filter((user) => user.role === 'customer').length,
    })
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error', details: err.message })
})

export default app
