// scripts/core/loader.js
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.componentStyles = new Set();
    }

    async initialize() {
        try {
            // Add ripple animation styles FIRST
            this.addRippleStyles();
            
            // ADD RIPPLE LISTENER IMMEDIATELY - TO DZIAŁAŁO!
            document.addEventListener('click', this.createRippleEffect.bind(this));
            console.log('Ripple effect ENABLED');
            
            // Load page structure
            await this.loadPageStructure();
            
        } catch (error) {
            console.error('Failed to initialize page:', error);
            this.showErrorState();
        }
    }

    addRippleStyles() {
        // Add ripple animation styles only once
        if (!document.querySelector('style[data-ripple]')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.setAttribute('data-ripple', 'true');
            rippleStyle.textContent = `
                @keyframes ripple {
                    0% {
                        transform: scale(0.5);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
            console.log('Ripple styles added');
        }
    }

    async loadPageStructure() {
        // NOWA KOLEJNOŚĆ: Header → Ticker → Projects → Gaming
        const sections = [
            'components/modals/gm-modal/gm-modal',
            'components/header/header',           // PIERWSZE: Header
            'sections/projects/projects',         // TRZECIE: Projects
            'sections/gaming/gaming',             // CZWARTE: Gaming ← DODANE
            'components/sidebar/sidebar',
            'sections/about-project/about-project',
            'sections/community/community',
            'components/footer/footer'
        ];

        for (const section of sections) {
            await this.loadSection(section);
            console.log(`✅ Loaded: ${section}`);
            
            // SPECJALNA OBSŁUGA HEADERA - DROPDOWN FIX
            if (section === 'components/header/header') {
                console.log('🎯 SPECIAL: Header loaded, waiting for initialization...');
                // Daj czas na renderowanie DOM
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Inicjalizuj header wielokrotnie dla pewności
                this.initializeHeaderWithRetry();
            }
        }
        
        // Hide loading placeholder
        const placeholder = document.querySelector('.loading-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        console.log('🎯 ALL SECTIONS LOADED - Nowa kolejność: Header → Ticker → Projects → Gaming');
        
        this.initializeComponents();
    }

    async loadSection(sectionPath) {
        try {
            // Load HTML
            const htmlResponse = await fetch(`${sectionPath}.html`);
            if (!htmlResponse.ok) throw new Error(`HTML not found: ${sectionPath}`);
            
            const html = await htmlResponse.text();
            document.getElementById('mainContent').innerHTML += html;

            // NIE ładujemy CSS - wszystkie style są w core.css (Tailwind)
            console.log(`✅ Skipped CSS for: ${sectionPath}`);

            // Load JS (if exists)
            await this.loadJS(`${sectionPath}.js`);

            this.loadedComponents.add(sectionPath);
            
        } catch (error) {
            console.warn(`Could not load ${sectionPath}:`, error);
            // Continue loading other sections even if one fails
        }
    }

    async loadJS(jsPath) {
        return new Promise((resolve, reject) => {
            // 🔥 DODANE: Sprawdź czy skrypt już istnieje - VERCEL FIX
            const existingScript = document.querySelector(`script[src="${jsPath}"]`);
            if (existingScript) {
                console.log(`⚠️ Script already loaded: ${jsPath}`);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = jsPath;
            // POPRAWIONE: text/javascript zamiast module
            script.type = 'text/javascript';
            script.onload = resolve;
            script.onerror = () => {
                console.warn(`JS not found: ${jsPath}`);
                resolve(); // Don't break loading if JS is missing
            };
            document.body.appendChild(script);
            
            console.log(`📦 Loading script: ${jsPath}`);
        });
    }

    // NOWA METODA: Inicjalizacja header-a z wielokrotnymi próbami
    initializeHeaderWithRetry() {
        let retries = 0;
        const maxRetries = 5;
        
        const tryInitialize = () => {
            retries++;
            console.log(`🔄 HEADER INIT: Attempt ${retries}/${maxRetries}`);
            
            if (typeof initializeHeader === 'function') {
                initializeHeader();
                console.log('✅ HEADER INIT: Successfully initialized via loader');
                return true;
            } else if (window.initializeHeader) {
                window.initializeHeader();
                console.log('✅ HEADER INIT: Successfully initialized via window object');
                return true;
            } else {
                console.log(`⚠️ HEADER INIT: initializeHeader not found, retrying...`);
                if (retries < maxRetries) {
                    setTimeout(tryInitialize, 500);
                } else {
                    console.log('❌ HEADER INIT: Failed after max retries, trying emergency init...');
                    this.initializeHeaderEmergency();
                }
            }
        };
        
        tryInitialize();
    }

    // NOWA METODA: Awaryjna inicjalizacja header-a
    initializeHeaderEmergency() {
        console.log('🚨 EMERGENCY: Manual header initialization');
        
        // Bezpośrednie ustawienie event listenerów
        const dropdownButtons = document.querySelectorAll('.nav-dropdown-btn');
        console.log(`🚨 EMERGENCY: Found ${dropdownButtons.length} dropdown buttons`);
        
        dropdownButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('🚨 EMERGENCY: Dropdown clicked');
                
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
                
                // Otwórz aktualny
                if (!isOpen) {
                    dropdownMenu.classList.add('show');
                    btn.classList.add('active');
                    console.log('✅ EMERGENCY: Dropdown opened');
                }
            });
        });
        
        // Zamknij przy kliknięciu poza
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-dropdown-menu')) {
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                console.log('👆 EMERGENCY: All dropdowns closed');
            }
        });
        
        console.log('✅ EMERGENCY: Header dropdowns initialized manually');
    }

    initializeComponents() {
        // Smooth scrolling - tylko to tutaj
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
        
        console.log('GM Popover i inne komponenty zainicjalizowane');
    }

    createRippleEffect(e) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX - 25}px;
            top: ${e.clientY - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: ripple 1s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }

    showErrorState() {
        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="flex items-center justify-center min-h-screen text-center">
                <div>
                    <h2 class="text-accent-neon mb-4 text-2xl">Błąd ładowania</h2>
                    <p class="text-text-gray">Odśwież stronę lub spróbuj ponownie później.</p>
                </div>
            </div>
        `;
    }
}

// Initialize loader
const loader = new ComponentLoader();
loader.initialize();

// Debug: Sprawdź finalną strukturę po załadowaniu
setTimeout(() => {
    console.log('🔍 FINAL STRUCTURE CHECK:');
    const mainContent = document.getElementById('mainContent');
    const allSections = mainContent.querySelectorAll('section');
    
    console.log(`📊 Total sections loaded: ${allSections.length}`);
    
    allSections.forEach((section, index) => {
        console.log(`🏷️  Section ${index + 1}:`, {
            id: section.id,
            className: section.className,
            visible: section.offsetParent !== null,
            children: section.children.length
        });
    });
    
    // Sprawdź konkretnie sekcje projects i gaming
    const projectsSection = document.getElementById('projects');
    const gamingSection = document.getElementById('gaming-projects');
    
    console.log('🎯 CRITICAL SECTIONS CHECK:', {
        projects: {
            exists: !!projectsSection,
            visible: projectsSection ? projectsSection.offsetParent !== null : false,
            children: projectsSection ? projectsSection.children.length : 0
        },
        gaming: {
            exists: !!gamingSection, 
            visible: gamingSection ? gamingSection.offsetParent !== null : false,
            children: gamingSection ? gamingSection.children.length : 0
        }
    });
    
}, 2000);
