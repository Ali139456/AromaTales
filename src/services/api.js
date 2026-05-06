// API Base URL - uses environment variable in production, /api in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getCart = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (sessionId, productId, quantity = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });
    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (sessionId, itemId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update cart item' }));
      throw new Error(errorData.message || 'Failed to update cart item');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (sessionId, itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to remove item from cart' }));
      throw new Error(errorData.message || 'Failed to remove item from cart');
    }
    return await response.json();
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

// Order API
export const createOrder = async (orderData, accessToken) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }))
      throw new Error(errorData.message || 'Failed to create order')
    }
    return await response.json()
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const fetchMyOrders = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/orders/me`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to load orders')
  }
  return response.json()
}

const adminAuth = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json'
})

export const fetchAdminProducts = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    headers: adminAuth(accessToken)
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to load products')
  }
  return response.json()
}

export const createAdminProduct = async (accessToken, payload) => {
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    headers: adminAuth(accessToken),
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to create product')
  }
  return response.json()
}

export const updateAdminProduct = async (accessToken, id, payload) => {
  const response = await fetch(`${API_BASE_URL}/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: adminAuth(accessToken),
    body: JSON.stringify(payload)
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to update product')
  }
  return response.json()
}

export const deleteAdminProduct = async (accessToken, id) => {
  const response = await fetch(`${API_BASE_URL}/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to delete product')
  }
  return response.json()
}

export const uploadAdminProductImage = async (accessToken, file) => {
  const body = new FormData()
  body.append('image', file)
  const response = await fetch(`${API_BASE_URL}/admin/upload-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Upload failed')
  }
  return response.json()
}

// Contact form API
export const sendContactMessage = async (contactData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
      throw new Error(errorData.message || 'Failed to send message');
    }
    return await response.json();
  } catch (error) {
    console.error('Error sending contact message:', error);
    throw error;
  }
};

// Generate a simple session ID for cart
export const getSessionId = () => {
  let sessionId = localStorage.getItem('aroma_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('aroma_session_id', sessionId);
  }
  return sessionId;
};
