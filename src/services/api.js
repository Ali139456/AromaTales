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
    // Ensure itemId is a clean string
    let cleanItemId = itemId
    if (itemId && typeof itemId === 'object') {
      cleanItemId = itemId.toString()
    }
    if (cleanItemId && typeof cleanItemId === 'string') {
      // Remove any trailing colon and numbers (e.g., "id:1" -> "id")
      cleanItemId = cleanItemId.split(':')[0]
    }
    
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/items/${encodeURIComponent(cleanItemId)}`, {
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
    // Ensure itemId is a clean string
    let cleanItemId = itemId
    if (itemId && typeof itemId === 'object') {
      cleanItemId = itemId.toString()
    }
    if (cleanItemId && typeof cleanItemId === 'string') {
      // Remove any trailing colon and numbers (e.g., "id:1" -> "id")
      cleanItemId = cleanItemId.split(':')[0]
    }
    
    const response = await fetch(`${API_BASE_URL}/cart/${sessionId}/items/${encodeURIComponent(cleanItemId)}`, {
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
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create order' }));
      throw new Error(errorData.message || 'Failed to create order');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
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
