/**
 * Configuration Module
 * Central configuration for the application
 */


const CONFIG = {
    // Site Information
    site: {
        name: 'Noordeen Tutorials',
        tagline: 'Master Machine Learning & AI Agents',
        author: 'Noordeen',
        version: '2.0.0'
    },
    
    // API Endpoints (if needed in future)
    api: {
        baseUrl: '',
        endpoints: {}
    },
    
    // Feature Flags
    features: {
        search: true,
        darkMode: false,
        analytics: false
    },
    
    // Tutorial Settings
    tutorial: {
        autoSave: true,
        showHints: true,
        animationSpeed: 300
    },
    
    // Breakpoints (matching CSS)
    breakpoints: {
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1200
    },
    
    // Local Storage Keys
    storage: {
        progress: 'tutorial_progress',
        preferences: 'user_preferences',
        theme: 'theme_preference'
    }
};


// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

