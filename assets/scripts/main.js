document.addEventListener('DOMContentLoaded', () => {
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
});