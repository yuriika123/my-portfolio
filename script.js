document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const typingElement = document.getElementById('typing-text');
    const typingContainer = document.querySelector('.typing-container');
    const previewContainer = document.getElementById('preview-container');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // State
    const text = "yuriika123's Works";
    let charIndex = 0;
    let previewsInitialized = false;
    let currentTab = 'coding';

    /**
     * Initializes the application.
     */
    function init() {
        // If returning to the page and previews are already visible
        if (!previewContainer.classList.contains('hidden')) {
            setupPreviews();
        } else {
            startTypingAnimation();
        }
        addGlobalEventListeners();
    }

    /**
     * Starts the typing animation.
     */
    function startTypingAnimation() {
        if (charIndex < text.length) {
            typingElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingAnimation, 100);
        } else {
            // Move text to the top after animation
            typingContainer.classList.add('move-to-top');
            // Show preview section
            setTimeout(() => {
                previewContainer.classList.remove('hidden');
                setupPreviews();
            }, 1000);
        }
    }

    /**
     * Sets up the preview section, including videos and event listeners.
     */
    function setupPreviews() {
        playVideosInCurrentTab();
        
        if (previewsInitialized) {
            return;
        }

        setupTabs();
        addPreviewItemListeners();
        
        previewsInitialized = true;
    }

    /**
     * Sets up tab functionality.
     */
    function setupTabs() {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                if (targetTab !== currentTab) {
                    switchTab(targetTab);
                }
            });
        });
    }

    /**
     * Adds event listeners to each preview item for navigation.
     * Handles both click and touch, preventing navigation during scroll.
     */
    function addPreviewItemListeners() {
        const previewItems = document.querySelectorAll('.preview-item');
        previewItems.forEach(item => {
            // Don't add listeners to items without a data-link (like youtube embeds)
            if (!item.dataset.link) {
                // Stop click propagation on non-link items to avoid issues.
                item.addEventListener('click', (e) => e.stopPropagation());
                return;
            }

            let touchStartX = 0;
            let touchStartY = 0;
            let isScrolling = false;

            item.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isScrolling = false;
            }, { passive: true });

            item.addEventListener('touchmove', (e) => {
                const diffX = Math.abs(e.touches[0].clientX - touchStartX);
                const diffY = Math.abs(e.touches[0].clientY - touchStartY);
                if (diffX > 5 || diffY > 5) {
                    isScrolling = true;
                }
            }, { passive: true });
            
            item.addEventListener('touchend', (e) => {
                if (!isScrolling) {
                    e.preventDefault(); // Prevent ghost click
                    handlePreviewClick.call(item);
                }
            });

            // Fallback for mouse devices
            item.addEventListener('click', handlePreviewClick);
        });
    }

    /**
     * Switches the visible tab.
     * @param {string} targetTab - The data-tab attribute of the target tab.
     */
    function switchTab(targetTab) {
        currentTab = targetTab;
        
        tabButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.tab === targetTab);
        });

        tabContents.forEach(content => {
            content.classList.toggle('active', content.dataset.tab === targetTab);
        });
        
        playVideosInCurrentTab();
    }

    /**
     * Plays videos in the currently active tab and pauses others.
     */
    function playVideosInCurrentTab() {
        document.querySelectorAll('.preview-video').forEach(video => {
            // Check if the video is in the currently active tab
            if (video.closest('.tab-content')?.classList.contains('active')) {
                video.currentTime = 0;
                video.play().catch(error => console.log('Video autoplay blocked.', error));
            } else {
                video.pause();
            }
        });
    }
    
    /**
     * Navigates to the link specified in the item's data-link attribute.
     * `this` refers to the clicked item.
     */
    function handlePreviewClick() {
        if (this.dataset.link) {
            window.location.href = this.dataset.link;
        }
    }

    /**
     * Adds global event listeners for page lifecycle events.
     */
    function addGlobalEventListeners() {
        // Handle tab visibility changes and back/forward navigation
        window.addEventListener('pageshow', (event) => {
            if (event.persisted || (performance.navigation && performance.navigation.type === 2)) {
                if (!previewContainer.classList.contains('hidden')) {
                    playVideosInCurrentTab();
                }
            }
        });

        window.addEventListener('focus', () => {
            if (!previewContainer.classList.contains('hidden')) {
                playVideosInCurrentTab();
            }
        });
    }

    // Start the application
    init();
});