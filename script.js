document.addEventListener("DOMContentLoaded", () => {
    
    // Elemento para anunciar ações dinâmicas para cegos
    const announcer = document.getElementById("sr-announcer");
    const announceMessage = (message) => {
        announcer.textContent = message;
    };

    // ==========================================
    // 1. GESTÃO DE TEMA COM RETORNO DE ÁUDIO
    // ==========================================
    const toggleThemeCheckbox = document.querySelector('.theme-switch input[type="checkbox"]');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        toggleThemeCheckbox.checked = savedTheme === 'dark';
    }

    toggleThemeCheckbox.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        announceMessage(`Modo escuro ${e.target.checked ? 'ativado' : 'desativado'}.`);
    });

    // ==========================================
    // 2. MODAL ACESSÍVEL (FOCUS TRAP)
    // ==========================================
    const modalElement = document.getElementById("modalInscricao");
    const openModalTriggers = document.querySelectorAll(".cta-button, .btn-contato");
    const closeModalTrigger = document.querySelector(".close-button");
    const interactionForm = document.getElementById("formSustentavel");
    
    let lastActiveElement; // Salva o elemento que chamou o modal para retornar o foco a ele depois

    const openModal = (event) => {
        event.preventDefault();
        lastActiveElement = document.activeElement; // guarda o botão clicado
        
        modalElement.style.display = "block";
        modalElement.setAttribute('aria-hidden', 'false');
        announceMessage("Janela de contato aberta. Digite seus dados.");
        
        // Foca automaticamente no primeiro campo
        document.getElementById("nome").focus();
        document.addEventListener("keydown", trapFocus);
    };

    const closeModal = () => {
        modalElement.style.display = "none";
        modalElement.setAttribute('aria-hidden', 'true');
        document.removeEventListener("keydown", trapFocus);
        announceMessage("Janela de contato fechada.");
        
        if (lastActiveElement) lastActiveElement.focus(); // Retorna o foco do teclado
    };

    // Prende o Tab dentro do modal para o usuário não se perder no fundo
    const trapFocus = (e) => {
        if (e.key === 'Escape') { closeModal(); return; }
        if (e.key !== 'Tab') return;

        const focusableElements = modalElement.querySelectorAll('input, button');
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstEl) { lastEl.focus(); e.preventDefault(); }
        } else {
            if (document.activeElement === lastEl) { firstEl.focus(); e.preventDefault(); }
        }
    };

    openModalTriggers.forEach(trigger => trigger.addEventListener("click", openModal));
    closeModalTrigger.addEventListener("click", closeModal);
    
    window.addEventListener("click", (e) => {
        if (e.target === modalElement) closeModal();
    });

    interactionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        alert(`Obrigado pelo contato, ${nome}! Em breve retornaremos.`);
        announceMessage("Formulário enviado com sucesso!");
        interactionForm.reset();
        closeModal();
    });

    // ==========================================
    // 3. ANIMAÇÃO DE REVELAÇÃO (Respeitando Preferência de Redução de Movimento)
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal");
    
    // Verifica se o usuário prefere não ver animações pesadas (Acessibilidade Cognitiva/Motora)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add("active"));
    } else {
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                if (elementTop < windowHeight - 80) {
                    el.classList.add("active");
                }
            });
        };
        window.addEventListener("scroll", revealOnScroll);
        revealOnScroll();
    }
});
