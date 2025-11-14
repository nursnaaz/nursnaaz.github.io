/**
 * Navigation Component
 * Handles navigation menu, mobile toggle, and active states
 */


const Navigation = {
    init() {
        this.setupMobileToggle();
        this.setupActiveStates();
        this.setupSmoothScroll();
    },
    
    /**
     * Setup mobile menu toggle
     */
    setupMobileToggle() {
        const toggle = Utils.$('.nav-toggle');
        const menu = Utils.$('.nav-menu');
        
        if (!toggle || !menu) return;
        
        Utils.on(toggle, 'click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        Utils.on(document, 'click', (e) => {
            if (!e.target.closest('.navbar')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        }, 250));
    },
    
    /**
     * Setup active navigation states
     */
    setupActiveStates() {
        const currentPath = window.location.pathname;
        const navLinks = Utils.$$('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    },
    
    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        const anchorLinks = Utils.$$('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            Utils.on(link, 'click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = Utils.$(href);
                if (target) {
                    Utils.scrollTo(target);
                }
            });
        });
    },
    
    /**
     * Update breadcrumb
     * @param {Array} items - Breadcrumb items [{text, url}]
     */
    updateBreadcrumb(items) {
        const breadcrumb = Utils.$('.breadcrumb');
        if (!breadcrumb) return;
        
        const html = items.map((item, index) => {
            const isLast = index === items.length - 1;
            if (isLast) {
                return `<span>${item.text}</span>`;
            }
            return `<a href="${item.url}">${item.text}</a><span class="breadcrumb-separator">›</span>`;
        }).join('');
        
        breadcrumb.innerHTML = html;
    }
};


// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Navigation.init());
} else {
    Navigation.init();
}


