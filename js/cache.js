/**
 * Cache Manager - Gerencia cache local de dados
 * Otimiza performance reduzindo requisições ao Supabase
 */

const CACHE_CONFIG = {
    PROFILES: { key: 'cache_profiles', ttl: 3600000 }, // 1 hora
    REPORTS: { key: 'cache_reports', ttl: 1800000 },   // 30 min
    USERS: { key: 'cache_users', ttl: 1800000 },       // 30 min
    NEWS: { key: 'cache_news', ttl: 600000 },          // 10 min
    AUDIT_LOGS: { key: 'cache_audit', ttl: 300000 },   // 5 min
};

class CacheManager {
    /**
     * Armazena dados no cache
     * @param {string} type - Tipo de cache (ex: PROFILES, REPORTS)
     * @param {any} data - Dados a armazenar
     */
    static set(type, data) {
        try {
            const config = CACHE_CONFIG[type];
            if (!config) return false;

            const payload = {
                data,
                timestamp: Date.now(),
                expires: Date.now() + config.ttl
            };

            localStorage.setItem(config.key, JSON.stringify(payload));
            console.log(`✅ Cache salvo: ${type}`);
            return true;
        } catch (err) {
            console.error('❌ Erro ao salvar cache:', err);
            return false;
        }
    }

    /**
     * Recupera dados do cache se válidos
     * @param {string} type - Tipo de cache
     * @param {boolean} ignoreExpiry - Ignorar validade
     */
    static get(type, ignoreExpiry = false) {
        try {
            const config = CACHE_CONFIG[type];
            if (!config) return null;

            const cached = localStorage.getItem(config.key);
            if (!cached) return null;

            const payload = JSON.parse(cached);

            // Verifica se expirou
            if (!ignoreExpiry && Date.now() > payload.expires) {
                localStorage.removeItem(config.key);
                console.log(`⏰ Cache expirado: ${type}`);
                return null;
            }

            console.log(`📦 Cache recuperado: ${type}`);
            return payload.data;
        } catch (err) {
            console.error('❌ Erro ao recuperar cache:', err);
            return null;
        }
    }

    /**
     * Remove cache específico
     */
    static remove(type) {
        try {
            const config = CACHE_CONFIG[type];
            if (config) {
                localStorage.removeItem(config.key);
                console.log(`🗑️ Cache removido: ${type}`);
            }
        } catch (err) {
            console.error('❌ Erro ao remover cache:', err);
        }
    }

    /**
     * Limpa todo cache
     */
    static clear() {
        try {
            Object.values(CACHE_CONFIG).forEach(config => {
                localStorage.removeItem(config.key);
            });
            console.log('🗑️ Todo cache removido');
        } catch (err) {
            console.error('❌ Erro ao limpar cache:', err);
        }
    }

    /**
     * Retorna info sobre cache
     */
    static getStats() {
        const stats = {};
        Object.entries(CACHE_CONFIG).forEach(([type, config]) => {
            const cached = localStorage.getItem(config.key);
            if (cached) {
                try {
                    const payload = JSON.parse(cached);
                    const expiresIn = payload.expires - Date.now();
                    stats[type] = {
                        size: cached.length,
                        expiresIn: expiresIn > 0 ? Math.round(expiresIn / 1000) + 's' : 'expirado',
                        timestamp: new Date(payload.timestamp).toLocaleString('pt-BR')
                    };
                } catch {
                    stats[type] = { error: 'Corrupted' };
                }
            }
        });
        return stats;
    }
}

// Opcionalmente, auto-clear expired cache a cada 5min
setInterval(() => {
    Object.keys(CACHE_CONFIG).forEach(type => {
        CacheManager.get(type); // Vai remover se expirado
    });
}, 300000);
