# 📚 Autopilot Hub - Documentação API

## 🚀 Bem-vindo à Documentação Interativa

Esta é a documentação completa da API do **Autopilot Hub**. Todos os endpoints estão documentados em português e prontos para testes interativos.

---

## 📖 Como Acessar a Documentação

### Opção 1: Swagger UI (Recomendado)
Abra o arquivo `swagger-ui.html` no seu navegador para acessar a interface interativa com:
- ✅ **Try It Out**: Teste os endpoints diretamente
- 📊 **Documentação Completa**: Todos os parâmetros e respostas
- 🔐 **Autenticação JWT**: Incorporada para testes

```bash
# Abra no navegador:
file:///seu/caminho/swagger-ui.html
```

### Opção 2: Editor OpenAPI
Você pode visualizar o arquivo `swagger.yaml` em:
- [Swagger Editor](https://editor.swagger.io/) (Cole o conteúdo do swagger.yaml)
- [Stoplight](https://stoplight.io/) (Importe o arquivo)

---

## 🔑 Autenticação

### Obter Token JWT

Todos os endpoints (exceto login) requerem um token JWT.

1. **Faça Login** (POST `/api/auth/login`):
   ```json
   {
     "email": "usuario@avenida.com.br",
     "password": "senhaSegura123"
   }
   ```

2. **Copie o token** retornado:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": { "id": "...", "email": "...", "nome_completo": "..." }
   }
   ```

3. **Use no Swagger UI**:
   - Clique no botão "Authorize" (cadeado) no topo
   - Cole seu token no campo
   - Todos os endpoints agora usarão sua autenticação

### No seu Código:
```javascript
const response = await fetch('/api/reports', {
  headers: {
    'Authorization': 'Bearer seu_token_aqui',
    'Content-Type': 'application/json'
  }
});
```

---

## 📡 Endpoints Principais

### 📊 Relatórios
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/reports` | Listar todos os relatórios |
| POST | `/api/reports` | Criar novo relatório (admin) |
| GET | `/api/reports/{id}` | Obter detalhes de um relatório |
| PUT | `/api/reports/{id}` | Atualizar relatório (admin) |
| DELETE | `/api/reports/{id}` | Deletar relatório (admin) |

### 👥 Usuários
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Listar usuários (admin) |
| POST | `/api/users` | Criar novo usuário (admin) |

### 📋 Auditoria
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/audit` | Obter logs de auditoria (admin) |

### 📰 Notícias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/news` | Listar notícias do sistema |
| POST | `/api/news` | Criar nova notícia (admin) |

---

## 🧪 Exemplos de Uso

### 1️⃣ Listar Relatórios
```bash
curl -X GET "http://localhost:3000/api/reports?limit=10" \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json"
```

**Resposta:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "nome": "Relatório de Vendas",
      "descricao": "Análise de vendas mensal",
      "area": "Vendas",
      "link": "https://powerbi.com/...",
      "criado_em": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### 2️⃣ Criar Novo Relatório
```bash
curl -X POST "http://localhost:3000/api/reports" \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Novo Relatório",
    "descricao": "Análise de dados 2024",
    "area": "Financeiro",
    "link": "https://powerbi.com/novo"
  }'
```

### 3️⃣ Obter Logs de Auditoria
```bash
curl -X GET "http://localhost:3000/api/audit?action=CRIAR&limit=50" \
  -H "Authorization: Bearer seu_token" \
  -H "Content-Type: application/json"
```

---

## 🛡️ Códigos de Erro

| Código | Mensagem | Solução |
|--------|----------|--------|
| **401** | Não autorizado | Faça login e obtenha um token válido |
| **403** | Sem permissão | Apenas administradores podem fazer isso |
| **404** | Não encontrado | O recurso não existe |
| **400** | Dados inválidos | Verifique os parâmetros enviados |
| **429** | Muitas requisições | Aguarde alguns minutos e tente novamente |
| **500** | Erro do servidor | Contate o suporte |

---

## 🔐 Informações de Segurança

- ✅ Todos os endpoints utilizam **JWT Authentication**
- ✅ Senhas são armazenadas com **bcrypt** (hash)
- ✅ Logs de auditoria registram **todas as ações** de modificação
- ✅ Apenas administradores podem **criar/editar/deletar** recursos
- ⚠️ **Nunca** compartilhe seu token JWT com outras pessoas

---

## 📝 Permissões por Função

### Usuário Regular
- ✅ Visualizar relatórios
- ✅ Visualizar notícias do sistema
- ✅ Atualizar seu próprio perfil
- ❌ Criar/editar/deletar relatórios
- ❌ Gerenciar usuários

### Administrador
- ✅ Acesso completo a todos os endpoints
- ✅ Criar/editar/deletar relatórios
- ✅ Criar/editar/deletar usuários
- ✅ Visualizar logs de auditoria completos
- ✅ Criar notícias do sistema

---

## 🚦 Rate Limiting

Para evitar abuso, implementamos rate limiting:
- **Login**: 5 tentativas a cada 15 minutos
- **Outros endpoints**: 100 requisições por minuto
- Resposta: `429 Too Many Requests`

---

## 💡 Dicas Úteis

1. **Teste no Swagger UI primeiro** - Valide seus requests antes de integrar no código
2. **Use filtros** - Todos os GET endpoints suportam `limit` e `offset` para paginação
3. **Estude os modelos** - Veja a estrutura exata dos dados em "Schemas"
4. **Copie exemplos** - O Swagger gera code snippets automáticamente

---

## 📞 Suporte

Para dúvidas ou problemas:
- 📧 Email: [dev@avenida.com.br](mailto:dev@avenida.com.br)
- 🐛 Reporte bugs: [Issues](https://github.com/seu-repo/issues)
- 📚 Documentação técnica: Veja `swagger.yaml`

---

## 📄 Licença

MIT License © 2024 Grupo Avenida

---

**Última atualização**: Dezembro 2024 | Versão: 1.0.0
