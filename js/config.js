/**
 * ============================================
 * CONFIGURAÇÃO GLOBAL DA APLICAÇÃO
 * ============================================
 * 
 * Este arquivo centraliza todas as constantes
 * e configurações da aplicação Heuriskien.
 * 
 * Usa variáveis de ambiente quando disponível
 * por variáveis window quando em browser.
 */

export const CONFIG = {
    // ============================================
    // SUPABASE
    // ============================================
    supabase: {
        url: import.meta.env?.VITE_SUPABASE_URL || window.__SUPABASE_URL || 'https://nqdlxiyzsxkntypyzkie.supabase.co',
        key: import.meta.env?.VITE_SUPABASE_ANON_KEY || window.__SUPABASE_KEY || '',
    },

    // ============================================
    // APLICAÇÃO
    // ============================================
    app: {
        name: import.meta.env?.VITE_APP_NAME || 'Heuriskien',
        version: import.meta.env?.VITE_APP_VERSION || '11.9',
        environment: import.meta.env?.VITE_ENVIRONMENT || 'production',
    },

    // ============================================
    // TIMEOUTS & DELAYS
    // ============================================
    timing: {
        requestTimeout: parseInt(import.meta.env?.VITE_API_TIMEOUT || '10000', 10),
        debounceDelay: parseInt(import.meta.env?.VITE_DEBOUNCE_DELAY || '300', 10),
        transitionDuration: 500,
    },

    // ============================================
    // AUTENTICAÇÃO
    // ============================================
    auth: {
        adminRoles: ['CEO', 'Diretor'],
        minPasswordLength: 6,
        sessionTimeout: 3600000, // 1 hora
    },

    // ============================================
    // BANCO DE DADOS
    // ============================================
    database: {
        tables: {
            users: 'acessTable',
            reports: 'reportsTable',
            news: 'newsTable',
            auditLogs: 'audit_logs',
        },
        maxRetries: 3,
        pageSize: 50,
        auditLogLimit: 100,
    },

    // ============================================
    // VALIDAÇÃO
    // ============================================
    validation: {
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        urlRegex: new RegExp('^https?://', 'i'),
        minNameLength: 2,
        maxDescriptionLength: 500,
    },

    // ============================================
    // DEBUGING
    // ============================================
    debug: {
        enabled: import.meta.env?.VITE_ENVIRONMENT !== 'production',
        logRequests: true,
        logTimings: true,
    },
};

// ============================================
// VALIDAÇÃO DE CONFIGURAÇÃO
// ============================================
if (!CONFIG.supabase.url || !CONFIG.supabase.key) {
    console.warn('⚠️  ATENÇÃO: Credenciais do Supabase não configuradas.');
    console.warn('   Copie .env.example para .env.local e preencha os valores.');
}

export default CONFIG;
