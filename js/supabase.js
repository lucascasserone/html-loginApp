/**
 * ============================================
 * CLIENTE SUPABASE
 * ============================================
 * 
 * Instância centralizada do cliente Supabase
 * com wrapper de funções comuns.
 */

import CONFIG from './config.js';
import { withTimeout, log, getErrorMessage } from './utils.js';

// Aqui você pode adicionar a verificação se o Supabase está carregado
// Para agora, assumimos que window.supabase está disponível via CDN

let supabaseClient = null;

/**
 * Inicializa o cliente Supabase
 * @returns {Object} - Cliente Supabase
 */
export const initSupabase = () => {
    if (supabaseClient) {
        return supabaseClient;
    }

    if (!window.supabase) {
        throw new Error('❌ Biblioteca Supabase não carregada. Verifique o script src.');
    }

    supabaseClient = window.supabase.createClient(
        CONFIG.supabase.url,
        CONFIG.supabase.key
    );

    log('success', 'Cliente Supabase inicializado');
    return supabaseClient;
};

/**
 * Obtém a instância do cliente Supabase
 * @returns {Object}
 */
export const getSupabaseClient = () => {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
};

// ============================================
// AUTENTICAÇÃO
// ============================================

/**
 * Faz login com email e senha
 * @param {String} email
 * @param {String} password
 * @returns {Promise}
 */
export const signIn = async (email, password) => {
    const client = getSupabaseClient();
    return withTimeout(
        client.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        })
    );
};

/**
 * Faz logout
 * @returns {Promise}
 */
export const signOut = async () => {
    const client = getSupabaseClient();
    return withTimeout(client.auth.signOut());
};

/**
 * Obtém sessão atual
 * @returns {Promise}
 */
export const getSession = async () => {
    const client = getSupabaseClient();
    return withTimeout(client.auth.getSession());
};

/**
 * Recupera senha
 * @param {String} email
 * @param {String} redirectUrl
 * @returns {Promise}
 */
export const resetPassword = async (email, redirectUrl) => {
    const client = getSupabaseClient();
    return withTimeout(
        client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: redirectUrl,
        })
    );
};

/**
 * Atualiza senha
 * @param {String} newPassword
 * @returns {Promise}
 */
export const updatePassword = async (newPassword) => {
    const client = getSupabaseClient();
    return withTimeout(client.auth.updateUser({ password: newPassword }));
};

/**
 * Registra listener de mudanças de auth
 * @param {Function} callback - Função callback
 */
export const onAuthStateChange = (callback) => {
    const client = getSupabaseClient();
    return client.auth.onAuthStateChange(callback);
};

// ============================================
// OPERAÇÕES DE BANCO DE DADOS
// ============================================

/**
 * Busca registros de uma tabela
 * @param {String} table - Nome da tabela
 * @param {Object} options - Opções (select, filter, order, limit)
 * @returns {Promise}
 */
export const fetch = async (table, options = {}) => {
    const client = getSupabaseClient();
    const { select = '*', filter = null, order = null, limit = null } = options;

    let query = client.from(table).select(select);

    if (filter) {
        const { field, op, value } = filter;
        query = query[op](field, value);
    }

    if (order) {
        const { field, ascending = true } = order;
        query = query.order(field, { ascending });
    }

    if (limit) {
        query = query.limit(limit);
    }

    return withTimeout(query);
};

/**
 * Insere um registro
 * @param {String} table - Nome da tabela
 * @param {Object} data - Dados a inserir
 * @returns {Promise}
 */
export const insert = async (table, data) => {
    const client = getSupabaseClient();
    return withTimeout(client.from(table).insert([data]));
};

/**
 * Insere múltiplos registros
 * @param {String} table - Nome da tabela
 * @param {Array} dataArray - Array de dados
 * @returns {Promise}
 */
export const insertMany = async (table, dataArray) => {
    const client = getSupabaseClient();
    return withTimeout(client.from(table).insert(dataArray));
};

/**
 * Atualiza um registro
 * @param {String} table - Nome da tabela
 * @param {Object} data - Dados a atualizar
 * @param {Object} match - Condição de match { field, value }
 * @returns {Promise}
 */
export const update = async (table, data, match) => {
    const client = getSupabaseClient();
    const { field, value } = match;
    return withTimeout(client.from(table).update(data).eq(field, value));
};

/**
 * Deleta um registro
 * @param {String} table - Nome da tabela
 * @param {Object} match - Condição de match { field, value }
 * @returns {Promise}
 */
export const remove = async (table, match) => {
    const client = getSupabaseClient();
    const { field, value } = match;
    return withTimeout(client.from(table).delete().eq(field, value));
};

// ============================================
// HELPERS ESPECÍFICOS DA APLICAÇÃO
// ============================================

/**
 * Busca perfil de usuário
 * @param {String} email
 * @returns {Promise}
 */
export const fetchUserProfile = async (email) => {
    return fetch(CONFIG.database.tables.users, {
        filter: { field: 'email', op: 'ilike', value: email },
    });
};

/**
 * Busca todos os relatórios
 * @returns {Promise}
 */
export const fetchReports = async () => {
    return fetch(CONFIG.database.tables.reports, {
        order: { field: 'nome', ascending: true },
    });
};

/**
 * Busca todos os usuários
 * @returns {Promise}
 */
export const fetchUsers = async () => {
    return fetch(CONFIG.database.tables.users, {
        order: { field: 'nome_completo', ascending: true },
    });
};

/**
 * Busca todas as notícias
 * @returns {Promise}
 */
export const fetchNews = async () => {
    return fetch(CONFIG.database.tables.news, {
        order: { field: 'created_at', ascending: false },
    });
};

/**
 * Busca logs de auditoria
 * @returns {Promise}
 */
export const fetchAuditLogs = async () => {
    return fetch(CONFIG.database.tables.auditLogs, {
        order: { field: 'created_at', ascending: false },
        limit: CONFIG.database.auditLogLimit,
    });
};

/**
 * Registra ação no log de auditoria
 * @param {String} adminEmail
 * @param {String} acao
 * @param {String} alvo
 * @returns {Promise}
 */
export const logAudit = async (adminEmail, acao, alvo) => {
    return insert(CONFIG.database.tables.auditLogs, {
        admin_email: adminEmail,
        acao,
        alvo,
    });
};

export default {
    initSupabase,
    getSupabaseClient,
    signIn,
    signOut,
    getSession,
    resetPassword,
    updatePassword,
    onAuthStateChange,
    fetch,
    insert,
    insertMany,
    update,
    remove,
    fetchUserProfile,
    fetchReports,
    fetchUsers,
    fetchNews,
    fetchAuditLogs,
    logAudit,
};
