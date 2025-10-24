class ProjectsCarousel {
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
        
        console.log('🔄 ProjectsCarousel constructor called');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    init() {
        console.log('🔄 Initializing ProjectsCarousel...');
        setTimeout(() => this.initializeCarousel(), 500);
    }

    initializeCarousel() {
        this.carousel = document.getElementById('projectsCarousel');
        this.cards = Array.from(document.querySelectorAll('.card'));
        this.filteredCards = [...this.cards];
        
        console.log('🔍 Carousel elements:', {
            carousel: !!this.carousel,
            cards: this.cards.length,
            prevBtn: !!document.querySelector('.carousel-prev'),
            nextBtn: !!document.querySelector('.carousel-next')
        });
        
        if (!this.carousel || this.cards.length === 0) {
            console.log('⏳ No cards found, retrying...');
            setTimeout(() => this.initializeCarousel(), 500);
            return;
        }
        
        this.setupEventListeners();
        this.setupResponsive();
        this.updateCarousel();
        this.createMiniatures();
        this.isInitialized = true;
        
        console.log('✅ ProjectsCarousel initialized successfully');
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
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

        // Carousel navigation
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
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

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        this.setupTouchEvents();
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
            
            console.log(`📱 Cards per view: ${this.cardsPerView} (width: ${width}px)`);
            
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
        console.log('🔧 Filtering projects:', filter);
        
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
        
        console.log(`📊 Filtered cards: ${this.filteredCards.length}`);
        this.updateCarousel();
        this.createMiniatures();
    }

    updateCarousel() {
        if (!this.carousel || this.filteredCards.length === 0) {
            console.warn('❌ Cannot update carousel - no carousel or filtered cards');
            return;
        }

        // Oblicz przesunięcie na podstawie strony
        const translateX = -this.currentPage * (this.cardWidth + this.gap) * this.cardsPerView;
        
        this.carousel.style.transform = `translateX(${translateX}px)`;
        this.updateMiniatures();
        this.updateArrowVisibility();
        
        console.log('🔄 Carousel updated:', {
            currentPage: this.currentPage,
            translateX: translateX,
            totalPages: Math.ceil(this.filteredCards.length / this.cardsPerView)
        });
    }

    updateArrowVisibility() {
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
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
        const miniaturesContainer = document.getElementById('carouselMiniatures');
        console.log('🔍 Looking for miniatures container:', miniaturesContainer);
        
        if (!miniaturesContainer) {
            console.error('❌ Miniatures container NOT FOUND! Check HTML ID');
            return;
        }

        const totalPages = Math.ceil(this.filteredCards.length / this.cardsPerView);
        console.log(`📄 Total pages for miniatures: ${totalPages}`);
        
        miniaturesContainer.innerHTML = '';
        this.miniatures = [];

        if (totalPages <= 1) {
            miniaturesContainer.style.display = 'none';
            console.log('📦 Only one page - hiding miniatures');
            return;
        } else {
            miniaturesContainer.style.display = 'flex';
            console.log('🎴 Showing miniatures for', totalPages, 'pages');
        }

        for (let i = 0; i < totalPages; i++) {
            const miniature = document.createElement('div');
            miniature.className = `carousel-miniature w-12 h-16 rounded-lg cursor-pointer transition-all duration-300 border-2 flex items-center justify-center ${
                i === 0 ? 'border-accent-neon scale-110 shadow-lg shadow-accent-neon/30' : 'border-white/20'
            }`;
            
            // Ustaw kolor tła w zależności od typu kart na tej stronie
            const pageCards = this.filteredCards.slice(i * this.cardsPerView, (i + 1) * this.cardsPerView);
            const cardTypes = pageCards.map(card => card.getAttribute('data-categories'));
            
            let bgColor = 'bg-accent-neon/20';
            let iconClass = 'fas fa-rocket text-accent-neon text-xs';
            
            if (cardTypes.some(type => type && type.includes('base'))) {
                bgColor = 'bg-blue-500/20';
                iconClass = 'fas fa-layer-group text-blue-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('celo'))) {
                bgColor = 'bg-yellow-500/20';
                iconClass = 'fas fa-seedling text-yellow-400 text-xs';
            } else if (cardTypes.some(type => type && type.includes('soon'))) {
                bgColor = 'bg-purple-500/20';
                iconClass = 'fas fa-clock text-purple-400 text-xs';
            }
            
            miniature.classList.add(bgColor);
            
            // Dodaj ikonę
            const icon = document.createElement('i');
            icon.className = iconClass;
            miniature.appendChild(icon);
            
            miniature.addEventListener('click', () => this.goToPage(i));
            
            miniaturesContainer.appendChild(miniature);
            this.miniatures.push(miniature);
            
            console.log(`➕ Created miniature ${i + 1} with class: ${bgColor}`);
        }
        
        console.log(`🎴 Successfully created ${this.miniatures.length} miniatures`);
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
        
        console.log('➡️ Next page:', this.currentPage + 1, '/', totalPages);
    }

    prevSlide() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateCarousel();
        }
        
        console.log('⬅️ Prev page:', this.currentPage + 1);
    }

    goToPage(pageIndex) {
        this.currentPage = pageIndex;
        this.updateCarousel();
        console.log('🎯 Go to page:', pageIndex + 1);
    }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM ready - starting ProjectsCarousel...');
    
    setTimeout(() => {
        window.projectsCarousel = new ProjectsCarousel();
        console.log('🎯 ProjectsCarousel instance created');
    }, 1000);
});

if (document.readyState === 'complete') {
    setTimeout(() => {
        window.projectsCarousel = new ProjectsCarousel();
        console.log('🎯 ProjectsCarousel instance created (page already loaded)');
    }, 1000);
}