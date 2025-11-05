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
      rippleStyle.textContent = `@keyframes ripple {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }`;
      document.head.appendChild(rippleStyle);
    }
  }

  async loadPageStructure() {
    const sections = [
      'components/modals/gm-modal/gm-modal',
      'components/header/header',
      'components/modals/auth-modal/auth-modal',
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
      
      // Załaduj CSS dla modali
      if (sectionPath.includes('modals/')) {
        await this.loadModalCSS(sectionPath);
      }
      
      if (sectionPath !== 'components/modals/project-modal/project-modal') {
        await this.loadJS(`${sectionPath}.js`);
      }
      this.loadedComponents.add(sectionPath);
    } catch (error) {
      console.warn(`Could not load ${sectionPath}:`, error);
    }
  }

  async loadModalCSS(modalPath) {
    return new Promise((resolve, reject) => {
      const cssPath = `${modalPath}.css`;
      const existingLink = document.querySelector(`link[href="${cssPath}"]`);
      if (existingLink) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => { 
        console.log(`✅ CSS loaded: ${cssPath}`);
        resolve(); 
      };
      link.onerror = () => {
        console.warn(`⚠️ CSS not found: ${cssPath}`);
        resolve(); // Kontynuuj nawet jeśli CSS nie istnieje
      };
      document.head.appendChild(link);
    });
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
    return new Promise((resolve, reject) => {
      const cssPath = 'components/modals/project-modal/project-modal.css';
      const existingLink = document.querySelector(`link[href="${cssPath}"]`);
      if (existingLink) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      link.onload = () => { resolve(); };
      link.onerror = () => {
        console.warn('⚠️ ProjectModal CSS not found, but continuing...');
        resolve();
      };
      document.head.appendChild(link);
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