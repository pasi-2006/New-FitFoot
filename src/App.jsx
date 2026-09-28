import { useEffect, useRef, useState } from 'react'
import './App.css'

const initialProducts = [
  {
    id: 1,
    name: 'Air Glide Runner',
    price: 119.99,
    color: 'purple',
    category: 'Running',
    availableColors: ['purple', 'blue', 'green'],
    sizes: ['6', '7', '8', '9', '10'],
    stock: 18,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Urban Flex Pro',
    price: 159.99,
    color: 'blue',
    category: 'Lifestyle',
    availableColors: ['blue', 'purple', 'green'],
    sizes: ['5', '6', '7', '8', '9'],
    stock: 12,
    image:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    name: 'Trail Max X1',
    price: 139.5,
    color: 'green',
    category: 'Hiking',
    availableColors: ['green', 'blue', 'purple'],
    sizes: ['6', '7', '8', '10', '11'],
    stock: 15,
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    name: 'CityStep Lite',
    price: 89.99,
    color: 'purple',
    category: 'Training',
    availableColors: ['purple', 'blue'],
    sizes: ['5', '6', '7', '8', '9'],
    stock: 22,
    image:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    name: 'Sprint Motion',
    price: 109.0,
    color: 'blue',
    category: 'Training',
    availableColors: ['blue', 'green', 'purple'],
    sizes: ['7', '8', '9', '10', '11'],
    stock: 20,
    image:
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    name: 'Summit Grip',
    price: 149.5,
    color: 'green',
    category: 'Hiking',
    availableColors: ['green', 'purple', 'blue'],
    sizes: ['6', '7', '8', '9', '10'],
    stock: 14,
    image:
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80',
  },
]

function App() {
  const demoUsers = [
    { id: 1, name: 'Admin User', email: 'admin@fitfoot.com', password: 'admin123', role: 'admin' },
    { id: 2, name: 'Demo Customer', email: 'customer@fitfoot.com', password: 'customer123', role: 'customer' },
  ]

  const getDemoUser = (email, password) => {
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '')

    return demoUsers.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === normalizedPassword,
    )
  }

  const [page, setPage] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' })
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    address: '',
    city: '',
    card: '',
  })
  const [products, setProducts] = useState(initialProducts)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const SESSION_KEY = 'fitfoot_session'
  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem(SESSION_KEY)
    if (!savedSession) return null

    try {
      return JSON.parse(savedSession)
    } catch (error) {
      return null
    }
  })
  const [message, setMessage] = useState('')
  const [toast, setToast] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    color: 'purple',
    category: 'Running',
    stock: 10,
    image: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priceFilter, setPriceFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [adminLogin, setAdminLogin] = useState({ email: 'admin@fitfoot.com', password: 'admin123' })
  const [adminForm, setAdminForm] = useState({ email: 'admin@fitfoot.com', password: 'admin123' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [detailQuantity, setDetailQuantity] = useState(1)
  const [orderConfirmation, setOrderConfirmation] = useState(null)
  const fileInputRef = useRef(null)
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
  const itemsPerPage = 6

  const saveSession = (user) => {
    if (!user) {
      localStorage.removeItem(SESSION_KEY)
      return
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }

  const restoreSession = () => {
    const savedSession = localStorage.getItem(SESSION_KEY)
    if (!savedSession) return

    try {
      const parsedUser = JSON.parse(savedSession)
      setCurrentUser(parsedUser)
      setPage('home')
    } catch (error) {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  const adminStats = [
    { label: 'Revenue', value: '$24,580', trend: '+18.2%', progress: 82, tone: 'up' },
    { label: 'Orders', value: '1,284', trend: '+9.4%', progress: 68, tone: 'up' },
    { label: 'Visitors', value: '8,640', trend: '+12.1%', progress: 76, tone: 'up' },
    { label: 'Conversion', value: '4.8%', trend: '+1.3%', progress: 48, tone: 'up' },
  ]

  const chartData = [42, 58, 49, 72, 68, 88, 96]
  const salesData = [18, 26, 22, 34, 38, 42, 58]
  const trafficData = [55, 63, 71, 68, 76, 81, 90]

  const [orders, setOrders] = useState([
    { id: '#1042', customer: 'Aisha K.', total: 189.99, status: 'Paid' },
    { id: '#1043', customer: 'Derrick M.', total: 129.0, status: 'Processing' },
    { id: '#1044', customer: 'Priya S.', total: 89.5, status: 'Shipped' },
    { id: '#1045', customer: 'Noah T.', total: 299.99, status: 'Paid' },
  ])

  const inventory = products.map((product) => ({
    name: product.name,
    stock: product.stock ?? 10,
    price: `$${product.price.toFixed(2)}`,
  }))

  const categories = [
    { id: 1, name: 'Running', itemCount: 18, color: 'purple' },
    { id: 2, name: 'Lifestyle', itemCount: 24, color: 'pink' },
    { id: 3, name: 'Hiking', itemCount: 16, color: 'green' },
    { id: 4, name: 'Training', itemCount: 12, color: 'blue' },
  ]

  const addToCart = (product, quantity = 1, selectedItemSize = selectedSize || product.sizes?.[0], selectedItemColor = selectedColor || product.color) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.size === selectedItemSize && item.color === selectedItemColor,
      )

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        }
        return updatedCart
      }

      return [
        ...prevCart,
        {
          ...product,
          quantity,
          size: selectedItemSize || product.sizes?.[0],
          color: selectedItemColor || product.color,
        },
      ]
    })

    setToast(`${product.name} added to cart`)

    setTimeout(() => {
      setToast('')
    }, 1800)
  }

  const updateCartQuantity = (itemIndex, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item, index) => {
          if (index !== itemIndex) return item

          const nextQuantity = item.quantity + delta
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null
        })
        .filter(Boolean),
    )
  }

  const removeFromCart = (itemIndex) => {
    setCart((prevCart) => prevCart.filter((_, index) => index !== itemIndex))
    setToast('Item removed from cart')

    setTimeout(() => {
      setToast('')
    }, 1800)
  }

  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id)

      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id)
      }

      return [...prevWishlist, product]
    })

    const isInWishlist = wishlist.some((item) => item.id === product.id)
    setToast(isInWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`)

    setTimeout(() => {
      setToast('')
    }, 1800)
  }

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setToast('Please enter a promo code.')
      setTimeout(() => setToast(''), 1800)
      return
    }

    if (promoCode.toUpperCase() === 'FITFOOT10') {
      setPromoApplied(true)
      setToast('Promo code applied successfully.')
    } else {
      setPromoApplied(false)
      setToast('Invalid promo code.')
    }

    setTimeout(() => {
      setToast('')
    }, 1800)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    if (!productForm.name || !productForm.price) {
      setMessage('Please fill in the product name and price.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productForm.name,
          price: Number(productForm.price),
          color: productForm.color,
          stock: Number(productForm.stock) || 10,
          image_url: productForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
          description: `${productForm.name} premium footwear for everyday performance.`,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product.')
      }

      const createdProduct = {
        ...data,
        id: data.id || Date.now(),
        image: data.image_url || productForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        availableColors: [productForm.color, 'purple', 'blue'],
        sizes: ['6', '7', '8', '9', '10'],
      }

      setProducts((prevProducts) => [createdProduct, ...prevProducts])
      setProductForm({ name: '', price: '', color: 'purple', stock: 10, image: '' })
      setShowProductForm(false)
      setToast(`${createdProduct.name} added to catalog`)
      setMessage('Product added successfully.')
    } catch (error) {
      const fallbackProduct = {
        id: Date.now(),
        name: String(productForm.name).trim(),
        price: Number(productForm.price) || 0,
        color: productForm.color || 'purple',
        stock: Number(productForm.stock) || 10,
        image: productForm.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        category: productForm.category || 'Running',
        availableColors: [productForm.color || 'purple', 'blue', 'green'],
        sizes: ['6', '7', '8', '9', '10'],
      }

      setProducts((prevProducts) => [fallbackProduct, ...prevProducts])
      setProductForm({ name: '', price: '', color: 'purple', stock: 10, image: '' })
      setShowProductForm(false)
      setToast(`${fallbackProduct.name} added to catalog`)
      setMessage('Product added successfully in demo mode.')
    }

    setTimeout(() => {
      setToast('')
    }, 1800)
  }

  const handleProductImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setProductForm((prev) => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Failed to delete product.')
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
      setToast('Product removed from catalog')
    } catch (error) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
      setToast('Product removed from catalog')
      setMessage('Product removed successfully in demo mode.')
    }

    setTimeout(() => {
      setToast('')
    }, 1800)
  }

  const advanceOrderStatus = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id !== orderId) return order

        const statusFlow = ['Paid', 'Processing', 'Shipped', 'Delivered']
        const currentIndex = statusFlow.indexOf(order.status)
        const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)]
        return { ...order, status: nextStatus }
      }),
    )
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal > 0 ? 0 : 0
  const discountAmount = promoApplied && subtotal > 0 ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discountAmount

  const getColorKeyForCategory = (categoryName) => {
    const map = {
      Running: 'purple',
      Lifestyle: 'blue',
      Hiking: 'green',
      Training: 'purple',
    }

    return map[categoryName] || 'purple'
  }

  const getCategoryFromColor = (colorName) => {
    const map = {
      purple: 'Running',
      blue: 'Lifestyle',
      green: 'Hiking',
    }

    return map[colorName] || 'Running'
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const productCategory = product.category || getCategoryFromColor(product.color)
    const matchesCategory = categoryFilter === 'All' || productCategory === categoryFilter

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'under100' && product.price < 100) ||
      (priceFilter === '100to150' && product.price >= 100 && product.price <= 150) ||
      (priceFilter === 'over150' && product.price > 150)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, priceFilter, products.length])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)

      if (!response.ok) {
        throw new Error('Products API not available.')
      }

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data)
      }
    } catch (error) {
      console.warn('Using local product data because the backend is unavailable:', error.message)
      setProducts(initialProducts)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`)

      if (!response.ok) {
        throw new Error('Orders API not available.')
      }

      const data = await response.json()
      if (Array.isArray(data)) {
        const mappedOrders = data.map((order) => ({
          id: order.id ? `#${order.id}` : '#000',
          customer: order.customer_name || order.customer || 'Customer',
          total: Number(order.total || 0),
          status: order.status || 'Paid',
        }))

        setOrders(mappedOrders)
      }
    } catch (error) {
      console.warn('Using local order data because the backend is unavailable:', error.message)
    }
  }

  useEffect(() => {
    restoreSession()
    loadProducts()
    loadOrders()
  }, [])

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    if (!loginData.email || !loginData.password) {
      setMessage('Please enter your email and password.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.')
      }

      const user = { ...(data.user || {}), id: data.user?.id ?? data.user?.user_id ?? 1 }
      setCurrentUser(user)
      saveSession(user)
      setMessage(`Welcome back, ${user.name}!`)
      setPage('home')
    } catch (error) {
      const fallbackUser = getDemoUser(loginData.email, loginData.password)

      if (fallbackUser) {
        setCurrentUser(fallbackUser)
        saveSession(fallbackUser)
        setMessage(`Welcome back, ${fallbackUser.name}!`)
        setPage('home')
        return
      }

      setMessage(error.message || 'Login failed.')
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()

    if (!signupData.name || !signupData.email || !signupData.password) {
      setMessage('Please complete all signup fields.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed.')
      }

      const user = {
        ...(data.user || {}),
        id: data.user?.id ?? Date.now(),
        name: data.user?.name || signupData.name,
        email: data.user?.email || signupData.email,
      }

      setCurrentUser(user)
      saveSession(user)
      setMessage(`Account created for ${user.name}!`)
      setPage('home')
    } catch (error) {
      const cleanEmail = String(signupData.email).trim().toLowerCase()
      const existingUser = demoUsers.find((user) => user.email.toLowerCase() === cleanEmail)

      if (existingUser) {
        setMessage('An account with that email already exists.')
        return
      }

      const fallbackUser = {
        id: Date.now(),
        name: String(signupData.name).trim(),
        email: cleanEmail,
        password: String(signupData.password),
        role: 'customer',
      }

      demoUsers.push(fallbackUser)
      setCurrentUser(fallbackUser)
      saveSession(fallbackUser)
      setMessage(`Account created for ${fallbackUser.name}!`)
      setPage('home')
    }
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()

    if (!checkoutData.name || !checkoutData.address || !checkoutData.city || !checkoutData.card) {
      setMessage('Please fill in all checkout details.')
      return
    }

    if (!currentUser?.id) {
      setMessage('Please log in before placing an order.')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          customer_name: checkoutData.name,
          total,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed.')
      }

      const orderNumber = `FF-${data.orderId || Math.floor(1000 + Math.random() * 9000)}`
      setOrders((prevOrders) => [
        {
          id: orderNumber,
          customer: checkoutData.name,
          total: total,
          status: 'Paid',
        },
        ...prevOrders,
      ])

      setOrderConfirmation({
        orderNumber,
        customer: checkoutData.name,
        total,
      })

      setCart([])
      setPromoCode('')
      setPromoApplied(false)
      setCheckoutData({ name: '', address: '', city: '', card: '' })
      setMessage('Order placed successfully!')
      setPage('confirmation')
      setToast('Order confirmed successfully')
      loadOrders()
    } catch (error) {
      const orderNumber = `FF-${Math.floor(1000 + Math.random() * 9000)}`
      setOrders((prevOrders) => [
        {
          id: orderNumber,
          customer: checkoutData.name,
          total: total,
          status: 'Paid',
        },
        ...prevOrders,
      ])

      setOrderConfirmation({
        orderNumber,
        customer: checkoutData.name,
        total,
      })

      setCart([])
      setPromoCode('')
      setPromoApplied(false)
      setCheckoutData({ name: '', address: '', city: '', card: '' })
      setMessage('Order placed successfully in demo mode!')
      setPage('confirmation')
      setToast('Order confirmed successfully')
    }

    setTimeout(() => {
      setToast('')
    }, 2200)
  }

  const logout = () => {
    setPage('login')
    setLoginData({ email: '', password: '' })
    setSignupData({ name: '', email: '', password: '' })
    setCheckoutData({ name: '', address: '', city: '', card: '' })
    setCart([])
    setCurrentUser(null)
    saveSession(null)
    setIsAdminLoggedIn(false)
    setMessage('')
  }

  const renderLogin = () => (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={handleLoginSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              placeholder="Enter your password"
            />
          </label>

          <div className="row">
            <label className="checkbox">
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Sign In</button>
        </form>

        <p className="switch-text">
          Don&apos;t have an account?{' '}
          <button type="button" className="link-button" onClick={() => setPage('signup')}>
            Sign up
          </button>
        </p>

        <p className="switch-text">
          <button type="button" className="link-button" onClick={() => setPage('admin')}>
            Admin Login
          </button>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  )

  const renderSignup = () => (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <p className="subtitle">Create your account</p>

        <form onSubmit={handleSignupSubmit} className="auth-form">
          <label>
            Full Name
            <input
              type="text"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
              placeholder="John Doe"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              placeholder="Create a password"
            />
          </label>

          <button type="submit">Create Account</button>
        </form>

        <p className="switch-text">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={() => setPage('login')}>
            Login
          </button>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  )

  const handleAdminAccess = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminForm.email,
          password: adminForm.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Invalid admin credentials.')
      }

      if (data.user?.role !== 'admin') {
        throw new Error('This account is not an admin account.')
      }

      const user = { ...(data.user || {}), id: data.user?.id ?? 1 }
      setCurrentUser(user)
      saveSession(user)
      setIsAdminLoggedIn(true)
      setPage('admin')
      setMessage('Admin login successful.')
      return
    } catch (error) {
      const fallbackUser = getDemoUser(adminForm.email, adminForm.password)

      if (fallbackUser && fallbackUser.role === 'admin') {
        setCurrentUser(fallbackUser)
        saveSession(fallbackUser)
        setIsAdminLoggedIn(true)
        setPage('admin')
        setMessage('Admin login successful.')
        return
      }

      setMessage(error.message || 'Invalid admin credentials. Use admin@fitfoot.com / admin123')
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()

    if (!newsletterEmail.trim()) {
      setToast('Please enter your email address.')
      setTimeout(() => setToast(''), 1800)
      return
    }

    setToast(`Thanks! ${newsletterEmail} joined the FitFoot list.`)
    setNewsletterEmail('')

    setTimeout(() => {
      setToast('')
    }, 2200)
  }

  const renderHome = () => (
    <div className="home-page">
      {toast && <div className="toast">{toast}</div>}

      <div className="home-shell">
        <header className="topbar">
          <div className="brand-lockup" aria-label="FitFoot ShoeStore brand">
            <div className="brand-mark">F</div>
            <div className="brand-copy">
              <span className="brand-name">FitFoot</span>
              <span className="brand-subtitle">ShoeStore</span>
            </div>
          </div>

          <nav className="nav">
            <button type="button" className="nav-link" onClick={() => setSelectedProduct(null)}>
              Home
            </button>
            <button type="button" className="nav-link" onClick={() => setPage('categories')}>
              Categories
            </button>
            <button type="button" className="nav-link" onClick={() => setPage('about')}>
              About
            </button>
            <button type="button" className="nav-link" onClick={() => setPage('contact')}>
              Contact
            </button>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setIsDarkTheme((prev) => !prev)}
              aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {isDarkTheme ? '☀' : '☾'}
              </span>
            </button>
            <button type="button" className="ghost-btn" onClick={() => setPage('wishlist')}>
              Wishlist ({wishlistCount})
            </button>
            <button type="button" className="ghost-btn" onClick={() => (currentUser ? setPage('home') : setPage('login'))}>
              {currentUser ? currentUser.name?.split(' ')[0] || 'Account' : 'Login'}
            </button>
            <button type="button" className="cart-btn" onClick={() => setPage('cart')}>
              Cart ({cartCount})
            </button>
          </div>
        </header>

        <section className="hero-banner">
          <div>
            <p className="eyebrow">New season drops</p>
            <h1>Step into comfort, speed, and style.</h1>
            <p>Discover premium kicks built for everyday movement and performance.</p>
            <div className="hero-actions">
              <button type="button" className="primary-btn">Shop Shoes</button>
              <button type="button" className="secondary-btn" onClick={logout}>Logout</button>
            </div>
          </div>
        </section>

        <section className="shop-tools">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shoes by name..."
            />
          </div>

          <button type="button" className="filter-toggle" onClick={() => setShowFilters((prev) => !prev)}>
            {showFilters ? 'Hide filters' : 'Advanced filters'}
          </button>

          {showFilters && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>Category</label>
                <div className="chip-group">
                  <button
                    type="button"
                    className={categoryFilter === 'All' ? 'chip active' : 'chip'}
                    onClick={() => setCategoryFilter('All')}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={categoryFilter === category.name ? 'chip active' : 'chip'}
                      onClick={() => setCategoryFilter(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label>Price</label>
                <div className="chip-group">
                  <button
                    type="button"
                    className={priceFilter === 'all' ? 'chip active' : 'chip'}
                    onClick={() => setPriceFilter('all')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={priceFilter === 'under100' ? 'chip active' : 'chip'}
                    onClick={() => setPriceFilter('under100')}
                  >
                    Under $100
                  </button>
                  <button
                    type="button"
                    className={priceFilter === '100to150' ? 'chip active' : 'chip'}
                    onClick={() => setPriceFilter('100to150')}
                  >
                    $100 - $150
                  </button>
                  <button
                    type="button"
                    className={priceFilter === 'over150' ? 'chip active' : 'chip'}
                    onClick={() => setPriceFilter('over150')}
                  >
                    Over $150
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="products">
          {paginatedProducts.length === 0 ? (
            <div className="empty-results">
              <p>No shoes match your search.</p>
            </div>
          ) : (
            paginatedProducts.map((product) => {
              const isWishlisted = wishlist.some((item) => item.id === product.id)

              return (
                <div className="product-card" key={product.id}>
                  <div className={`product-image ${product.color}`}>
                    <img src={product.image} alt={product.name} className="product-card-image" />
                  </div>
                  <span className="product-badge">{product.category || getCategoryFromColor(product.color)}</span>
                  <h3>{product.name}</h3>
                  <p>${product.price.toFixed(2)}</p>
                  <div className="product-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProduct(product)
                        setSelectedColor(product.color)
                        setSelectedSize(product.sizes?.[0] || '8')
                        setDetailQuantity(1)
                      }}
                    >
                      View
                    </button>
                    <button type="button" className="mini-cart-btn" onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                      onClick={() => toggleWishlist(product)}
                    >
                      {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </section>

        {totalPages > 1 && (
          <div className="products-pagination" aria-label="Product pagination">
            <button
              type="button"
              className="page-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={pageNumber === currentPage ? 'page-btn active' : 'page-btn'}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              className="page-btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        <footer className="site-footer">
          <div className="footer-brand-statement">
            <div className="brand-mark">F</div>
            <div>
              <div className="footer-brand">FitFoot ShoeStore</div>
              <p className="footer-tagline">Crafted for movement, built for everyday luxury.</p>
            </div>
          </div>

          <div className="footer-top">
            <div className="footer-brand-wrap">
              <p className="footer-copy">
                We design elevated essentials that help you move harder, walk farther, and look sharper in every stride.
              </p>
            </div>

            <form className="newsletter-block" onSubmit={handleNewsletterSubmit}>
              <label htmlFor="footer-newsletter">Join the FitFoot list</label>
              <div className="newsletter-row">
                <input
                  id="footer-newsletter"
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                />
                <button type="submit" className="newsletter-btn">Join</button>
              </div>
            </form>
          </div>

          <div className="footer-links">
            <button type="button" className="footer-link" onClick={() => setPage('about')}>
              About
            </button>
            <button type="button" className="footer-link" onClick={() => setPage('contact')}>
              Contact
            </button>
            <button type="button" className="footer-link" onClick={() => setPage('categories')}>
              Categories
            </button>
            <button type="button" className="footer-link" onClick={() => setPage('home')}>
              Support
            </button>
          </div>

          <div className="footer-bottom">
            <p>© 2026 FitFoot ShoeStore. All rights reserved.</p>
            <div className="social-links" aria-label="Social links">
              <button type="button" className="social-link" aria-label="Instagram">
                ◌
              </button>
              <button type="button" className="social-link" aria-label="Facebook">
                f
              </button>
              <button type="button" className="social-link" aria-label="X">
                x
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )

  const renderCart = () => (
    <div className="cart-page">
      <div className="cart-shell">
        <header className="cart-header">
          <button type="button" className="back-btn" onClick={() => setPage('home')}>
            ← Back
          </button>
          <h1>Cart</h1>
          <button type="button" className="ghost-btn small-btn" onClick={() => setPage('home')}>
            Continue Shopping
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <button type="button" className="primary-btn" onClick={() => setPage('home')}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div className="cart-item" key={`${item.id}-${index}-${item.size}`}>
                  <div className={`mini-image ${item.color}`}>
                    <img src={item.image} alt={item.name} className="mini-product-image" />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>Size: {item.size} • Color: {item.color}</p>
                    <div className="mini-quantity-controls">
                      <button type="button" onClick={() => updateCartQuantity(index, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(index, 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    <button type="button" className="remove-btn" onClick={() => removeFromCart(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="promo-row">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                />
                <button type="button" className="promo-btn" onClick={applyPromoCode}>Apply</button>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {promoApplied && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button type="button" className="checkout-btn" onClick={() => setPage('checkout')}>
                Checkout
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )

  const renderProduct = () => {
    if (!selectedProduct) return null

    const activeColor = selectedColor || selectedProduct.color
    const activeSize = selectedSize || selectedProduct.sizes?.[0] || '8'

    return (
      <div className="product-page">
        <div className="product-shell">
          <header className="product-header">
            <button type="button" className="back-btn" onClick={() => setSelectedProduct(null)}>
              ← Back
            </button>
            <h1>{selectedProduct.name}</h1>
          </header>

          <div className="product-detail">
            <div className={`product-preview ${activeColor}`}>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-image" />
            </div>
            <div className="product-info">
              <p className="product-tag">Featured Product</p>
              <h2>{selectedProduct.name}</h2>
              <div className="product-price">${selectedProduct.price.toFixed(2)}</div>
              <p className="product-description">
                Built for all-day comfort and confident movement, this premium shoe delivers cushioning,
                breathability, and support for daily wear or training sessions.
              </p>

              <div className="detail-option-group">
                <span className="detail-label">Color</span>
                <div className="swatch-row">
                  {selectedProduct.availableColors?.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={activeColor === color ? 'swatch active' : 'swatch'}
                      data-color={color}
                      onClick={() => {
                        setSelectedColor(color)
                        setSelectedSize(selectedProduct.sizes?.[0] || '8')
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="detail-option-group">
                <span className="detail-label">Size</span>
                <div className="size-row">
                  {selectedProduct.sizes?.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={activeSize === size ? 'size-pill active' : 'size-pill'}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="quantity-row">
                <span className="detail-label">Quantity</span>
                <div className="qty-picker">
                  <button type="button" onClick={() => setDetailQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                  <span>{detailQuantity}</span>
                  <button type="button" onClick={() => setDetailQuantity((prev) => prev + 1)}>+</button>
                </div>
              </div>

              <div className="product-buttons">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => addToCart(selectedProduct, detailQuantity, activeSize, activeColor)}
                >
                  Add to Cart
                </button>
                <button type="button" className="secondary-btn dark" onClick={() => setPage('cart')}>
                  Go to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderCategories = () => (
    <div className="categories-page">
      <div className="categories-shell">
        <header className="categories-header">
          <button type="button" className="back-btn" onClick={() => setPage('home')}>
            ← Back
          </button>
          <h1>Categories</h1>
        </header>

        <div className="categories-hero">
          <span className="shop-badge">Shop by style</span>
          <h2>Find the right pair for every moment.</h2>
        </div>

        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className={`category-banner ${category.color}`} />
              <h3>{category.name}</h3>
              <p>{category.itemCount} items</p>
              <button type="button" className="view-category-btn" onClick={() => setPage('home')}>
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAbout = () => (
    <div className="info-page">
      <div className="info-shell">
        <header className="info-header">
          <button type="button" className="back-btn" onClick={() => setPage('home')}>
            ← Back
          </button>
          <h1>About FitFoot</h1>
        </header>

        <div className="info-hero">
          <span className="info-badge">Built for every stride</span>
          <h2>Comfort-first footwear for modern life.</h2>
        </div>

        <div className="info-grid">
          <div className="info-card highlight-card">
            <h3>Our story</h3>
            <p>
              FitFoot ShoeStore was created for people who want more from their shoes: comfort that lasts,
              energy that moves with them, and a look that fits everyday life.
            </p>
            <p>
              From daily walking to intense training, we curate footwear that blends performance with effortless style.
            </p>
          </div>

          <div className="info-card feature-card">
            <h3>Why customers choose us</h3>
            <ul>
              <li>Premium comfort technology</li>
              <li>Curated styles for every routine</li>
              <li>Trusted quality and fast support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContact = () => (
    <div className="info-page">
      <div className="info-shell">
        <header className="info-header">
          <button type="button" className="back-btn" onClick={() => setPage('home')}>
            ← Back
          </button>
          <h1>Contact Us</h1>
        </header>

        <div className="info-hero contact-hero">
          <span className="info-badge">We’re here to help</span>
          <h2>Talk to our support team.</h2>
        </div>

        <div className="info-grid contact-grid">
          <div className="info-card contact-card">
            <p><strong>Email:</strong> support@fitfoot.com</p>
            <p><strong>Phone:</strong> +94 77 123 4567</p>
            <p><strong>Address:</strong> 24 Street Lane, Colombo, Sri Lanka</p>
            <p><strong>Hours:</strong> Mon - Sat, 9:00 AM - 7:00 PM</p>
          </div>

          <div className="info-card feature-card">
            <h3>Need a quick answer?</h3>
            <p>Our team helps with product questions, order support, returns, and sizing guidance.</p>
            <button type="button" className="primary-btn contact-btn">Send message</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWishlist = () => (
    <div className="wishlist-page">
      <div className="wishlist-shell">
        <header className="wishlist-header">
          <button type="button" className="back-btn" onClick={() => setPage('home')}>
            ← Back
          </button>
          <h1>Wishlist</h1>
        </header>

        {wishlist.length === 0 ? (
          <div className="empty-cart">
            <p>Your wishlist is empty.</p>
            <button type="button" className="primary-btn" onClick={() => setPage('home')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-list">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className={`mini-image ${item.color}`} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                <div className="wishlist-actions">
                  <button type="button" className="mini-cart-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                  <button type="button" className="remove-btn" onClick={() => toggleWishlist(item)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderConfirmation = () => (
    <div className="auth-page">
      <div className="auth-card confirmation-card">
        <h1>Order Confirmed</h1>
        <p className="subtitle">Your purchase is on the way.</p>

        {orderConfirmation && (
          <div className="confirmation-box">
            <p><strong>Order:</strong> {orderConfirmation.orderNumber}</p>
            <p><strong>Customer:</strong> {orderConfirmation.customer}</p>
            <p><strong>Total:</strong> ${orderConfirmation.total.toFixed(2)}</p>
          </div>
        )}

        <button type="button" className="primary-btn" onClick={() => setPage('home')}>
          Continue Shopping
        </button>
      </div>
    </div>
  )

  const renderAdmin = () => {
    if (!isAdminLoggedIn) {
      return (
        <div className="auth-page">
          <div className="auth-card">
            <h1>Admin Login</h1>
            <p className="subtitle">Use secure admin credentials</p>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleAdminAccess()
              }}
              className="auth-form"
            >
              <label>
                Admin Email
                <input
                  type="email"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@fitfoot.com"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="admin123"
                />
              </label>

              <button type="submit">Access Admin Panel</button>
            </form>

            <p className="switch-text">
              <button type="button" className="link-button" onClick={() => setPage('home')}>
                Back to shop
              </button>
            </p>

            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )
    }

    return (
      <div className="admin-page">
        <div className="admin-shell">
        <header className="admin-header">
          <button type="button" className="back-btn" onClick={() => setPage('home')}>
            ← Back
          </button>
          <h1>Admin Dashboard</h1>
          <button type="button" className="ghost-btn small-btn" onClick={() => setPage('home')}>
            View Store
          </button>
        </header>

        <div className="admin-hero">
          <span className="shop-badge">Operations overview</span>
          <h2>Monitor every move of your store.</h2>
        </div>

        <section className="stats-grid">
          {adminStats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-topline">
                <span>{stat.label}</span>
                <small className={`trend-badge ${stat.tone}`}>{stat.trend}</small>
              </div>
              <strong>{stat.value}</strong>
              <div className="mini-progress-bar">
                <span style={{ width: `${stat.progress}%` }} />
              </div>
            </div>
          ))}
        </section>

        <section className="chart-grid">
          <div className="panel-card chart-card">
            <div className="chart-header">
              <h3>Sales Overview</h3>
              <span>Last 7 days</span>
            </div>
            <svg viewBox="0 0 280 120" className="line-chart" aria-label="Sales overview chart">
              <path d="M 0 90 C 30 82, 45 58, 70 65 S 130 35, 150 46 S 220 18, 280 22 L 280 120 L 0 120 Z" className="chart-area" />
              <path d="M 0 90 C 30 82, 45 58, 70 65 S 130 35, 150 46 S 220 18, 280 22" className="chart-line" />
            </svg>
          </div>

          <div className="panel-card chart-card">
            <div className="chart-header">
              <h3>Orders</h3>
              <span>Weekly</span>
            </div>
            <div className="bar-chart" aria-label="Orders bar chart">
              {salesData.map((value, index) => (
                <div key={`${value}-${index}`} className="bar-group">
                  <span className="bar" style={{ height: `${value * 2}px` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card chart-card full-width">
            <div className="chart-header">
              <h3>Traffic</h3>
              <span>Visitors</span>
            </div>
            <div className="traffic-bars" aria-label="Traffic chart">
              {trafficData.map((value, index) => (
                <div key={`${value}-${index}`} className="traffic-item">
                  <span>{value}%</span>
                  <div className="traffic-track">
                    <div className="traffic-fill" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-grid">
          <div className="panel-card">
            <h3>Recent Orders</h3>
            <ul className="order-list">
              {orders.map((order) => (
                <li key={order.id} className="order-row">
                  <div>
                    <strong>{order.id}</strong>
                    <p>{order.customer}</p>
                  </div>
                  <div className="order-meta">
                    <span>${order.total.toFixed(2)}</span>
                    <em>{order.status}</em>
                    <button type="button" className="small-order-btn" onClick={() => advanceOrderStatus(order.id)}>
                      Update status
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel-card">
            <h3>Inventory</h3>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.name}>
                    <td>{item.name}</td>
                    <td>{item.stock}</td>
                    <td>{item.price}</td>
                    <td>
                      <button
                        type="button"
                        className="remove-btn small-action"
                        onClick={() => handleDeleteProduct(products.find((product) => product.name === item.name)?.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel-card admin-panel-actions">
          <h3>Admin Panel</h3>
          {showProductForm ? (
            <form className="admin-product-form" onSubmit={handleAddProduct}>
              <label>
                Product Name
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="New product name"
                />
              </label>

              <label>
                Price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="99.99"
                />
              </label>

              <label>
                Color
                <select
                  value={productForm.color}
                  onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                >
                  <option value="purple">Purple</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                </select>
              </label>

              <label>
                Category
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  <option value="Running">Running</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Hiking">Hiking</option>
                  <option value="Training">Training</option>
                </select>
              </label>

              <label>
                Stock
                <input
                  type="number"
                  min="1"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  placeholder="10"
                />
              </label>

              <label>
                Product Image
                <div className="image-upload-box">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Add Image
                  </button>
                </div>
                {productForm.image && (
                  <img src={productForm.image} alt="Product preview" className="upload-preview" />
                )}
              </label>

              <div className="admin-form-actions">
                <button type="submit" className="primary-btn">Save Shoe</button>
                <button type="button" className="ghost-btn" onClick={() => setShowProductForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-actions">
              <button type="button" className="primary-btn" onClick={() => setShowProductForm(true)}>
                Add Product
              </button>
              <button type="button" className="secondary-btn dark" onClick={() => setPage('home')}>
                Manage Orders
              </button>
              <button type="button" className="ghost-btn" onClick={() => setMessage('Customer list is ready for integration.')}>Customers</button>
            </div>
          )}
        </section>

        {message && <p className="message admin-message">{message}</p>}
      </div>
    </div>
    )
  }

  const renderCheckout = () => (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="checkout-header">
          <button type="button" className="back-btn" onClick={() => setPage('cart')}>
            ← Back
          </button>
          <h1>Checkout</h1>
        </header>

        <div className="checkout-hero">
          <span className="shop-badge">Secure payment</span>
          <h2>Complete your order in a few steps.</h2>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="checkout-form">
          <label>
            Full Name
            <input
              type="text"
              value={checkoutData.name}
              onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })}
              placeholder="John Doe"
            />
          </label>

          <label>
            Address
            <input
              type="text"
              value={checkoutData.address}
              onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
              placeholder="123 Main St"
            />
          </label>

          <label>
            City
            <input
              type="text"
              value={checkoutData.city}
              onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })}
              placeholder="New York"
            />
          </label>

          <label>
            Card Number
            <input
              type="text"
              value={checkoutData.card}
              onChange={(e) => setCheckoutData({ ...checkoutData, card: e.target.value })}
              placeholder="4242 4242 4242 4242"
            />
          </label>

          <div className="checkout-actions">
            <button type="submit" className="checkout-submit">Place Order</button>
          </div>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  )

  const currentThemeClass = isDarkTheme ? 'dark-theme' : 'light-theme'

  if (selectedProduct) return <div className={`app-shell ${currentThemeClass}`}>{renderProduct()}</div>
  if (page === 'categories') return <div className={`app-shell ${currentThemeClass}`}>{renderCategories()}</div>
  if (page === 'about') return <div className={`app-shell ${currentThemeClass}`}>{renderAbout()}</div>
  if (page === 'contact') return <div className={`app-shell ${currentThemeClass}`}>{renderContact()}</div>
  if (page === 'wishlist') return <div className={`app-shell ${currentThemeClass}`}>{renderWishlist()}</div>
  if (page === 'confirmation') return <div className={`app-shell ${currentThemeClass}`}>{renderConfirmation()}</div>
  if (page === 'admin') return <div className={`app-shell ${currentThemeClass}`}>{renderAdmin()}</div>
  if (page === 'signup') return <div className={`app-shell ${currentThemeClass}`}>{renderSignup()}</div>
  if (page === 'cart') return <div className={`app-shell ${currentThemeClass}`}>{renderCart()}</div>
  if (page === 'checkout') return <div className={`app-shell ${currentThemeClass}`}>{renderCheckout()}</div>
  if (page === 'home') return <div className={`app-shell ${currentThemeClass}`}>{renderHome()}</div>
  return <div className={`app-shell ${currentThemeClass}`}>{renderLogin()}</div>
}

export default App
