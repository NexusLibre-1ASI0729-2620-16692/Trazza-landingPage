
document.addEventListener('DOMContentLoaded', () => {
    const NAV_BREAKPOINT = 1240;

    
    const burger = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (burger && navMenu) {
        
        const t = (key, fallback) => (window.TrazzaI18n ? window.TrazzaI18n.t(key) : fallback);
        const updateBurgerLabel = () => {
            const open = navMenu.classList.contains('is-open');
            burger.setAttribute('aria-label', open ? t('menu.close', 'Close menu') : t('menu.open', 'Open menu'));
        };

        const setMenu = (open) => {
            navMenu.classList.toggle('is-open', open);
            burger.classList.toggle('is-open', open);
            burger.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('menu-open', open);
            updateBurgerLabel();
        };

        document.addEventListener('trazza:langchange', updateBurgerLabel);
        updateBurgerLabel();

        burger.addEventListener('click', () => setMenu(!navMenu.classList.contains('is-open')));
        navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
        window.addEventListener('resize', () => {
            if (window.innerWidth > NAV_BREAKPOINT) setMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenu(false);
        });
    }

    
    document.querySelectorAll('[data-segmented]').forEach((group) => {
        const buttons = group.querySelectorAll('[data-panel]');
        const panels = document.querySelectorAll(`[data-panel-group="${group.dataset.segmented}"]`);

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                buttons.forEach((b) => {
                    const active = b === btn;
                    b.classList.toggle('is-active', active);
                    b.setAttribute('aria-selected', String(active));
                });
                panels.forEach((panel) => {
                    panel.hidden = panel.dataset.panelId !== btn.dataset.panel;
                });
            });
        });
    });

   
    document.querySelectorAll('.toggle-container').forEach((container) => {
        const buttons = container.querySelectorAll('.toggle-btn');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    });

    
    const role = new URLSearchParams(window.location.search).get('role');
    if (role === 'merchant') {
        document.getElementById('btn-emprendedor')?.click();
    }

    
    const slider = document.querySelector('[data-slider]');
    const dots = document.querySelectorAll('[data-slider-dot]');

    if (slider && dots.length) {
        const cards = slider.children;
        const step = () => (cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : slider.clientWidth);

        slider.addEventListener('scroll', () => {
            const index = Math.round(slider.scrollLeft / step());
            dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        }, { passive: true });

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => slider.scrollTo({ left: i * step(), behavior: 'smooth' }));
        });
    }

    
    const videoBox = document.querySelector('.video-box');
    if (videoBox) {
        videoBox.addEventListener('click', () => {
            const src = videoBox.dataset.videoSrc;
            if (!src || videoBox.querySelector('iframe')) return;
            const iframe = document.createElement('iframe');
            iframe.src = `${src}${src.includes('?') ? '&' : '?'}autoplay=1`;
            iframe.title = 'Trazza – About the product';
            iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
            iframe.allowFullscreen = true;
            videoBox.appendChild(iframe);
        });
    }
});
