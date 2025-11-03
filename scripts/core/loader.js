
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
        this.componentStyles = new Set();
    }

    async initialize() {
        try {
            
            this.addRippleStyles();
            
            
            document.addEventListener('click', this.createRippleEffect.bind(this));
            
            
            
            await this.loadPageStructure();
            
        } catch (error) {
            console.error('Failed to initialize page:', error);
            this.showErrorState();
        }
    }

    addRippleStyles() {
        
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
            
        }
    }

    async loadPageStructure() {
        
        const sections = [
            'components/modals/gm-modal/gm-modal',
            
            'components/header/header',           
            'sections/projects/projects',         
            'sections/gaming/gaming',             
            'components/sidebar/sidebar',
            'sections/about-project/about-project',
            'sections/community/community',
            'components/footer/footer'
        ];

        for (const section of sections) {
            await this.loadSection(section);
            
            
            
            if (section === 'components/header/header') {
                
                
                await new Promise(resolve => setTimeout(resolve, 300));
                
                
                this.initializeHeaderWithRetry();
            }
        }

        
        await this.loadProjectModalJS();
        
        
        const placeholder = document.querySelector('.loading-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

    
        
        this.initializeComponents();
    }

    async loadSection(sectionPath) {
        try {
            
            const htmlResponse = await fetch(`${sectionPath}.html`);
            if (!htmlResponse.ok) throw new Error(`HTML not found: ${sectionPath}`);
            
            const html = await htmlResponse.text();
            document.getElementById('mainContent').innerHTML += html;

            
            if (sectionPath !== 'components/modals/project-modal/project-modal') {
                
                await this.loadJS(`${sectionPath}.js`);
            }

            this.loadedComponents.add(sectionPath);
            
        } catch (error) {
            console.warn(`Could not load ${sectionPath}:`, error);
            
        }
    }

    
    async loadProjectModalJS() {
    
        
        try {
            
            await this.loadProjectModalCSS();
            
            
            await this.loadJS('components/modals/project-modal/project-modal.js');
            
            
        } catch (error) {
            console.error('❌ Failed to load ProjectModal:', error);
        }
    }

    
    async loadProjectModalCSS() {
        // Try multiple paths (absolute then relative). If both fail, inject fallback CSS inline so modal is usable on deploys
        return new Promise(async (resolve, reject) => {
            const candidates = ['/components/modals/project-modal/project-modal.css', 'components/modals/project-modal/project-modal.css'];

            // If any matching <link> already exists, we're done
            for (const p of candidates) {
                const existing = document.querySelector(`link[href="${p}"]`);
                if (existing) {
                    resolve();
                    return;
                }
            }

            // Try to HEAD each candidate to see if it exists, then append the first that responds OK
            for (const p of candidates) {
                try {
                    const res = await fetch(p, { method: 'HEAD' });
                    if (res && res.ok) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = p;
                        link.onload = () => resolve();
                        link.onerror = () => { console.warn('⚠️ ProjectModal CSS load failed for', p); resolve(); };
                        document.head.appendChild(link);
                        return;
                    }
                } catch (e) {
                    // ignore and try next
                }
            }

            // Fallback: inject a minimal inline copy of the modal CSS so the component is visible
            try {
                const style = document.createElement('style');
                style.setAttribute('data-project-modal-fallback', 'true');
                style.textContent = `
.project-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 10000; display: none; align-items: center; justify-content: center; padding: 20px; }
.project-modal-overlay.active { display: flex; animation: fadeIn 0.3s ease; opacity: 1; }
.project-modal-container { background: linear-gradient(135deg,#1a1a2e 0%,#16213e 100%); border: 1px solid rgba(0,255,136,0.3); border-radius: 20px; max-width: 800px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 40px rgba(0,255,136,0.2); transform: scale(0.9); opacity: 0; transition: all 0.3s ease; pointer-events: auto; }
.project-modal-overlay.active .project-modal-container { transform: scale(1); opacity: 1; }
.project-modal-header { display:flex; justify-content:space-between; align-items:flex-start; padding:30px 30px 20px; border-bottom:1px solid rgba(255,255,255,0.1); }
.project-modal-logo { width:50px; height:50px; border-radius:12px; object-fit:cover; }
.project-modal-title { font-size:24px; font-weight:bold; background:linear-gradient(135deg,#00ff88,#00ccff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin:0; }
.project-modal-subtitle { color:#888; margin:5px 0 0; font-size:14px; }
.project-modal-close { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:white; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s ease; }
.project-modal-content { padding:30px; }
.project-modal-section { margin-bottom:30px; }
.project-modal-section-title { font-size:18px; font-weight:bold; color:#00ff88; margin-bottom:15px; display:flex; align-items:center; gap:10px; }
.project-modal-text { color:#ccc; line-height:1.6; margin-bottom:15px; }
.project-modal-benefit { display:flex; align-items:flex-start; gap:15px; padding:15px; background:rgba(255,255,255,0.05); border-radius:10px; border-left:3px solid #00ff88; }
.project-modal-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:15px; margin:20px 0; }
.project-modal-footer { padding:20px 30px; border-top:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
                `;
                document.head.appendChild(style);
                console.warn('⚠️ ProjectModal CSS not found on server — injected fallback CSS');
                resolve();
                return;
            } catch (err) {
                console.warn('⚠️ Failed to inject fallback ProjectModal CSS', err);
                resolve();
            }
        });
    }

    async loadJS(jsPath) {
        return new Promise((resolve, reject) => {
            
            const existingScript = document.querySelector(`script[src="${jsPath}"]`);
            if (existingScript) {
                
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = jsPath;
            script.type = 'text/javascript';
            script.onload = resolve;
            script.onerror = () => {
                console.warn(`JS not found: ${jsPath}`);
                resolve(); 
            };
            document.body.appendChild(script);
            
            
        });
    }

    
    initializeHeaderWithRetry() {
        let retries = 0;
        const maxRetries = 5;
        
        const tryInitialize = () => {
            retries++;
            
            
            if (typeof initializeHeader === 'function') {
                initializeHeader();
                
                return true;
            } else if (window.initializeHeader) {
                window.initializeHeader();
                
                return true;
            } else {
                
                if (retries < maxRetries) {
                    setTimeout(tryInitialize, 500);
                } else {
                    
                    this.initializeHeaderEmergency();
                }
            }
        };
        
        tryInitialize();
    }

    
    initializeHeaderEmergency() {
    
        
        
        const dropdownButtons = document.querySelectorAll('.nav-dropdown-btn');
    
        
        dropdownButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                
                
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
                    
                }
            });
        });
        
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-dropdown-menu')) {
                document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
                document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
            }
        });
        
    
    }

    initializeComponents() {
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
        
    
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


const loader = new ComponentLoader();
loader.initialize();


setTimeout(() => {
    const mainContent = document.getElementById('mainContent');
    const allSections = mainContent ? mainContent.querySelectorAll('section') : [];

    

    
    const projectsSection = document.getElementById('projects');
    const gamingSection = document.getElementById('gaming-projects');
    const _debugSilent = {
        totalSections: allSections.length,
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
    };

}, 2000);
