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
        
        const freshButtons = document.querySelectorAll('.nav-dropdown-btn');
        
        freshButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🎯 MAIN CODE: Dropdown clicked');
                
                const dropdown = btn.closest('.nav-dropdown');
                const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
                const isOpen = dropdownMenu.classList.contains('show');
                
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(button => {
                    button.classList.remove('active');
                });
                
                if (!isOpen) {
                    dropdownMenu.classList.add('show');
                    btn.classList.add('active');
                    console.log('✅ MAIN CODE: Dropdown opened');
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            const isDropdownButton = e.target.closest('.nav-dropdown-btn');
            const isDropdownMenu = e.target.closest('.nav-dropdown-menu');
            if (isDropdownButton || isDropdownMenu) return;
            document.querySelectorAll('.nav-dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
            document.querySelectorAll('.nav-dropdown-btn.active').forEach(btn => {
                btn.classList.remove('active');
            });
            console.log('👆 All dropdowns closed (outside click)');
        });
        
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
        
        const mobileDropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
        mobileDropdownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const isOpen = !content.classList.contains('hidden');
                document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                    item.classList.add('hidden');
                });
                document.querySelectorAll('.mobile-dropdown-btn i.fa-chevron-down').forEach(icon => {
                    icon.style.transform = 'rotate(0deg)';
                });
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

function initializeHeader() {
    console.log('🚀 Initializing HeaderNavigation...');
    window.headerNavigation = new HeaderNavigation();
}

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForHeaderAndInitialize);
} else {
    waitForHeaderAndInitialize();
}
