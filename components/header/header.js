// Header Navigation with Dropdown Menu - DEBUG VERSION
class HeaderNavigation {
    constructor() {
        this.isMobileMenuOpen = false;
        this.activeDropdown = null;
        console.log('🔧 HeaderNavigation constructor called');
        this.init();
    }

    init() {
        console.log('🔧 Initializing Header Navigation...');
        
        // SPRAWDŹ CZY HEADER JEST WIDOCZNY
        this.debugHeaderVisibility();
        
        this.setupDesktopDropdowns();
        this.setupMobileMenu();
        this.setupClickOutside();
        this.setupSmoothScroll();
        
        console.log('✅ Header Navigation initialized');
    }

    debugHeaderVisibility() {
        const header = document.querySelector('nav');
        if (!header) {
            console.error('❌ HEADER NOT FOUND IN DOM!');
            return;
        }

        const styles = window.getComputedStyle(header);
        console.log('🔍 HEADER VISIBILITY CHECK:', {
            element: header,
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            position: styles.position,
            top: styles.top,
            zIndex: styles.zIndex,
            width: styles.width,
            height: styles.height
        });

        // Sprawdź czy header jest widoczny - NAPRAWIONY WARUNEK
        const isVisible = styles.display !== 'none' && 
                         styles.visibility !== 'hidden' && 
                         parseFloat(styles.opacity) > 0 &&
                         header.getBoundingClientRect().height > 0;

        console.log('👀 HEADER VISIBLE:', isVisible);
        console.log('📏 Bounding rect:', header.getBoundingClientRect());

        if (!isVisible) {
            console.warn('⚠️ HEADER IS NOT VISIBLE! Possible issues:');
            console.warn('- display: none');
            console.warn('- visibility: hidden'); 
            console.warn('- opacity: 0');
            console.warn('- z-index too low');
            console.warn('- positioned outside viewport');
        }
    }

    setupDesktopDropdowns() {
        const dropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
        console.log('🔧 Setting up desktop dropdowns, found:', dropdownBtns.length);
        
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdownType = btn.getAttribute('data-dropdown');
                console.log('🖱️ Dropdown clicked:', dropdownType);
                this.toggleDesktopDropdown(dropdownType, btn);
            });
        });
    }

    toggleDesktopDropdown(dropdownType, btn) {
        console.log('🔧 Toggling dropdown:', dropdownType);
        
        // Zamknij poprzedni dropdown jeśli jest otwarty
        if (this.activeDropdown && this.activeDropdown !== dropdownType) {
            this.closeDesktopDropdown();
        }
        
        // NAPRAWIONE: Użyj closest do znalezienia menu dropdown
        const dropdownMenu = btn.closest('.nav-dropdown').querySelector('.nav-dropdown-menu');
        const dropdownBtn = document.querySelector(`[data-dropdown="${dropdownType}"]`);
        
        console.log('🔍 Dropdown elements:', { dropdownMenu, dropdownBtn });
        
        if (dropdownMenu && dropdownBtn) {
            const isOpening = !dropdownMenu.classList.contains('show');
            
            if (isOpening) {
                dropdownMenu.classList.add('show');
                dropdownBtn.classList.add('active');
                this.activeDropdown = dropdownType;
                console.log('📂 Dropdown opened:', dropdownType);
                console.log('🎯 Menu classes:', dropdownMenu.classList);
            } else {
                this.closeDesktopDropdown();
            }
        } else {
            console.error('❌ Dropdown elements not found!');
        }
    }

    closeDesktopDropdown() {
        if (this.activeDropdown) {
            // NAPRAWIONE: Znajdź menu dropdown przez przycisk
            const dropdownBtn = document.querySelector(`[data-dropdown="${this.activeDropdown}"]`);
            const dropdownMenu = dropdownBtn?.closest('.nav-dropdown').querySelector('.nav-dropdown-menu');
            
            if (dropdownMenu) {
                dropdownMenu.classList.remove('show');
            }
            if (dropdownBtn) {
                dropdownBtn.classList.remove('active');
            }
            
            console.log('📂 Dropdown closed:', this.activeDropdown);
            this.activeDropdown = null;
        }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        console.log('🔧 Mobile menu button:', mobileMenuBtn);
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                console.log('📱 Mobile menu button clicked');
                this.openMobileMenu();
            });
        }
    }

    setupClickOutside() {
        console.log('🔧 Setting up click outside listeners');
        
        // NAPRAWIONE: Użyj setTimeout aby uniknąć natychmiastowego zamknięcia
        document.addEventListener('click', () => {
            setTimeout(() => {
                if (this.activeDropdown) {
                    console.log('👆 Click outside - closing dropdown:', this.activeDropdown);
                    this.closeDesktopDropdown();
                }
            }, 10);
        });

        // Zapobiegaj zamykaniu gdy klikasz w dropdown
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    setupSmoothScroll() {
        console.log('🔧 Setting up smooth scroll');
        
        // Smooth scroll dla linków wewnętrznych
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Zamknij mobile menu jeśli jest otwarte
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    // Zamknij dropdowny
                    this.closeDesktopDropdown();
                }
            }
        });
    }

    openMobileMenu() {
        const mobileMenu = document.querySelector('.nav-mobile-menu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu) {
            mobileMenu.classList.add('show');
            mobileMenuBtn?.classList.add('active');
            this.isMobileMenuOpen = true;
            console.log('📱 Mobile menu opened');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('.nav-mobile-menu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            mobileMenuBtn?.classList.remove('active');
            this.isMobileMenuOpen = false;
            console.log('📱 Mobile menu closed');
        }
    }
}

// DEBUG: Sprawdź czy header HTML został załadowany
console.log('🔍 HEADER LOADING DEBUG START');
console.log('📦 Full header HTML length:', document.querySelector('nav') ? document.querySelector('nav').outerHTML.length : 'NO HEADER');

// Sprawdź czy wszystkie elementy header'a istnieją
setTimeout(() => {
    const elementsToCheck = [
        '.nav-logo',
        '.nav-desktop', 
        '.nav-dropdown',
        '#mobileMenuBtn',
        '.nav-dropdown-btn'
    ];
    
    elementsToCheck.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        console.log(`🔍 ${selector}:`, elements.length, 'found');
    });
}, 100);

console.log('🔍 HEADER LOADING DEBUG END');

// Initialize header navigation - NAPRAWIONE: Czekaj aż DOM będzie gotowy
function initializeHeader() {
    console.log('🚀 Initializing HeaderNavigation...');
    window.headerNavigation = new HeaderNavigation();
}

// Poczekaj aż wszystkie elementy będą w DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
    // Poczekaj dodatkowo na dynamicznie ładowane elementy
    setTimeout(initializeHeader, 200);
}