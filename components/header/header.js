class HeaderNavigation {
    constructor() {
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupDesktopDropdowns();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    }

    setupDesktopDropdowns() {
        console.log('🔧 Setting up desktop dropdowns...');
        
        // USUŃ STARE EVENT LISTENERS - VERCEL FIX
        const oldButtons = document.querySelectorAll('.nav-dropdown-btn');
        oldButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        // DODAJ EVENT LISTENERS DO ŚWIEŻYCH PRZYCISKÓW
        const freshButtons = document.querySelectorAll('.nav-dropdown-btn');
        
        freshButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎯 MAIN CODE: Dropdown clicked');
                
                const dropdown = btn.closest('.nav-dropdown');
                const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
                const isOpen = dropdownMenu.classList.contains('show');
                
                // Zamknij wszystkie dropdowny
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(button => {
                    button.classList.remove('active');
                });
                
                // Otwórz ten dropdown jeśli był zamknięty
                if (!isOpen) {
                    dropdownMenu.classList.add('show');
                    btn.classList.add('active');
                    console.log('✅ MAIN CODE: Dropdown opened');
                }
            });
        });
        
        // Zamknij dropdowny po kliknięciu gdzie indziej
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                console.log('👆 All dropdowns closed');
            }
        });
        
        // Zapobiegaj zamykaniu po kliknięciu w dropdown
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        console.log('✅ Desktop dropdowns setup completed');
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.openMobileMenu();
            });
            
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }
        }
        
        // Mobile dropdowns
        const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        mobileDropdownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const isOpen = !content.classList.contains('hidden');
                
                // Close all mobile dropdowns
                document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                    item.classList.add('hidden');
                });
                
                // Rotate arrows
                document.querySelectorAll('.mobile-dropdown-btn i.fa-chevron-down').forEach(icon => {
                    icon.style.transform = 'rotate(0deg)';
                });
                
                // Open this one if was closed
                if (!isOpen) {
                    content.classList.remove('hidden');
                    btn.querySelector('i.fa-chevron-down').style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    setupSmoothScroll() {
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
                    
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
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
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('show');
            this.isMobileMenuOpen = true;
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            this.isMobileMenuOpen = false;
        }
    }
}

// Initialize header navigation
function initializeHeader() {
    console.log('🚀 Initializing HeaderNavigation...');
    window.headerNavigation = new HeaderNavigation();
}

// Wait for DOM and dynamic content
function waitForHeaderAndInitialize() {
    const maxAttempts = 10;
    let attempts = 0;
    
    const checkHeader = setInterval(() => {
        attempts++;
        const headerExists = document.querySelector('.nav-dropdown-btn');
        
        if (headerExists) {
            clearInterval(checkHeader);
            console.log('✅ Header found - initializing navigation');
            initializeHeader();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkHeader);
            console.log('⚠️ Header not found after max attempts');
        }
    }, 200);
}

// Auto-start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForHeaderAndInitialize);
} else {
    waitForHeaderAndInitialize();
}
