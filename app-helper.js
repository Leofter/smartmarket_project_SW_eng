// Smart Market API Helper
const API_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let userEmail = localStorage.getItem('userEmail');

// Função para fazer login
async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      authToken = data.token;
      userEmail = data.user.email;
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('userEmail', userEmail);
      return { success: true, data };
    }
    return { 
      success: false, 
      error: data.error,
      errorType: data.errorType
    };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, error: 'Erro ao conectar com servidor' };
  }
}

// Função para fazer logout
function logout() {
  authToken = null;
  userEmail = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
}

// Verificar se está autenticado
function isAuthenticated() {
  return !!authToken;
}

// ============= PRODUTOS =============
async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

async function getProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

async function createProduct(productData) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('Erro ao criar produto');
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
}

async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) throw new Error('Erro ao atualizar produto');
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) throw new Error('Erro ao deletar produto');
    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
}

// ============= FORNECEDORES =============
async function getSuppliers() {
  try {
    const response = await fetch(`${API_URL}/suppliers`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return [];
  }
}

async function getSupplier(id) {
  try {
    const response = await fetch(`${API_URL}/suppliers/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    return null;
  }
}

async function createSupplier(supplierData) {
  try {
    const response = await fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(supplierData)
    });

    if (!response.ok) throw new Error('Erro ao criar fornecedor');
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    throw error;
  }
}

async function updateSupplier(id, supplierData) {
  try {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(supplierData)
    });

    if (!response.ok) throw new Error('Erro ao atualizar fornecedor');
    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    throw error;
  }
}

async function deleteSupplier(id) {
  try {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (!response.ok) throw new Error('Erro ao deletar fornecedor');
    return await response.json();
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    throw error;
  }
}

// ============= ESTOQUE =============
async function getStockMovements() {
  try {
    const response = await fetch(`${API_URL}/stock/movements`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    return [];
  }
}

async function createStockMovement(movementData) {
  try {
    const response = await fetch(`${API_URL}/stock/movements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(movementData)
    });

    if (!response.ok) throw new Error('Erro ao registrar movimentação');
    return await response.json();
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    throw error;
  }
}

// ============= COMPRAS =============
async function getPurchases() {
  try {
    const response = await fetch(`${API_URL}/purchases`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
}

async function createPurchase(purchaseData) {
  try {
    const response = await fetch(`${API_URL}/purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(purchaseData)
    });

    if (!response.ok) throw new Error('Erro ao criar pedido');
    return await response.json();
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
}

// ============= DASHBOARD =============
async function getDashboardStats() {
  try {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {};
  }
}

// Função para garantir autenticação
function checkAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/1-login.html';
  }
}

// Formatador de moeda
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Formatador de data
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR');
}
