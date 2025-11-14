/**
 * Progress Tracking Component
 * Handles tutorial progress tracking and visualization
 */


const Progress = {
    currentStep: 0,
    totalSteps: 0,
    
    /**
     * Initialize progress tracking
     * @param {number} total - Total number of steps
     */
    init(total) {
        this.totalSteps = total;
        this.currentStep = this.loadProgress();
        this.render();
        this.setupStepButtons();
    },
    
    /**
     * Update progress
     * @param {number} step - Current step number
     */
    update(step) {
        if (step < 0 || step > this.totalSteps) return;
        
        this.currentStep = step;
        this.render();
        this.saveProgress();
        this.showStep(step);
    },
    
    /**
     * Render progress bar
     */
    render() {
        const progressFill = Utils.$('.progress-fill');
        const progressText = Utils.$('.progress-text');
        
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    },
    
    /**
     * Show specific step
     * @param {number} stepNumber - Step to show
     */
    showStep(stepNumber) {
        const steps = Utils.$$('.step-container');
        
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.style.display = 'block';
                step.classList.add('fade-in');
                Utils.scrollTo(step);
            } else {
                step.style.display = 'none';
            }
        });
    },
    
    /**
     * Setup step navigation buttons
     */
    setupStepButtons() {
        const nextButtons = Utils.$$('.btn-next-step');
        const prevButtons = Utils.$$('.btn-prev-step');
        
        nextButtons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                this.next();
            });
        });
        
        prevButtons.forEach(btn => {
            Utils.on(btn, 'click', () => {
                this.previous();
            });
        });
    },
    
    /**
     * Go to next step
     */
    next() {
        if (this.currentStep < this.totalSteps) {
            this.update(this.currentStep + 1);
        }
    },
    
    /**
     * Go to previous step
     */
    previous() {
        if (this.currentStep > 1) {
            this.update(this.currentStep - 1);
        }
    },
    
    /**
     * Reset progress
     */
    reset() {
        this.update(1);
    },
    
    /**
     * Complete tutorial
     */
    complete() {
        this.update(this.totalSteps);
        this.showCompletionMessage();
    },
    
    /**
     * Show completion message
     */
    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'card card-success';
        message.innerHTML = `
            <h3>🎉 Congratulations!</h3>
            <p>You've completed this tutorial. Great job!</p>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="Progress.reset()">Start Over</button>
                <a href="index.html" class="btn btn-secondary">Back to Home</a>
            </div>
        `;
        
        const container = Utils.$('.container');
        if (container) {
            container.appendChild(message);
            Utils.scrollTo(message);
        }
    },
    
    /**
     * Save progress to local storage
     */
    saveProgress() {
        const tutorialId = this.getTutorialId();
        const progressData = Utils.storage.get(CONFIG.storage.progress, {});
        progressData[tutorialId] = {
            step: this.currentStep,
            timestamp: Date.now()
        };
        Utils.storage.set(CONFIG.storage.progress, progressData);
    },
    
    /**
     * Load progress from local storage
     * @returns {number}
     */
    loadProgress() {
        const tutorialId = this.getTutorialId();
        const progressData = Utils.storage.get(CONFIG.storage.progress, {});
        return progressData[tutorialId]?.step || 1;
    },
    
    /**
     * Get current tutorial ID from URL
     * @returns {string}
     */
    getTutorialId() {
        const path = window.location.pathname;
        return path.split('/').pop().replace('.html', '') || 'unknown';
    },
    
    /**
     * Get progress percentage
     * @returns {number}
     */
    getPercentage() {
        return Math.round((this.currentStep / this.totalSteps) * 100);
    }
};
