document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.getElementById('typing-text');
    const typingContainer = document.querySelector('.typing-container');
    const previewContainer = document.getElementById('preview-container');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    const text = "yuriika123's Works";
    let charIndex = 0;
    let previewsInitialized = false;
    let currentTab = 'coding';

    function init() {
        if (sessionStorage.getItem('hasSeenAnimation')) {
            typingContainer.style.transition = 'none';
            typingElement.textContent = text;
            typingContainer.classList.add('move-to-top');
            previewContainer.classList.remove('hidden');
            setupPreviews();
            setTimeout(() => {
                typingContainer.style.transition = '';
            }, 50);
        } else if (!previewContainer.classList.contains('hidden')) {
            setupPreviews();
        } else {
            startTypingAnimation();
        }
        addGlobalEventListeners();
    }

    function startTypingAnimation() {
        if (charIndex < text.length) {
            typingElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingAnimation, 100);
        } else {
            sessionStorage.setItem('hasSeenAnimation', 'true');
            typingContainer.classList.add('move-to-top');
            setTimeout(() => {
                previewContainer.classList.remove('hidden');
                setupPreviews();
            }, 1000);
        }
    }

    function setupPreviews() {
        playVideosInCurrentTab();
        
        if (previewsInitialized) {
            return;
        }

        setupTabs();
        addPreviewItemListeners();
        
        previewsInitialized = true;
    }

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

    function addPreviewItemListeners() {
        const previewItems = document.querySelectorAll('.preview-item');
        previewItems.forEach(item => {
            if (!item.dataset.link) {
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
                    e.preventDefault();
                    handlePreviewClick.call(item);
                }
            });

            item.addEventListener('click', handlePreviewClick);
        });
    }

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

    function playVideosInCurrentTab() {
        document.querySelectorAll('.preview-video').forEach(video => {
            if (video.closest('.tab-content')?.classList.contains('active')) {
                video.currentTime = 0;
                video.play().catch(error => console.log('Video autoplay blocked.', error));
            } else {
                video.pause();
            }
        });
    }
    
    function handlePreviewClick() {
        if (this.dataset.link) {
            window.location.href = this.dataset.link;
        }
    }

    function addGlobalEventListeners() {
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

    init();
});