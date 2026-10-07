(function () {
    const STORAGE_KEY = 'trazza-lang';
    const SUPPORTED = ['en', 'es'];

    const es = {
        'meta.title': 'Trazza – Fletes de retorno para Lima',
        'meta.description': 'Trazza conecta a transportistas que regresan con espacio libre con pequeñas y medianas empresas que necesitan enviar mercadería por Lima.',

        'logo.home': 'Inicio de Trazza',
        'nav.how': 'Cómo funciona',
        'nav.carriers': 'Para transportistas',
        'nav.merchants': 'Para comerciantes',
        'nav.plans': 'Planes',
        'nav.testimonials': 'Testimonios',
        'nav.contact': 'Contacto',
        'nav.signin': 'Iniciar sesión',
        'lang.group': 'Idioma',
        'menu.open': 'Abrir menú',
        'menu.close': 'Cerrar menú',

        'how.eyebrow': 'CÓMO FUNCIONA',
        'how.title': 'Cómo funciona Trazza',
        'how.profile': 'Elige tu perfil',
        'how.tabCarriers': 'Para transportistas',
        'how.tabMerchants': 'Para comerciantes',
        'how.c1.title': 'Publica tu ruta de retorno',
        'how.c1.text': 'Cuéntanos dónde termina tu entrega, hacia dónde vas y cuánto espacio te queda.',
        'how.c2.title': 'Recibe cargas compatibles',
        'how.c2.text': 'Mira las cargas en tu camino de regreso con el desvío y la tarifa ofrecida antes de aceptar.',
        'how.c3.title': 'Entrega y recibe calificaciones',
        'how.c3.text': 'Confirma el recojo y la entrega en la app y construye tu reputación con cada viaje.',
        'how.m1.title': 'Publica tu envío',
        'how.m1.text': 'Cuéntanos qué necesitas mover, los puntos de recojo y entrega y el peso aproximado.',
        'how.m2.title': 'Elige un transportista en tu ruta',
        'how.m2.text': 'Mira transportistas verificados que ya van hacia tu destino, con su calificación y la tarifa antes de confirmar.',
        'how.m3.title': 'Sigue y califica',
        'how.m3.text': 'Sigue tu mercadería en vivo y califica al transportista cuando se confirme la entrega.',

        'carriers.eyebrow': 'PARA TRANSPORTISTAS',
        'carriers.title': 'Deja de regresar vacío',
        'carriers.photo': 'Transportista revisando sugerencias de carga en su celular',
        'carriers.f1.title': 'Cargas en tu camino de regreso',
        'carriers.f1.text': 'Solo cargas que encajan con tu ruta y la capacidad de tu vehículo.',
        'carriers.f2.title': 'Conoce tu desvío antes',
        'carriers.f2.text': 'Mira los kilómetros y minutos extra antes de aceptar cualquier carga.',
        'carriers.f3.title': 'Comerciantes confiables',
        'carriers.f3.text': 'Perfiles de empresas verificados y calificaciones de otros transportistas.',
        'carriers.cta': 'Regístrate como transportista',

        'merchants.eyebrow': 'PARA COMERCIANTES',
        'merchants.title': 'Envía tu mercadería sin<br> un contrato fijo',
        'merchants.photo': 'Dueño de una pyme preparando un envío',
        'merchants.f1.title': 'Transportistas con espacio en tu ruta',
        'merchants.f1.text': 'Encuentra transportistas que ya van hacia tu destino, a menor costo que un viaje exclusivo.',
        'merchants.f2.title': 'Seguimiento del envío en vivo',
        'merchants.f2.text': 'Sigue tu mercadería y recibe una alerta si el vehículo sale de la ruta planificada.',
        'merchants.f3.title': 'Transportistas verificados',
        'merchants.f3.text': 'Transportistas con identidad verificada (DNI) y calificaciones de otros comerciantes.',
        'merchants.cta': 'Regístrate como comerciante',
    };

    const english = {
        'menu.open': 'Open menu',
        'menu.close': 'Close menu'
    };

    // Original English values, captured from the HTML the first time
    const originals = new Map();

    function remember(el, kind, value) {
        if (!originals.has(el)) originals.set(el, {});
        const store = originals.get(el);
        if (!(kind in store)) store[kind] = value;
        return store[kind];
    }

    function parseAttrs(spec) {
        return spec.split(';').map((pair) => pair.split(':').map((s) => s.trim())).filter((p) => p.length === 2 && p[0]);
    }

    let currentLang = 'en';

    function t(key) {
        if (currentLang === 'es' && es[key]) return es[key];
        return english[key] || key;
    }

    function apply(lang) {
        currentLang = SUPPORTED.includes(lang) ? lang : 'en';
        const useEs = currentLang === 'es';

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const original = remember(el, 'text', el.textContent);
            const key = el.dataset.i18n;
            el.textContent = useEs && es[key] ? es[key] : original;
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const original = remember(el, 'html', el.innerHTML);
            const key = el.dataset.i18nHtml;
            el.innerHTML = useEs && es[key] ? es[key] : original;
        });

        document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
            parseAttrs(el.dataset.i18nAttr).forEach(([attr, key]) => {
                const original = remember(el, `attr:${attr}`, el.getAttribute(attr));
                const value = useEs && es[key] ? es[key] : original;
                if (value !== null) el.setAttribute(attr, value);
            });
        });

        document.documentElement.lang = currentLang;

        // Keep every EN | ES switch on the page in sync
        document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
            const on = btn.dataset.lang === currentLang;
            btn.classList.toggle('is-active', on);
            btn.setAttribute('aria-pressed', String(on));
        });

        document.dispatchEvent(new CustomEvent('trazza:langchange', { detail: { lang: currentLang } }));
    }

    function save(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked: ignore */ }
    }

    function initialLang() {
        const fromUrl = new URLSearchParams(window.location.search).get('lang');
        if (SUPPORTED.includes(fromUrl)) return fromUrl;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (SUPPORTED.includes(saved)) return saved;
        } catch (e) { /* storage blocked: ignore */ }
        return 'en';
    }

    function setLang(lang) {
        apply(lang);
        save(currentLang);
    }

    window.TrazzaI18n = { t, setLang, getLang: () => currentLang };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => setLang(btn.dataset.lang));
        });
        apply(initialLang());
    });
})();