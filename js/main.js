/**
 * Noordeen Tutorials - Main JavaScript Entry Point
 * Coordinates all modules and initializes the application
 */


// Main Application Object
const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log(`${CONFIG.site.name} v${CONFIG.site.version} initialized`);
        
        // Initialize core modules
        this.initModules();
        
        // Setup global event listeners
        this.setupGlobalEvents();
        
        // Initialize page-specific features
        this.initPageFeatures();
    },
    
    /**
     * Initialize all modules
     */
    initModules() {
        // Navigation is auto-initialized
        // Interactive elements are auto-initialized
        
        // Initialize search if enabled
        if (CONFIG.features.search) {
            this.initSearch();
        }
    },
    
    /**
     * Setup global event listeners
     */
    setupGlobalEvents() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Page hidden - pausing animations');
            } else {
                console.log('Page visible - resuming');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            const breakpoint = Utils.getBreakpoint();
            console.log('Breakpoint changed:', breakpoint);
        }, 250));
        
        // Handle errors globally
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    },
    
    /**
     * Initialize page-specific features
     */
    initPageFeatures() {
        const path = window.location.pathname;
        
        if (path.includes('index.html') || path === '/') {
            this.initHomePage();
        } else if (path.includes('tutorials/')) {
            this.initTutorialPage();
        }
    },
    
    /**
     * Initialize homepage features
     */
    initHomePage() {
        // Fade in hero section
        const hero = Utils.$('.home-hero');
        if (hero) {
            setTimeout(() => {
                hero.classList.add('fade-in');
            }, 100);
        }
        
        // Load article data
        this.loadArticles();
    },
    
    /**
     * Initialize tutorial page features
     */
    initTutorialPage() {
        // Detect total steps
        const steps = Utils.$$('.step-container');
        if (steps.length > 0) {
            Progress.init(steps.length);
        }
        
        // Initialize MathJax if available
        if (typeof MathJax !== 'undefined') {
            MathJax.typesetPromise().catch((err) => {
                console.error('MathJax error:', err);
            });
        }
    },
    
    /**
     * Initialize search functionality
     */
    initSearch() {
        const searchInput = Utils.$('.search-input');
        const searchButton = Utils.$('.search-button');
        
        if (!searchInput) return;
        
        const performSearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) return;
            
            console.log('Searching for:', query);
            this.filterArticles(query);
        };
        
        if (searchButton) {
            Utils.on(searchButton, 'click', performSearch);
        }
        
        Utils.on(searchInput, 'keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search
        Utils.on(searchInput, 'input', Utils.debounce(() => {
            performSearch();
        }, 300));
    },
    
    /**
     * Filter articles based on search query
     * @param {string} query - Search query
     */
    filterArticles(query) {
        const cards = Utils.$$('.article-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-body')?.textContent.toLowerCase() || '';
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        this.showSearchResults(visibleCount, query);
    },
    
    /**
     * Show search results message
     * @param {number} count - Number of results
     * @param {string} query - Search query
     */
    showSearchResults(count, query) {
        let message = Utils.$('.search-results-message');
        
        if (!message) {
            message = document.createElement('div');
            message.className = 'search-results-message';
            const articlesSection = Utils.$('.articles-section');
            if (articlesSection) {
                articlesSection.insertBefore(message, articlesSection.firstChild);
            }
        }
        
        if (count === 0) {
            message.innerHTML = `<p class="text-center">No results found for "<strong>${query}</strong>"</p>`;
            message.style.display = 'block';
        } else {
            message.innerHTML = `<p class="text-center">Found ${count} result${count !== 1 ? 's' : ''} for "<strong>${query}</strong>"</p>`;
            message.style.display = 'block';
        }
    },
    
    /**
     * Load articles from data file
     */
    async loadArticles() {
        try {
            const response = await fetch('data/articles.json');
            const articles = await response.json();
            this.renderArticles(articles);
        } catch (error) {
            console.error('Error loading articles:', error);
        }
    },
    
    /**
     * Render articles to the page
     * @param {Array} articles - Article data
     */
    renderArticles(articles) {
        const container = Utils.$('.card-grid');
        if (!container) return;
        
        // This is a placeholder - actual implementation would render from data
        console.log('Articles loaded:', articles.length);
    }
};


// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}


// Export for global access
window.App = App;
window.Utils = Utils;
window.CONFIG = CONFIG;
window.Progress = Progress;
window.Interactive = Interactive;


