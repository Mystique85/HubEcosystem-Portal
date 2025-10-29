// Header Navigation with Dropdown Menu - FIXED VERSION
class HeaderNavigation {
    constructor() {
        this.isMobileMenuOpen = false;
        console.log('🔧 HeaderNavigation constructor called');
        this.init();
    }

    init() {
        console.log('🔧 Initializing Header Navigation...');
        
        // SPRAWDŹ CZY HEADER JEST WIDOCZNY
        this.debugHeaderVisibility();
        
        this.setupDesktopDropdowns();
        this.setupMobileMenu();
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

        // Sprawdź czy header jest widoczny
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
        console.log('🔧 Setting up desktop dropdowns...');
        
        // Remove old buttons and add new ones (Vercel fix)
        const dropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
        dropdownBtns.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        // Add listeners to fresh buttons
        const freshButtons = document.querySelectorAll('.nav-dropdown-btn');
        
        freshButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎯 Dropdown clicked:', btn.textContent.trim());
                
                const dropdown = btn.closest('.nav-dropdown');
                const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
                
                // Check if this dropdown is already open
                const isOpen = dropdownMenu.classList.contains('show');
                
                // Close all dropdowns
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(button => {
                    button.classList.remove('active');
                });
                
                // If not open - open it
                if (!isOpen) {
                    dropdownMenu.classList.add('show');
                    btn.classList.add('active');
                    console.log('✅ Dropdown opened:', btn.textContent.trim());
                } else {
                    console.log('❌ Dropdown closed:', btn.textContent.trim());
                }
            });
        });
        
        // Click anywhere else - close all dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                console.log('👆 Click outside - all dropdowns closed');
            }
        });
        
        // Prevent closing when clicking inside dropdown menu
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
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
                    
                    // Zamknij wszystkie dropdowny
                    document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                    document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
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

// Initialize header navigation
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
