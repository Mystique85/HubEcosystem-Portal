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
        console.log('🔧 Setting up click-only dropdowns...');
        
        const dropdownButtons = document.querySelectorAll('.nav-dropdown-btn');
        
        dropdownButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Zapobiega natychmiastowemu zamknięciu
                
                const dropdown = btn.closest('.nav-dropdown');
                const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
                const isOpen = dropdownMenu.classList.contains('show');
                
                // Zamknij wszystkie inne dropdowny
                this.closeAllDropdowns();
                
                // Otwórz/zamknij aktualny
                if (!isOpen) {
                    dropdownMenu.classList.add('show');
                    btn.classList.add('active');
                    console.log('✅ Dropdown opened:', btn.textContent.trim());
                }
            });
        });
        
        // Zamknij dropdowny po kliknięciu gdziekolwiek indziej
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                this.closeAllDropdowns();
            }
        });
        
        // Zapobiegaj zamykaniu przy kliknięciu w dropdown menu
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        console.log('✅ Click-only dropdowns setup completed');
    }

    closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            btn.classList.remove('active');
        });
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
            
            // Zamknij mobile menu po kliknięciu na link
            mobileMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.closeMobileMenu();
                }
            });
        }
        
        // Mobile dropdowny (zachowaj obecną funkcjonalność)
        const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        mobileDropdownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const isOpen = !content.classList.contains('hidden');
                
                // Zamknij wszystkie inne mobile dropdowny
                document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                    if (item !== content) {
                        item.classList.add('hidden');
                    }
                });
                
                document.querySelectorAll('.mobile-dropdown-btn i.fa-chevron-down').forEach(icon => {
                    if (icon !== btn.querySelector('i.fa-chevron-down')) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Przełącz aktualny
                if (!isOpen) {
                    content.classList.remove('hidden');
                    btn.querySelector('i.fa-chevron-down').style.transform = 'rotate(180deg)';
                } else {
                    content.classList.add('hidden');
                    btn.querySelector('i.fa-chevron-down').style.transform = 'rotate(0deg)';
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
                    
                    // Zamknij wszystkie dropdowny po kliknięciu linka
                    this.closeAllDropdowns();
                    
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                }
            }
        });
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('show');
            this.isMobileMenuOpen = true;
            document.body.style.overflow = 'hidden'; // Zablokuj scroll
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            this.isMobileMenuOpen = false;
            document.body.style.overflow = ''; // Odblokuj scroll
            
            // Zamknij wszystkie mobile dropdowny
            document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                item.classList.add('hidden');
            });
            document.querySelectorAll('.mobile-dropdown-btn i.fa-chevron-down').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });
        }
    }
}

// Inicjalizacja
function initializeHeader() {
    console.log('🚀 Initializing HeaderNavigation...');
    window.headerNavigation = new HeaderNavigation();
}

// Czekaj na załadowanie DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
    initializeHeader();
}
