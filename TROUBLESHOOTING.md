# Troubleshooting & Best Practices

> Guia rápido de resolução de problemas e práticas recomendadas

## 🔧 Problemas Comuns

### Login não funciona

**Sintoma:** Erro "Invalid API key" ou "CORS policy"

**Soluções:**
1. **Limpe cache do navegador** (Ctrl+Shift+Del)
2. **Verifique URLs Supabase:**
   - Abra F12 → Console
   - Procure pela URL na execução
   - Certifique-se que é `https://` (não `http://`)
3. **Valide credenciais:**
   - Chave anon vs service_role (use anon!)
   - Verificar em Supabase → Settings → API
4. **CORS Policy:**
   - Vá em Supabase → Settings → API
   - Adicione sua URL GitHub Pages em CORS origins
   - Exemplo: `https://seu-username.github.io`

**Teste local:**
```javascript
// Cole no console F12:
fetch('https://seu-url.supabase.co/rest/v1/acessTable?select=*', {
    headers: {
        'apikey': 'sua-chave-aqui',
        'Authorization': 'Bearer sua-chave-aqui'
    }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

---

### Dados não carregam

**Sintoma:** Page fica branca ou tabelas vazias

**Soluções:**
1. **Abra Console (F12)** e procure por erros vermelho
2. **Verifique RLS Policies:**
   - Supabase → Tables → RLS Policies (Disabled/Enabled?)
   - Se habilitadas, valide que permitem leitura público
3. **Confirme tabelas existem:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```
4. **Teste query direto:**
   - SQL Editor no Supabase
   - Copie: `SELECT * FROM acessTable LIMIT 5;`
   - Deve retornar dados

---

### Botões não respondem

**Sintoma:** Clica mas nada acontece

**Soluções:**
1. **Verifique console:** `F12 → Console` → há erros?
2. **Limpe localStorage:**
   ```javascript
   // Console:
   localStorage.clear()
   location.reload()
   ```
3. **Desabilite extensions:**
   - Adblockers podem bloquear requisições
   - Teste em navegação privada
4. **Supa base está online?**
   - Status: https://status.supabase.com

---

### Atualizações não aparecem

**Sintoma:** Cria um registro mas não aparece lista

**Soluções:**
1. **Cache pode estar stale:**
   ```javascript
   // Force refresh no console:
   localStorage.removeItem('cache_users')
   location.reload()
   ```
2. **Aguarde sincronização:**
   - Cada abinha carrega dados em background
   - Clique "Sincronizar" na auditoria
3. **Verifique permissões:**
   - Usuário é admin? (CEO/Diretor)
   - Tem SELECT + INSERT em tabelas?

---

### Performance lenta

**Sintoma:** Site demora para carregar ou responder

**Soluções:**
1. **Limpe cache:**
   - F12 → Application → Clear site data
2. **Reduza volume de dados:**
   - Auditoria limita a 100 itens (OK)
   - Nº de tabs abertas (feche abas)
3. **Otimize queries:**
   - Não carrega todas colunas desnecessárias
   - Usa `select('id, nome, email')` ao invés de `*`
4. **Network throttling:**
   - F12 → Network → simule 4G
   - Se lento também aí, é a query

---

### Tema não persiste

**Sintoma:** Tema volta ao padrão após refresh

**Soluções:**
1. **localStorage pode estar desabilitado:**
   - Settings → Cookies → permitir?
2. **Tente manualmente:**
   ```javascript
   localStorage.setItem('heuriskien_theme', 'dark')
   location.reload()
   ```

---

## 📋 Checklist - Antes de Usar em Produção

- [ ] Supabase credenciais atualizadas
- [ ] CORS origin adicionado
- [ ] RLS Policies configuradas (ou desabilitadas se pública)
- [ ] Teste login com usuário real
- [ ] Teste criar/editar/deletar dados
- [ ] Tema persiste após refresh
- [ ] Links de relatórios funcionam
- [ ] Formulários validam inputs
- [ ] Mensagens de erro são claras
- [ ] Responsividade OK em mobile

---

## 💡 Best Practices

### Para Desenvolvedores

**1. Use cache intelligently:**
```javascript
// Boa prática: verifica cache + atualiza em background
const cached = localStorage.getItem('cache_reports');
if (cached) {
    this.reportsList = JSON.parse(cached);
    // User vê dados rápido
}
// Enquanto isso, pega dados frescos:
loadFromSupabase()
    .then(fresh => {
        this.reportsList = fresh;
        localStorage.setItem('cache_reports', JSON.stringify(fresh));
    })
```

**2. Sempre validar inputs:**
```javascript
// Sempre:
if (!email || !isValidEmail(email)) {
    Swal.fire('Erro', 'Email inválido', 'error');
    return;
}
```

**3. Use loading states:**
```javascript
// Nunca deixe user sem feedback
this.isLoading = true;
try {
    await doSomething();
} finally {
    this.isLoading = false;
}
```

**4. Trate erros com clareza:**
```javascript
catch (err) {
    const msg = err.message.includes('unique violation')
        ? 'Este e-mail já existe'
        : err.message || 'Erro desconhecido';
    console.error(err);
    Swal.fire('Erro', msg, 'error');
}
```

### Para Usuários

**1. Limpe cache regularmente:**
- Menu → F12 → Application → Clear site data
- Especialmente se dados não atualizam

**2. Use senhas fortes:**
- 8+ caracteres
- Mix de números, letras, símbolos
- Nunca compartilhe

**3. Relatórios ficam lentos?**
- Pode ser o PowerBI link
- Teste abrindo direto no BI

**4. Auditoria para admin:**
- Sincronize logs regularmente
- Logs ficam no máximo 100 registros (FIFO)

---

## 🔐 Segurança

**Credenciais Supabase (PÚBLICA é OK):**
- Chave anon é pública por design
- Segurança vem de RLS Policies
- NEVER usar service_role em frontend!

**RLS Policies:**
```sql
-- Exemplo: usuários só veem seus próprios dados
CREATE POLICY user_self_view ON public.acessTable
    FOR SELECT USING (email = auth.jwt() ->> 'email');
```

**GitHub Pages + CORS:**
- URLs públicas no CORS é necessário
- Não exponha dados sensíveis no frontend
- Use server-side queries para dados críticos

---

## 📞 Escalação

**Se persiste erro:**
1. Salve screenshot + console error
2. Teste em navegador diferente
3. Reporte em: Issues do repositório

**Informações úteis ao reportar:**
- Navegador e versão
- URL exata onde erro ocorre
- Erro exato no console
- Passos para reproduzir

---

## 🎯 Performance Targets

| Métrica | Alvo |
|---------|------|
| First Load | < 2s |
| Data Load | < 1s |
| Search (Filter) | < 300ms |
| Modal Open | < 500ms |
| Button Response | < 100ms |

Se acima desses targets, abra issue para otimização.

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Alpine.js Docs](https://alpinejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [SweetAlert2](https://sweetalert2.github.io)

