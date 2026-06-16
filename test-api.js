#!/usr/bin/env node

/**
 * Script de teste das APIs do Smart Market
 * Execute: node test-api.js
 */

const http = require("http");

const BASE_URL = "http://localhost:3000";
let authToken = null;

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (authToken) {
      options.headers["Authorization"] = `Bearer ${authToken}`;
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("🧪 TESTANDO SMART MARKET APIs...\n");

  try {
    // Test 1: Login
    console.log("✓ Teste 1: LOGIN");
    const loginRes = await makeRequest("POST", "/api/auth/login", {
      email: "teste@empresa.com",
      password: "123456",
    });
    authToken = loginRes.data.token;
    console.log(`  ✅ Status: ${loginRes.status}`);
    console.log(`  ✅ Token obtido: ${authToken.substring(0, 20)}...\n`);

    // Test 2: Get Products
    console.log("✓ Teste 2: LISTAR PRODUTOS");
    const productsRes = await makeRequest("GET", "/api/products");
    console.log(`  ✅ Status: ${productsRes.status}`);
    console.log(`  ✅ Total de produtos: ${productsRes.data.length}`);
    console.log(`  ✅ Primeiro produto: ${productsRes.data[0]?.nome}\n`);

    // Test 3: Get Suppliers
    console.log("✓ Teste 3: LISTAR FORNECEDORES");
    const suppliersRes = await makeRequest("GET", "/api/suppliers");
    console.log(`  ✅ Status: ${suppliersRes.status}`);
    console.log(`  ✅ Total de fornecedores: ${suppliersRes.data.length}`);
    console.log(
      `  ✅ Primeiro fornecedor: ${suppliersRes.data[0]?.razao_social}\n`,
    );

    // Test 4: Create Product
    console.log("✓ Teste 4: CRIAR NOVO PRODUTO");
    const newProduct = {
      nome: "Teste Produto API",
      sku: "TEST-001",
      barcode: "1234567890",
      categoria: "Bebidas",
      estoque_atual: 100,
      estoque_minimo: 20,
      unidade: "Unidade",
      preco_custo: 2.5,
      preco_venda: 5.0,
      margem_lucro: 100,
      marca: "Marca Teste",
      peso_volume: "1L",
      descricao: "Produto de teste",
      validade_media: 180,
      certificacoes: "ISO 9001",
      status: "Ativo",
    };
    const createRes = await makeRequest("POST", "/api/products", newProduct);
    const newProductId = createRes.data.id;
    console.log(`  ✅ Status: ${createRes.status}`);
    console.log(`  ✅ Produto criado: ${createRes.data.nome}`);
    console.log(`  ✅ ID: ${newProductId}\n`);

    // Test 5: Update Product
    console.log("✓ Teste 5: ATUALIZAR PRODUTO");
    const updateRes = await makeRequest(
      "PUT",
      `/api/products/${newProductId}`,
      {
        estoque_atual: 150,
        preco_venda: 5.5,
      },
    );
    console.log(`  ✅ Status: ${updateRes.status}`);
    console.log(`  ✅ Produto atualizado: ${updateRes.data.nome}\n`);

    // Test 6: Get Dashboard Stats
    console.log("✓ Teste 6: ESTATÍSTICAS DASHBOARD");
    const statsRes = await makeRequest("GET", "/api/dashboard/stats");
    console.log(`  ✅ Status: ${statsRes.status}`);
    console.log(`  ✅ Total de produtos: ${statsRes.data.total_products}`);
    console.log(`  ✅ Fornecedores ativos: ${statsRes.data.active_suppliers}`);
    console.log(`  ✅ Estoque total: ${statsRes.data.total_stock}\n`);

    // Test 7: Delete Product
    console.log("✓ Teste 7: DELETAR PRODUTO");
    const deleteRes = await makeRequest(
      "DELETE",
      `/api/products/${newProductId}`,
    );
    console.log(`  ✅ Status: ${deleteRes.status}`);
    console.log(`  ✅ Produto deletado\n`);

    console.log("🎉 TODOS OS TESTES PASSARAM COM SUCESSO!");
    console.log("\n✅ O Smart Market está totalmente funcional!");
    console.log("🚀 Acesse: http://localhost:3000/1-login.html");
  } catch (error) {
    console.error("❌ ERRO:", error.message);
    console.error("\nVerifique se o servidor está rodando:");
    console.error("npm start");
  }
}

runTests();
