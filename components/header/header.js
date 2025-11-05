class HeaderNavigation {
    constructor() {
        this.isMobileMenuOpen = false;
        this.activeDropdown = null;
        this.init();
    }

    init() {
        this.setupDesktopDropdowns();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupDropdownHover();
    }

    setupDesktopDropdowns() {
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });

        const dropdownButtons = document.querySelectorAll('.nav-dropdown-btn');
        
        dropdownButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = btn.closest('.nav-dropdown');
                const dropdownMenu = dropdown.querySelector('.nav-dropdown-menu');
                const isCurrentlyOpen = dropdownMenu.classList.contains('show');
                
                this.closeAllDropdowns();
                
                if (!isCurrentlyOpen) {
                    dropdownMenu.classList.add('show');
                    btn.classList.add('active');
                    this.activeDropdown = dropdown;
                }
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-dropdown-menu')) {
                this.closeAllDropdowns();
            }
        });
        
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }

    setupDropdownHover() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 768) {
                    this.closeAllDropdowns();
                    const menu = dropdown.querySelector('.nav-dropdown-menu');
                    const btn = dropdown.querySelector('.nav-dropdown-btn');
                    menu.classList.add('show');
                    btn.classList.add('active');
                    this.activeDropdown = dropdown;
                }
            });
            
            dropdown.addEventListener('mouseleave', (e) => {
                if (window.innerWidth >= 768) {
                    setTimeout(() => {
                        if (!dropdown.matches(':hover') && !dropdown.querySelector('.nav-dropdown-menu').matches(':hover')) {
                            this.closeAllDropdowns();
                        }
                    }, 100);
                }
            });
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.activeDropdown = null;
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
                    if (item !== content) {
                        item.classList.add('hidden');
                    }
                });
                document.querySelectorAll('.mobile-dropdown-btn i.fa-chevron-down').forEach(icon => {
                    if (icon !== btn.querySelector('i.fa-chevron-down')) {
                        icon.style.transform = 'rotate(0deg)';
                    }
                });
                
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
            if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
                e.preventDefault();
                const link = e.target.matches('a[href^="#"]') ? e.target : e.target.closest('a[href^="#"]');
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    this.closeAllDropdowns();
                }
            }
        });
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.add('show');
            this.isMobileMenuOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            this.isMobileMenuOpen = false;
            document.body.style.overflow = '';
            
            document.querySelectorAll('.mobile-dropdown-content').forEach(item => {
                item.classList.add('hidden');
            });
            document.querySelectorAll('.mobile-dropdown-btn i.fa-chevron-down').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });
        }
    }
}

function initializeHeader() {
    setTimeout(() => {
        window.headerNavigation = new HeaderNavigation();
    }, 100);
}

function autoInitializeHeader() {
    const maxAttempts = 20;
    let attempts = 0;
    
    const checkHeader = setInterval(() => {
        attempts++;
        const headerExists = document.querySelector('.nav-dropdown-btn');
        
        if (headerExists) {
            clearInterval(checkHeader);
            initializeHeader();
        } else if (attempts >= maxAttempts) {
            clearInterval(checkHeader);
        }
    }, 200);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitializeHeader);
} else {
    autoInitializeHeader();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeHeader };
}