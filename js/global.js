/**
 * GLOBAL SCRIPT - Mecânica BMI (Portal Multipágina Premium)
 * Script leve para interações da UI
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Efeito Glassmorphism do Header (Solidifica ao Rolar)
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Validar status inicial
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // 2. Menu Mobile Simples
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Trocar icone (hamburguer para fechar)
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    // 3. Sistema de Animação de Scroll (Scroll Reveal Premium)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.12 // Dispara quando 12% do elemento é visível
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Deixa a animação definitiva (não pisca se subir a tela)
            }
        });
    }, observerOptions);

    // Dicionário Automático: 
    // Captura as classes que já existem no site e aplica o efeito sutil 
    // sem precisarmos sujar as 6 páginas HTML com dezenas de marcações
    const revealTargets = [
        { selector: '.section-header', fx: 'reveal-up', stagger: false },
        { selector: '.module-card', fx: 'reveal-up', stagger: true },
        { selector: '.founder-card', fx: 'reveal-up', stagger: true },
        { selector: '.rank-card', fx: 'reveal-scale', stagger: true },
        { selector: '.rule-block', fx: 'reveal-left', stagger: true },
        { selector: '.article-box', fx: 'reveal-up', stagger: false },
        { selector: '.partner-card', fx: 'reveal-up', stagger: true },
        { selector: '.req-card', fx: 'reveal-up', stagger: true },
        { selector: '.benef-card', fx: 'reveal-scale', stagger: true },
        { selector: '.step-item', fx: 'reveal-left', stagger: true },
        { selector: '.form-panel', fx: 'reveal-up', stagger: false },
        { selector: '.radio-container', fx: 'reveal-up', stagger: false },
        { selector: '.gallery-item', fx: 'reveal-scale', stagger: true },
        { selector: '.server-card', fx: 'reveal-left', stagger: false },
        { selector: '.server-gallery', fx: 'reveal-right', stagger: false }
    ];

    revealTargets.forEach(target => {
        const elements = document.querySelectorAll(target.selector);
        elements.forEach((el, index) => {
            // Injeta a base inicial (opacidade zero + pos distorcida)
            el.classList.add('reveal', target.fx);
            
            // Cria um delay de transição se for item de grade (Efeito cascata elegante)
            if (target.stagger) {
                el.style.transitionDelay = `${(index % 4) * 0.12}s`;
            }
            // Manda o observador monitorar
            scrollObserver.observe(el);
        });
    });

    // 4. Novas Animações Universais Manuais Solicitadas
    const universalObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    document.querySelectorAll('.animate-fade, .animate-slide, .animate-on-scroll').forEach(el => {
        universalObserver.observe(el);
    });

});
