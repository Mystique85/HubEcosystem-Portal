class ProjectsCarousel {
    constructor() {
        this.currentIndex = 0;
        this.currentFilter = 'all';
        this.cardsPerView = 4;
        this.carousel = null;
        this.cards = [];
        this.filteredCards = [];
        this.indicators = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeCarousel();
            });
        } else {
            this.initializeCarousel();
        }
    }

    initializeCarousel() {
        setTimeout(() => {
            this.carousel = document.getElementById('projectsCarousel');
            this.cards = Array.from(document.querySelectorAll('.card'));
            this.filteredCards = [...this.cards];
            
            this.setupEventListeners();
            this.setupResponsive();
            this.updateCarousel();
            this.createIndicators();
        }, 100);
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentFilter = button.getAttribute('data-filter');
                this.filterProjects(this.currentFilter);
            });
        });

        // Carousel navigation
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch/swipe support
        this.setupTouchEvents();
    }

    setupResponsive() {
        const updateCardsPerView = () => {
            if (window.innerWidth < 768) {
                this.cardsPerView = 1;
            } else if (window.innerWidth < 992) {
                this.cardsPerView = 2;
            } else if (window.innerWidth < 1200) {
                this.cardsPerView = 3;
            } else {
                this.cardsPerView = 4;
            }
            this.updateCarousel();
        };

        window.addEventListener('resize', updateCardsPerView);
        updateCardsPerView();
    }

    setupTouchEvents() {
        let startX = 0;
        let endX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
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
        this.currentIndex = 0;
        
        if (filter === 'all') {
            this.filteredCards = [...this.cards];
            this.cards.forEach(card => {
                card.classList.remove('carousel-hidden');
            });
        } else {
            this.filteredCards = this.cards.filter(card => {
                const categories = card.getAttribute('data-categories');
                const shouldShow = categories.includes(filter);
                
                if (shouldShow) {
                    card.classList.remove('carousel-hidden');
                } else {
                    card.classList.add('carousel-hidden');
                }
                
                return shouldShow;
            });
        }
        
        this.updateCarousel();
        this.createIndicators();
    }

    updateCarousel() {
        if (!this.carousel || this.filteredCards.length === 0) return;

        const cardWidth = this.filteredCards[0].offsetWidth + 32;
        const translateX = -this.currentIndex * cardWidth * this.cardsPerView;
        
        this.carousel.style.transform = `translateX(${translateX}px)`;
        this.updateIndicators();
    }

    createIndicators() {
        const indicatorsContainer = document.getElementById('carouselIndicators');
        if (!indicatorsContainer) return;

        const totalSlides = Math.ceil(this.filteredCards.length / this.cardsPerView);
        
        indicatorsContainer.innerHTML = '';
        this.indicators = [];

        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(i));
            
            indicatorsContainer.appendChild(indicator);
            this.indicators.push(indicator);
        }
    }

    updateIndicators() {
        const currentIndicator = Math.floor(this.currentIndex / this.cardsPerView);
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndicator);
        });
    }

    nextSlide() {
        const maxIndex = Math.max(0, Math.ceil(this.filteredCards.length / this.cardsPerView) - 1);
        
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    goToSlide(slideIndex) {
        this.currentIndex = slideIndex * this.cardsPerView;
        this.updateCarousel();
    }
}

// Initialize carousel
new ProjectsCarousel();

console.log('Projects carousel loaded successfully');