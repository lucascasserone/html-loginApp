/**
 * ============================================
 * APLICAÇÃO PRINCIPAL - Alpine.js Store
 * ============================================
 * 
 * Lógica central da aplicação com Alpine.js
 * Gerencia estado, eventos e integrações.
 */

import CONFIG from './config.js';
import * as db from './supabase.js';
import {
    withTimeout,
    isValidEmail,
    isValidUrl,
    isValidLength,
    validateForm,
    deepClone,
    omit,
    log,
    handleError,
    formatDateTime,
} from './utils.js';

/**
 * Store principal da aplicação
 */
export function systemCore() {
    return {
        // ============================================
        // ESTADO GERAL
        // ============================================
        initialized: false,
        view: 'login',
        tab: 'news',
        theme: localStorage.getItem('heuriskien_theme') || 'dark',
        userEmail: '',
        isAdmin: false,
        currentUserData: {},

        // ============================================
        // FORMULÁRIOS
        // ============================================
        email: '',
        password: '',
        newPassword: '',
        formReport: { nome: '', area: '', link: '', descricao: '' },
        formUser: { nome_completo: '', email: '', cargo: '', setor: '' },

        // ============================================
        // DADOS
        // ============================================
        reportsList: [],
        usersList: [],
        auditLogs: [],
        newsList: [],

        // ============================================
        // BUSCA E FILTROS
        // ============================================
        searchQueryUsers: '',
        searchQueryReports: '',
        searchQueryAudit: '',
        filterAuditAction: '',

        // ============================================
        // UI STATE
        // ============================================
        showReportModal: false,
        showUserModal: false,
        showResetPasswordModal: false,
        modalMode: 'create',

        // ============================================
        // WATCHERS
        // ============================================
        watch: {
            theme(newTheme) {
                localStorage.setItem('heuriskien_theme', newTheme);
            },
        },

        // ============================================
        // COMPUTED PROPERTIES
        // ============================================

        get filteredAuditLogs() {
            const q = this.searchQueryAudit.toLowerCase().trim();
            const action = this.filterAuditAction;

            return this.auditLogs.filter((log) => {
                const acao = String(log.acao || '').toLowerCase();
                const alvo = String(log.alvo || '').toLowerCase();
                const admin = String(log.admin_email || '').toLowerCase();

                const matchesText =
                    !q || acao.includes(q) || alvo.includes(q) || admin.includes(q);
                const matchesAction = !action || acao.includes(action.toLowerCase());

                return matchesText && matchesAction;
            });
        },

        get filteredUsers() {
            const q = this.searchQueryUsers.toLowerCase().trim();
            return q
                ? this.usersList.filter(
                    (u) =>
                        u.nome_completo?.toLowerCase().includes(q) ||
                        u.email?.toLowerCase().includes(q)
                )
                : this.usersList;
        },

        get filteredReports() {
            const q = this.searchQueryReports.toLowerCase().trim();
            return q
                ? this.reportsList.filter(
                    (r) =>
                        r.nome?.toLowerCase().includes(q) ||
                        r.area?.toLowerCase().includes(q)
                )
                : this.reportsList;
        },

        // ============================================
        // CICLO DE VIDA
        // ============================================

        /**
         * Inicializa a aplicação
         */
        async init() {
            try {
                log('info', '🚀 Iniciando aplicação Heuriskien');

                // Inicializa Supabase
                db.initSupabase();

                // Registra listener de auth
                db.onAuthStateChange(async (event, session) => {
                    log('info', `🔐 Evento Auth: ${event}`);
                    if (
                        event === 'PASSWORD_RECOVERY' ||
                        window.location.hash.includes('type=recovery')
                    ) {
                        this.view = 'dashboard';
                        this.showResetPasswordModal = true;
                    }
                });

                // Verifica sessão existente
                const { data: { session }, error } = await db.getSession();

                if (error) throw error;

                if (session) {
                    this.userEmail = session.user.email;
                    await this.loadInitialData();
                    this.view = 'dashboard';
                    log('success', '✅ Usuário autenticado');
                } else {
                    this.view = 'login';
                    log('info', 'ℹ️  Usuário anônimo');
                }
            } catch (err) {
                const { message } = handleError(err, 'Inicialização');
                Swal.fire('Erro', message, 'error');
                this.view = 'login';
            } finally {
                this.initialized = true;
            }
        },

        /**
         * Carrega dados iniciais do dashboard
         */
        async loadInitialData() {
            try {
                // Perfil do usuário
                const { data: profile, error: profileError } = await db.fetchUserProfile(
                    this.userEmail
                );

                if (profileError && profileError.code !== 'PGRST116') {
                    throw profileError;
                }

                if (profile) {
                    this.currentUserData = profile;
                    this.isAdmin = CONFIG.auth.adminRoles.includes(profile.cargo);
                }

                // Carrega dados em paralelo
                const [
                    { data: reports, error: reportsError },
                    { data: users, error: usersError },
                    { data: news, error: newsError },
                ] = await Promise.all([
                    db.fetchReports(),
                    db.fetchUsers(),
                    db.fetchNews(),
                ]);

                if (reportsError) throw reportsError;
                if (usersError) throw usersError;
                if (newsError) throw newsError;

                this.reportsList = reports || [];
                this.usersList = users || [];
                this.newsList = news || [];

                // Logs de auditoria apenas para admins
                if (this.isAdmin) {
                    await this.loadAuditLogs();
                }

                log('success', '✅ Dados carregados com sucesso');
            } catch (err) {
                const { message } = handleError(err, 'Carregamento de dados');
                Swal.fire('Aviso', message, 'warning');
            }
        },

        /**
         * Carrega logs de auditoria
         */
        async loadAuditLogs() {
            try {
                const { data, error } = await db.fetchAuditLogs();
                if (error) throw error;
                this.auditLogs = data || [];
                log('success', `✅ ${data?.length || 0} logs carregados`);
            } catch (err) {
                handleError(err, 'Carregamento de logs de auditoria');
                this.auditLogs = [];
            }
        },

        // ============================================
        // AUTENTICAÇÃO
        // ============================================

        /**
         * Faz login
         */
        async handleLogin() {
            try {
                // Validação
                if (!this.email || !this.password) {
                    Swal.fire('Aviso', 'Preencha todos os campos.', 'warning');
                    return;
                }

                if (!isValidEmail(this.email)) {
                    Swal.fire('Aviso', 'E-mail inválido.', 'warning');
                    return;
                }

                log('info', `🔒 Tentando login: ${this.email}`);

                const { error } = await db.signIn(this.email, this.password);

                if (error) {
                    throw error;
                }

                window.location.reload();
            } catch (err) {
                const { message } = handleError(err, 'Login');
                Swal.fire('Erro de Autenticação', message, 'error');
            }
        },

        /**
         * Recupera senha
         */
        async recoverPassword() {
            const { value: email } = await Swal.fire({
                title: 'Recuperar Senha',
                input: 'email',
                inputPlaceholder: 'E-mail corporativo',
                inputValidator: (value) => {
                    if (!value) return 'E-mail é obrigatório';
                    if (!isValidEmail(value)) return 'E-mail inválido';
                },
                background: '#030712',
                color: '#fff',
                confirmButtonText: 'Enviar Link',
            });

            if (email) {
                try {
                    log('info', `📧 Enviando link de recuperação: ${email}`);

                    const { error } = await db.resetPassword(
                        email,
                        window.location.origin + window.location.pathname
                    );

                    if (error) {
                        throw error;
                    }

                    Swal.fire(
                        'Sucesso!',
                        'Verifique sua caixa de entrada e clique no link.',
                        'success'
                    );
                } catch (err) {
                    const { message } = handleError(err, 'Recuperação de senha');
                    Swal.fire('Erro', message, 'error');
                }
            }
        },

        /**
         * Atualiza senha
         */
        async updatePassword() {
            try {
                if (!this.newPassword || this.newPassword.length < CONFIG.auth.minPasswordLength) {
                    Swal.fire(
                        'Aviso',
                        `Senha deve ter no mínimo ${CONFIG.auth.minPasswordLength} caracteres.`,
                        'warning'
                    );
                    return;
                }

                log('info', '🔐 Atualizando senha');

                const { error } = await db.updatePassword(this.newPassword);

                if (error) {
                    throw error;
                }

                await Swal.fire(
                    'Sucesso!',
                    'Senha alterada. Faça login novamente.',
                    'success'
                );

                this.showResetPasswordModal = false;
                this.newPassword = '';
                await this.handleLogout();
            } catch (err) {
                const { message } = handleError(err, 'Atualização de senha');
                Swal.fire('Erro', message, 'error');
            }
        },

        /**
         * Faz logout
         */
        async handleLogout() {
            try {
                log('info', '👋 Fazendo logout');
                await db.signOut();
                window.location.reload();
            } catch (err) {
                handleError(err, 'Logout');
                window.location.reload();
            }
        },

        // ============================================
        // MODAL - RELATÓRIOS
        // ============================================

        /**
         * Abre modal de relatório
         */
        openReportModal(mode, report = null) {
            this.modalMode = mode;
            this.formReport = report ? deepClone(report) : {
                nome: '',
                area: '',
                link: '',
                descricao: '',
            };
            this.showReportModal = true;
        },

        /**
         * Salva relatório
         */
        async saveReport() {
            try {
                // Validação
                const validation = validateForm(this.formReport, [
                    'nome',
                    'area',
                    'link',
                ]);

                if (!validation.isValid) {
                    Swal.fire(
                        'Validação',
                        `Erros:\n${validation.errors.join('\n')}`,
                        'warning'
                    );
                    return;
                }

                if (!isValidUrl(this.formReport.link)) {
                    Swal.fire('Aviso', 'URL do Power BI inválida.', 'warning');
                    return;
                }

                if (
                    this.formReport.descricao &&
                    !isValidLength(
                        this.formReport.descricao,
                        0,
                        CONFIG.validation.maxDescriptionLength
                    )
                ) {
                    Swal.fire(
                        'Aviso',
                        `Descrição não pode exceder ${CONFIG.validation.maxDescriptionLength} caracteres.`,
                        'warning'
                    );
                    return;
                }

                let payload = deepClone(this.formReport);
                let res;

                if (this.modalMode === 'create') {
                    delete payload.id;
                    res = await db.insert(CONFIG.database.tables.reports, payload);
                    if (!res.error) {
                        await db.logAudit(this.userEmail, 'CRIAR_REPORT', `Report: ${payload.nome}`);
                    }
                } else {
                    const { id, ...updateData } = payload;
                    res = await db.update(
                        CONFIG.database.tables.reports,
                        updateData,
                        { field: 'id', value: id }
                    );
                    if (!res.error) {
                        await db.logAudit(this.userEmail, 'EDITAR_REPORT', `Report: ${payload.nome}`);
                    }
                }

                if (!res.error) {
                    this.showReportModal = false;
                    await this.loadInitialData();
                    Swal.fire('Sucesso!', 'Relatório salvo.', 'success');
                    log('success', `✅ Relatório salvo: ${payload.nome}`);
                } else {
                    throw res.error;
                }
            } catch (err) {
                const { message } = handleError(err, 'Salvar relatório');
                Swal.fire('Erro', message, 'error');
            }
        },

        /**
         * Deleta relatório
         */
        async deleteReport(id) {
            try {
                const confirm = await Swal.fire({
                    title: 'Confirmar exclusão?',
                    text: 'Esta ação não pode ser desfeita.',
                    icon: 'warning',
                    showCancelButton: true,
                    background: '#030712',
                    color: '#fff',
                    confirmButtonColor: '#dc2626',
                });

                if (confirm.isConfirmed) {
                    const { error } = await db.remove(CONFIG.database.tables.reports, {
                        field: 'id',
                        value: id,
                    });

                    if (!error) {
                        await db.logAudit(this.userEmail, 'DELETAR_REPORT', `ID: ${id}`);
                        await this.loadInitialData();
                        Swal.fire('Sucesso!', 'Relatório removido.', 'success');
                        log('success', `✅ Relatório deletado: ${id}`);
                    } else {
                        throw error;
                    }
                }
            } catch (err) {
                const { message } = handleError(err, 'Deletar relatório');
                Swal.fire('Erro', message, 'error');
            }
        },

        // ============================================
        // MODAL - USUÁRIOS
        // ============================================

        /**
         * Abre modal de usuário
         */
        openUserModal(mode, user = null) {
            this.modalMode = mode;
            this.formUser = user
                ? deepClone(user)
                : {
                    nome_completo: '',
                    email: '',
                    cargo: '',
                    setor: '',
                };
            this.showUserModal = true;
        },

        /**
         * Salva usuário
         */
        async saveUser() {
            try {
                // Validação
                const validation = validateForm(this.formUser, [
                    'nome_completo',
                    'email',
                    'cargo',
                ]);

                if (!validation.isValid) {
                    Swal.fire(
                        'Validação',
                        `Erros:\n${validation.errors.join('\n')}`,
                        'warning'
                    );
                    return;
                }

                if (!isValidEmail(this.formUser.email)) {
                    Swal.fire('Aviso', 'E-mail inválido.', 'warning');
                    return;
                }

                let payload = deepClone(this.formUser);
                let res =
                    this.modalMode === 'create'
                        ? await db.insert(CONFIG.database.tables.users, payload)
                        : await db.update(
                            CONFIG.database.tables.users,
                            payload,
                            { field: 'email', value: payload.email }
                        );

                if (!res.error) {
                    await db.logAudit(
                        this.userEmail,
                        this.modalMode === 'create' ? 'NOVO_USUARIO' : 'EDITAR_USUARIO',
                        payload.email
                    );
                    this.showUserModal = false;
                    await this.loadInitialData();
                    Swal.fire('Sucesso!', 'Usuário salvo.', 'success');
                    log('success', `✅ Usuário salvo: ${payload.email}`);
                } else {
                    throw res.error;
                }
            } catch (err) {
                const { message } = handleError(err, 'Salvar usuário');
                Swal.fire('Erro', message, 'error');
            }
        },

        /**
         * Deleta usuário
         */
        async deleteUser(email) {
            try {
                const confirm = await Swal.fire({
                    title: 'Confirmar remoção?',
                    text: 'Esta ação não pode ser desfeita.',
                    icon: 'warning',
                    showCancelButton: true,
                    background: '#030712',
                    color: '#fff',
                    confirmButtonColor: '#dc2626',
                });

                if (confirm.isConfirmed) {
                    const { error } = await db.remove(CONFIG.database.tables.users, {
                        field: 'email',
                        value: email,
                    });

                    if (!error) {
                        await db.logAudit(this.userEmail, 'DELETAR_USUARIO', email);
                        await this.loadInitialData();
                        Swal.fire('Sucesso!', 'Usuário removido.', 'success');
                        log('success', `✅ Usuário deletado: ${email}`);
                    } else {
                        throw error;
                    }
                }
            } catch (err) {
                const { message } = handleError(err, 'Deletar usuário');
                Swal.fire('Erro', message, 'error');
            }
        },
    };
}

export default systemCore;
