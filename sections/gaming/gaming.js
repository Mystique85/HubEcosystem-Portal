class GamingCarousel {
    constructor() {
        this.currentPage = 0;
        this.currentFilter = 'all';
        this.cardsPerView = 4;
        this.carousel = null;
        this.cards = [];
        this.filteredCards = [];
        this.miniatures = [];
        this.isInitialized = false;
        this.cardWidth = 276;
        this.gap = 32;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    init() {
        setTimeout(() => this.initializeCarousel(), 500);
    }

    initializeCarousel() {
        this.carousel = document.getElementById('gamingCarousel');
        this.cards = Array.from(document.querySelectorAll('#gaming-projects .card'));
        this.filteredCards = [...this.cards];
        
        if (!this.carousel || this.cards.length === 0) {
            setTimeout(() => this.initializeCarousel(), 500);
            return;
        }
        
        this.setupEventListeners();
        this.setupResponsive();
        this.updateCarousel();
        this.createMiniatures();
        this.isInitialized = true;
    }

    setupEventListeners() {
        const filterButtons = document.querySelectorAll('#gaming-projects .filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                filterButtons.forEach(btn => {
                    btn.classList.remove('active', 'bg-[#00ff88]', 'text-[#0a0a0a]');
                    btn.classList.add('bg-white/10', 'text-text-light');
                });
                button.classList.add('active', 'bg-[#00ff88]', 'text-[#0a0a0a]');
                button.classList.remove('bg-white/10', 'text-text-light');
                
                this.currentFilter = button.getAttribute('data-filter');
                this.currentPage = 0;
                this.filterProjects(this.currentFilter);
            });
        });

        const prevBtn = document.querySelector('#gaming-projects .carousel-prev');
        const nextBtn = document.querySelector('#gaming-projects .carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }

        document.addEventListener('keydown', (e) => {
            const gamingSection = document.getElementById('gaming-projects');
            if (gamingSection && this.isElementInViewport(gamingSection)) {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            }
        });

        this.setupTouchEvents();
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    setupResponsive() {
        const updateCardsPerView = () => {
            const width = window.innerWidth;
            if (width < 768) {
                this.cardsPerView = 1;
            } else if (width < 1024) {
                this.cardsPerView = 2;
            } else if (width < 1280) {
                this.cardsPerView = 3;
            } else {
                this.cardsPerView = 4;
            }
            
            this.currentPage = 0;
            this.updateCarousel();
            this.createMiniatures();
        };

        window.addEventListener('resize', updateCardsPerView);
        updateCardsPerView();
    }

    setupTouchEvents() {
        let startX = 0;
        let endX = 0;

        if (this.carousel) {
            this.carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            this.carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
            });
        }
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    filterProjects(filter) {
        this.currentPage = 0;
        
        if (filter === 'all') {
            this.filteredCards = [...this.cards];
            this.cards.forEach(card => {
                card.style.display = 'flex';
            });
        } else {
            this.filteredCards = this.cards.filter(card => {
                const categories = card.getAttribute('data-categories');
                const shouldShow = categories && categories.includes(filter);
                
                card.style.display = shouldShow ? 'flex' : 'none';
                return shouldShow;
            });
        }
        
        this.updateCarousel();
        this.createMiniatures();
    }

    updateCarousel() {
        if (!this.carousel || this.filteredCards.length === 0) {
            return;
        }

        const translateX = -this.currentPage * (this.cardWidth + this.gap) * this.cardsPerView;
        
        this.carousel.style.transform = `translateX(${translateX}px)`;
        this.updateMiniatures();
        this.updateArrowVisibility();
    }

    updateArrowVisibility() {
        const prevBtn = document.querySelector('#gaming-projects .carousel-prev');
        const nextBtn = document.querySelector('#gaming-projects .carousel-next');
        const totalPages = Math.ceil(this.filteredCards.length / this.cardsPerView);

        if (prevBtn) {
            prevBtn.style.opacity = this.currentPage > 0 ? '1' : '0.5';
            prevBtn.style.pointerEvents = this.currentPage > 0 ? 'auto' : 'none';
        }

        if (nextBtn) {
            nextBtn.style.opacity = this.currentPage < totalPages - 1 ? '1' : '0.5';
            nextBtn.style.pointerEvents = this.currentPage < totalPages - 1 ? 'auto' : 'none';
        }
    }

    createMiniatures() {
        const miniaturesContainer = document.getElementById('gamingMiniatures');
        
        if (!miniaturesContainer) {
            return;
        }

        const totalPages = Math.ceil(this.filteredCards.length / this.cardsPerView);
        
        miniaturesContainer.innerHTML = '';
        this.miniatures = [];

        if (totalPages <= 1) {
            miniaturesContainer.style.display = 'none';
            return;
        } else {
            miniaturesContainer.style.display = 'flex';
        }

        for (let i = 0; i < totalPages; i++) {
            const miniature = document.createElement('div');
            miniature.className = `carousel-miniature w-12 h-16 rounded-lg cursor-pointer transition-all duration-300 border-2 flex items-center justify-center ${
                i === 0 ? 'border-accent-neon scale-110 shadow-lg shadow-accent-neon/30' : 'border-white/20'
            }`;
            
            const pageCards = this.filteredCards.slice(i * this.cardsPerView, (i + 1) * this.cardsPerView);
            const cardTypes = pageCards.map(card => card.getAttribute('data-categories'));
            
            let bgColor = 'bg-accent-neon/20';
            let iconClass = 'fas fa-gamepad text-accent-neon text-xs';
            
            if (cardTypes.some(type => type && type.includes('p2e'))) {
                bgColor = 'bg-green-500/20';
                iconClass = 'fas fa-coins text-green-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('rpg'))) {
                bgColor = 'bg-red-500/20';
                iconClass = 'fas fa-sword text-red-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('fantasy'))) {
                bgColor = 'bg-indigo-500/20';
                iconClass = 'fas fa-dragon text-indigo-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('metaverse'))) {
                bgColor = 'bg-purple-500/20';
                iconClass = 'fas fa-globe text-purple-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('mobile'))) {
                bgColor = 'bg-cyan-500/20';
                iconClass = 'fas fa-mobile-alt text-cyan-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('soon'))) {
                bgColor = 'bg-blue-500/20';
                iconClass = 'fas fa-clock text-blue-400 text-xs';
            }
            
            miniature.classList.add(bgColor);
            
            const icon = document.createElement('i');
            icon.className = iconClass;
            miniature.appendChild(icon);
            
            miniature.addEventListener('click', () => this.goToPage(i));
            
            miniaturesContainer.appendChild(miniature);
            this.miniatures.push(miniature);
        }
    }

    updateMiniatures() {
        if (this.miniatures.length === 0) return;
        
        this.miniatures.forEach((miniature, index) => {
            const isActive = index === this.currentPage;
            miniature.classList.toggle('border-accent-neon', isActive);
            miniature.classList.toggle('scale-110', isActive);
            miniature.classList.toggle('border-white/20', !isActive);
            miniature.classList.toggle('shadow-lg', isActive);
            miniature.classList.toggle('shadow-accent-neon/30', isActive);
        });
    }

    nextSlide() {
        const totalPages = Math.ceil(this.filteredCards.length / this.cardsPerView);
        
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateCarousel();
        }
    }

    goToPage(pageIndex) {
        this.currentPage = pageIndex;
        this.updateCarousel();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.gamingCarousel = new GamingCarousel();
    }, 1000);
});

if (document.readyState === 'complete') {
    setTimeout(() => {
        window.gamingCarousel = new GamingCarousel();
    }, 1000);
}