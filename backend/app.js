import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import pool from './db.js'

const app = express()

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
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      details: error.message,
    })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    const cleanEmail = String(email).trim().toLowerCase()

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

    res.status(201).json({ message: 'User created successfully.' })
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
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail])

    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const user = rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const { password_hash, ...safeUser } = user

    res.json({
      message: 'Login successful.',
      user: safeUser,
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', details: error.message })
  }
})

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC')
    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Failed to load products', details: error.message })
  }
})

app.post('/api/products', async (req, res) => {
  try {
    const { name, price, color, stock, image_url, description } = req.body

    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' })
    }

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
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', details: error.message })
  }
})

app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    res.json({ message: 'Product deleted successfully.' })
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

    res.json(rows)
  } catch (error) {
    res.status(500).json({ message: 'Failed to load orders', details: error.message })
  }
})

app.post('/api/orders', async (req, res) => {
  try {
    const { user_id, items, total } = req.body

    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'User and items are required.' })
    }

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

      res.status(201).json({
        message: 'Order created successfully.',
        orderId,
      })
    } catch (transactionError) {
      await connection.rollback()
      throw transactionError
    } finally {
      connection.release()
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

    res.json({
      revenue: Number(revenueResult[0]?.revenue || 0),
      order_count: Number(revenueResult[0]?.order_count || 0),
      product_count: Number(productResult[0]?.product_count || 0),
      total_stock: Number(productResult[0]?.total_stock || 0),
      customer_count: Number(userResult[0]?.customer_count || 0),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to load admin stats', details: error.message })
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error', details: err.message })
})

export default app
