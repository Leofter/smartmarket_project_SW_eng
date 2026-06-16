const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// Criar pasta data se não existir
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Funções de persistência
const readData = (filename) => {
  const filepath = path.join(dataDir, filename);
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
  } catch (error) {
    console.error(`Erro ao ler ${filename}:`, error);
  }
  return [];
};

const writeData = (filename, data) => {
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

// Dados padrão
const initializeData = () => {
  if (!fs.existsSync(path.join(dataDir, 'products.json'))) {
    writeData('products.json', [
      {
        id: '1',
        sku: 'SKU001',
        nome: 'Coca-Cola 2L',
        barcode: '7898200001234',
        categoria: 'Bebidas',
        estoque_atual: 245,
        estoque_minimo: 50,
        unidade: 'Unidade',
        preco_custo: 3.50,
        preco_venda: 7.50,
        margem_lucro: 114,
        marca: 'Coca-Cola',
        peso_volume: '2L',
        descricao: 'Refrigerante Coca-Cola 2 litros',
        validade_media: 180,
        certificacoes: 'ISO 9001',
        status: 'Ativo',
        data_criacao: new Date().toISOString()
      },
      {
        id: '2',
        sku: 'SKU002',
        nome: 'Iogurte Natural 500g',
        barcode: '7898200001235',
        categoria: 'Laticínios',
        estoque_atual: 89,
        estoque_minimo: 30,
        unidade: 'Unidade',
        preco_custo: 2.80,
        preco_venda: 4.20,
        margem_lucro: 50,
        marca: 'Nestlé',
        peso_volume: '500g',
        descricao: 'Iogurte Natural integral',
        validade_media: 30,
        certificacoes: 'ISO 9001',
        status: 'Ativo',
        data_criacao: new Date().toISOString()
      }
    ]);
  }

  if (!fs.existsSync(path.join(dataDir, 'suppliers.json'))) {
    writeData('suppliers.json', [
      {
        id: '1',
        razao_social: 'BevCorp Ltda',
        cnpj: '12.345.678/0001-90',
        contato_principal: 'João Silva',
        email: 'joao@bevcorp.com',
        telefone: '(11) 3000-0000',
        celular: '(11) 99999-0000',
        rua: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 101',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        categoria_produtos: 'Bebidas',
        lead_time_medio: 3,
        prazo_pagamento: 30,
        forma_pagamento: 'Boleto',
        desconto_padrao: 5,
        confiabilidade_score: 95,
        status: 'Ativo',
        data_criacao: new Date().toISOString()
      },
      {
        id: '2',
        razao_social: 'LactoPure Ltda',
        cnpj: '98.765.432/0001-10',
        contato_principal: 'Maria Santos',
        email: 'maria@lactopure.com',
        telefone: '(11) 3100-0000',
        celular: '(11) 98888-0000',
        rua: 'Av. Principal',
        numero: '456',
        complemento: 'Sala 200',
        cidade: 'Campinas',
        estado: 'SP',
        cep: '13000-000',
        categoria_produtos: 'Laticínios',
        lead_time_medio: 2,
        prazo_pagamento: 15,
        forma_pagamento: 'Transferência',
        desconto_padrao: 8,
        confiabilidade_score: 98,
        status: 'Ativo',
        data_criacao: new Date().toISOString()
      }
    ]);
  }

  if (!fs.existsSync(path.join(dataDir, 'users.json'))) {
    writeData('users.json', []);
  }

  if (!fs.existsSync(path.join(dataDir, 'stock_movements.json'))) {
    writeData('stock_movements.json', []);
  }

  if (!fs.existsSync(path.join(dataDir, 'purchases.json'))) {
    writeData('purchases.json', []);
  }
};

initializeData();

// ============= AUTENTICAÇÃO =============
// Credenciais válidas
const VALID_EMAIL = 'cimatec@gmail.com';
const VALID_PASSWORD = 'cimatec';

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      error: 'Email e senha são obrigatórios' 
    });
  }

  // Verificar se o email existe (válido)
  if (email !== VALID_EMAIL) {
    return res.status(401).json({ 
      success: false,
      error: 'Usuário não existe. Deseja se cadastrar?',
      errorType: 'user_not_found'
    });
  }

  // Verificar se a senha está correta
  if (password !== VALID_PASSWORD) {
    return res.status(401).json({ 
      success: false,
      error: 'Email ou senha incorretos',
      errorType: 'invalid_credentials'
    });
  }

  // Token simples (em produção, usar JWT)
  const token = uuidv4();
  const user = {
    id: uuidv4(),
    email,
    token,
    login_timestamp: new Date().toISOString()
  };

  // Registrar login
  let users = readData('users.json');
  users.push(user);
  writeData('users.json', users);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

// ============= PRODUTOS =============
app.get('/api/products', (req, res) => {
  const products = readData('products.json');
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readData('products.json');
  const newProduct = {
    id: uuidv4(),
    ...req.body,
    data_criacao: new Date().toISOString()
  };
  products.push(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData('products.json');
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  res.json(product);
});

app.put('/api/products/:id', (req, res) => {
  let products = readData('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  products[index] = { ...products[index], ...req.body };
  writeData('products.json', products);
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData('products.json');
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  const deleted = products.splice(index, 1);
  writeData('products.json', products);
  res.json({ success: true, deleted: deleted[0] });
});

// ============= FORNECEDORES =============
app.get('/api/suppliers', (req, res) => {
  const suppliers = readData('suppliers.json');
  res.json(suppliers);
});

app.post('/api/suppliers', (req, res) => {
  const suppliers = readData('suppliers.json');
  const newSupplier = {
    id: uuidv4(),
    ...req.body,
    data_criacao: new Date().toISOString()
  };
  suppliers.push(newSupplier);
  writeData('suppliers.json', suppliers);
  res.status(201).json(newSupplier);
});

app.get('/api/suppliers/:id', (req, res) => {
  const suppliers = readData('suppliers.json');
  const supplier = suppliers.find(s => s.id === req.params.id);
  if (!supplier) {
    return res.status(404).json({ error: 'Fornecedor não encontrado' });
  }
  res.json(supplier);
});

app.put('/api/suppliers/:id', (req, res) => {
  let suppliers = readData('suppliers.json');
  const index = suppliers.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Fornecedor não encontrado' });
  }
  suppliers[index] = { ...suppliers[index], ...req.body };
  writeData('suppliers.json', suppliers);
  res.json(suppliers[index]);
});

app.delete('/api/suppliers/:id', (req, res) => {
  let suppliers = readData('suppliers.json');
  const index = suppliers.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Fornecedor não encontrado' });
  }
  const deleted = suppliers.splice(index, 1);
  writeData('suppliers.json', suppliers);
  res.json({ success: true, deleted: deleted[0] });
});

// ============= ESTOQUE =============
app.get('/api/stock/movements', (req, res) => {
  const movements = readData('stock_movements.json');
  res.json(movements);
});

app.post('/api/stock/movements', (req, res) => {
  const movements = readData('stock_movements.json');
  const products = readData('products.json');

  const { product_id, type, quantity, notes } = req.body;

  // Atualizar estoque do produto
  const productIndex = products.findIndex(p => p.id === product_id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }

  if (type === 'saida' && products[productIndex].estoque_atual < quantity) {
    return res.status(400).json({ error: 'Estoque insuficiente' });
  }

  if (type === 'entrada') {
    products[productIndex].estoque_atual += quantity;
  } else if (type === 'saida') {
    products[productIndex].estoque_atual -= quantity;
  }

  writeData('products.json', products);

  const movement = {
    id: uuidv4(),
    product_id,
    type,
    quantity,
    notes,
    timestamp: new Date().toISOString()
  };

  movements.push(movement);
  writeData('stock_movements.json', movements);
  res.status(201).json(movement);
});

// ============= PEDIDOS/COMPRAS =============
app.get('/api/purchases', (req, res) => {
  const purchases = readData('purchases.json');
  res.json(purchases);
});

app.post('/api/purchases', (req, res) => {
  const purchases = readData('purchases.json');
  const newPurchase = {
    id: uuidv4(),
    ...req.body,
    status: req.body.status || 'Pendente',
    data_criacao: new Date().toISOString()
  };
  purchases.push(newPurchase);
  writeData('purchases.json', purchases);
  res.status(201).json(newPurchase);
});

app.put('/api/purchases/:id', (req, res) => {
  let purchases = readData('purchases.json');
  const index = purchases.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  purchases[index] = { ...purchases[index], ...req.body };
  writeData('purchases.json', purchases);
  res.json(purchases[index]);
});

// ============= DASHBOARD =============
app.get('/api/dashboard/stats', (req, res) => {
  const products = readData('products.json');
  const suppliers = readData('suppliers.json');
  const purchases = readData('purchases.json');

  const totalProducts = products.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'Ativo').length;
  const totalStock = products.reduce((sum, p) => sum + p.estoque_atual, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.estoque_atual * p.preco_custo), 0);

  res.json({
    total_products: totalProducts,
    active_suppliers: activeSuppliers,
    total_stock: totalStock,
    total_value: totalValue.toFixed(2),
    low_stock_alerts: products.filter(p => p.estoque_atual < p.estoque_minimo).length,
    recent_purchases: purchases.slice(-5)
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n✅ Smart Market Server rodando em http://localhost:${PORT}`);
  console.log(`📂 Dados salvos em: ${dataDir}`);
  console.log(`\n🚀 Acesse: http://localhost:${PORT}/1-login.html\n`);
});
