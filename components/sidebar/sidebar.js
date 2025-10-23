class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.overlay = document.getElementById('sidebarOverlay');
        this.links = document.querySelectorAll('.sidebar-link');
        
        this.init();
    }

    init() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                this.setActiveLink(link);
                this.scrollToSection(targetId);
                
                if (window.innerWidth <= 768) {
                    this.close();
                }
            });
        });

        this.handleResponsive();
        window.addEventListener('resize', () => this.handleResponsive());
    }

    toggle() {
        if (this.sidebar.classList.contains('open')) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('active');
    }

    close() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
    }

    scrollToSection(targetId) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const tickerHeight = document.querySelector('.crypto-ticker')?.offsetHeight || 0;
            const headerHeight = 80;
            const offset = headerHeight + tickerHeight + 20;
            
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveLink(clickedLink) {
        this.links.forEach(link => link.parentElement.classList.remove('active'));
        clickedLink.parentElement.classList.add('active');
        
        const section = clickedLink.getAttribute('data-section');
        localStorage.setItem('activeSidebarSection', section);
    }

    handleResponsive() {
        const isMobile = window.innerWidth <= 768;
        const mainContent = document.getElementById('mainContent');
        
        if (mainContent) {
            if (!isMobile) {
                mainContent.classList.add('main-content-with-sidebar');
                this.close();
            } else {
                mainContent.classList.remove('main-content-with-sidebar');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.sidebarManager = new SidebarManager();
    }, 100);
});