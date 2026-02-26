/**
 * ============================================
 * UTILIDADES - FUNÇÕES REUTILIZÁVEIS
 * ============================================
 * 
 * Funções helper para facilitar operações
 * comuns como timeout, validação, etc.
 */

import CONFIG from './config.js';

// ============================================
// REQUISIÇÕES COM TIMEOUT
// ============================================

/**
 * Executa uma promise com timeout
 * @param {Promise} promise - Promise a executar
 * @param {Number} ms - Tempo de timeout em ms (padrão: CONFIG.timing.requestTimeout)
 * @returns {Promise}
 */
export const withTimeout = (promise, ms = CONFIG.timing.requestTimeout) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error(`⏱️ Timeout na requisição (${ms}ms)`)),
                ms
            )
        ),
    ]);
};

// ============================================
// VALIDAÇÃO
// ============================================

/**
 * Valida um endereço de e-mail
 * @param {String} email - E-mail a validar
 * @returns {Boolean}
 */
export const isValidEmail = (email) => {
    return CONFIG.validation.emailRegex.test(String(email).toLowerCase());
};

/**
 * Valida uma URL
 * @param {String} url - URL a validar
 * @returns {Boolean}
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Valida comprimento de string
 * @param {String} str - String a validar
 * @param {Number} min - Comprimento mínimo
 * @param {Number} max - Comprimento máximo
 * @returns {Boolean}
 */
export const isValidLength = (str, min = 1, max = 999) => {
    const len = String(str).trim().length;
    return len >= min && len <= max;
};

/**
 * Valida um objeto de formulário
 * @param {Object} formData - Dados do formulário
 * @param {Array} requiredFields - Campos obrigatórios
 * @returns {Object} { isValid: Boolean, errors: [] }
 */
export const validateForm = (formData, requiredFields = []) => {
    const errors = [];

    requiredFields.forEach((field) => {
        const value = formData[field];
        if (!value || (typeof value === 'string' && !value.trim())) {
            errors.push(`${field} é obrigatório`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// ============================================
// MANIPULAÇÃO DE DADOS
// ============================================

/**
 * Debounce para funções
 * @param {Function} func - Função a debounce
 * @param {Number} ms - Tempo em ms (padrão: CONFIG.timing.debounceDelay)
 * @returns {Function}
 */
export const debounce = (func, ms = CONFIG.timing.debounceDelay) => {
    let timeoutId;
    return function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), ms);
    };
};

/**
 * Cria uma cópia profunda de um objeto
 * @param {Object} obj - Objeto a copiar
 * @returns {Object}
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove campos específicos de um objeto
 * @param {Object} obj - Objeto
 * @param {Array} fieldsToRemove - Campos a remover
 * @returns {Object}
 */
export const omit = (obj, fieldsToRemove = []) => {
    const result = { ...obj };
    fieldsToRemove.forEach((field) => delete result[field]);
    return result;
};

/**
 * Seleciona campos específicos de um objeto
 * @param {Object} obj - Objeto
 * @param {Array} fieldsToKeep - Campos a manter
 * @returns {Object}
 */
export const pick = (obj, fieldsToKeep = []) => {
    const result = {};
    fieldsToKeep.forEach((field) => {
        if (field in obj) {
            result[field] = obj[field];
        }
    });
    return result;
};

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata uma data para locale string
 * @param {String|Date} date - Data a formatar
 * @param {String} locale - Locale (padrão: 'pt-BR')
 * @returns {String}
 */
export const formatDate = (date, locale = 'pt-BR') => {
    try {
        return new Date(date).toLocaleDateString(locale);
    } catch {
        return 'Data inválida';
    }
};

/**
 * Formata uma data e hora para locale string
 * @param {String|Date} date - Data a formatar
 * @param {String} locale - Locale (padrão: 'pt-BR')
 * @returns {String}
 */
export const formatDateTime = (date, locale = 'pt-BR') => {
    try {
        return new Date(date).toLocaleString(locale);
    } catch {
        return 'Data/hora inválida';
    }
};

/**
 * Sanitiza string para evitar XSS
 * @param {String} str - String a sanitizar
 * @returns {String}
 */
export const sanitizeString = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// ============================================
// LOGGING
// ============================================

/**
 * Log prefix para console
 */
const logPrefix = (type) => {
    const prefixes = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        debug: '🐛',
    };
    return prefixes[type] || '📝';
};

/**
 * Log com tipo
 * @param {String} type - Tipo: success, error, warning, info, debug
 * @param {String} message - Mensagem
 * @param {Any} data - Dados opcionais
 */
export const log = (type = 'info', message = '', data = null) => {
    const isDev = CONFIG.debug.enabled;
    const prefix = logPrefix(type);

    if (isDev) {
        console.log(`${prefix} ${message}`, data || '');
    }
};

// ============================================
// TRATAMENTO DE ERROS
// ============================================

/**
 * Extrai mensagem de erro
 * @param {Error|Object|String} error - Erro
 * @returns {String}
 */
export const getErrorMessage = (error) => {
    if (typeof error === 'string') {
        return error;
    }
    if (error?.message) {
        return error.message;
    }
    if (error?.error?.message) {
        return error.error.message;
    }
    return 'Erro desconhecido. Tente novamente.';
};

/**
 * Trata erro e retorna info estruturada
 * @param {Error|Object|String} error - Erro
 * @param {String} context - Contexto do erro
 * @returns {Object} { message: String, context: String, timestamp: Date }
 */
export const handleError = (error, context = 'Operação') => {
    const message = getErrorMessage(error);
    const errorInfo = {
        message,
        context,
        timestamp: new Date(),
    };

    log('error', `${context}: ${message}`, error);

    return errorInfo;
};

// ============================================
// ASYNC/AWAIT HELPERS
// ============================================

/**
 * Aguarda por um tempo
 * @param {Number} ms - Milissegundos
 * @returns {Promise}
 */
export const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Tenta executar algo com retry
 * @param {Function} fn - Função async
 * @param {Number} maxRetries - Max tentativas (padrão: CONFIG.database.maxRetries)
 * @param {Number} delayMs - Delay entre tentativas (padrão: 1000ms)
 * @returns {Promise}
 */
export const withRetry = async (
    fn,
    maxRetries = CONFIG.database.maxRetries,
    delayMs = 1000
) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                await delay(delayMs);
            }
        }
    }

    throw lastError;
};

export default {
    withTimeout,
    isValidEmail,
    isValidUrl,
    isValidLength,
    validateForm,
    debounce,
    deepClone,
    omit,
    pick,
    formatDate,
    formatDateTime,
    sanitizeString,
    log,
    getErrorMessage,
    handleError,
    delay,
    withRetry,
};
