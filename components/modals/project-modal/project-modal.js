// components/modals/project-modal/project-modal.js
(function() {
    'use strict';

    if (window.ProjectModal) {
        return;
    }

    class ProjectModal {
        constructor() {
            this.modal = null;
            this.overlay = null;
            this.isOpen = false;
            this.projectData = {};
            this.initialized = false;
            
            this.loadCSS();
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.safeInit());
            } else {
                setTimeout(() => this.safeInit(), 100);
            }
        }

        loadCSS() {
            const cssPath = 'components/modals/project-modal/project-modal.css';
            const existingLink = document.querySelector(`link[href="${cssPath}"]`);
            
            if (existingLink) {
                return;
            }
            
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            document.head.appendChild(link);
        }

        safeInit() {
            if (this.initialized) {
                return;
            }
            
            try {
                this.createModalStructure();
                this.setupEventListeners();
                this.integrateWithProjects();
                this.initialized = true;
            } catch (error) {
                setTimeout(() => {
                    this.safeInit();
                }, 500);
            }
        }

        createModalStructure() {
            const overlayId = 'projectModalOverlay';
            const modalId = 'projectModal';
            
            const existingOverlay = document.getElementById(overlayId);
            const existingModal = document.getElementById(modalId);
            const existingInstanceOverlay = document.getElementById('projectModalInstanceOverlay');
            const existingInstanceModal = document.getElementById('projectModalInstance');
            
            if (existingOverlay) existingOverlay.remove();
            if (existingModal) existingModal.remove();
            if (existingInstanceOverlay) existingInstanceOverlay.remove();
            if (existingInstanceModal) existingInstanceModal.remove();

            const modalHTML = `
                <div class="project-modal-overlay" id="${overlayId}">
                    <div class="project-modal-container" id="${modalId}">
                        <div class="project-modal-header">
                            <div class="project-modal-logo-title">
                                <img class="project-modal-logo" id="modalLogo" alt="Project Logo" onerror="this.style.display='none'">
                                <div class="project-title-section">
                                    <h2 class="project-modal-title" id="modalTitle">Loading Title...</h2>
                                    <p class="project-modal-subtitle" id="modalSubtitle">Loading Subtitle...</p>
                                </div>
                            </div>
                            <button class="project-modal-close" id="modalCloseBtn" aria-label="Close modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <div class="project-modal-content" id="modalContent">
                            <div class="project-modal-loading">Loading content...</div>
                        </div>

                        <div class="project-modal-footer">
                            <div class="project-modal-actions" id="modalActions">
                                <button class="project-modal-btn primary" disabled>Loading...</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
            
            this.modal = document.getElementById(modalId);
            this.overlay = document.getElementById(overlayId);
            
            if (this.overlay && this.modal) {
                this.overlay.style.visibility = 'hidden';
                this.overlay.style.opacity = '0';
                this.overlay.style.pointerEvents = 'none';
                this.overlay.style.display = 'flex';
                
                this.modal.style.visibility = 'hidden';
                this.modal.style.opacity = '0';
                this.modal.style.transform = 'translateY(20px)';
                
                this.modal.style.transition = 'all 0.3s ease';
                this.overlay.style.transition = 'all 0.3s ease';
            }
        }

        setupEventListeners() {
            const closeBtn = document.getElementById('modalCloseBtn');
            if (closeBtn) {
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                const newCloseBtn = document.getElementById('modalCloseBtn');
                
                newCloseBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.close();
                });
            }

            if (this.overlay) {
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay) {
                        this.close();
                    }
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }

        integrateWithProjects() {
            this.waitForCarousel();
        }

        waitForCarousel() {
            const maxAttempts = 10;
            let attempts = 0;

            const checkCarousel = () => {
                attempts++;
                
                if (window.projectsCarousel && window.projectsCarousel.isInitialized) {
                    this.makeCardsClickable();
                    return;
                }

                if (attempts < maxAttempts) {
                    setTimeout(checkCarousel, 300);
                } else {
                    this.makeCardsClickable();
                }
            };

            checkCarousel();
        }

        makeCardsClickable() {
            try {
                const cards = document.querySelectorAll('#projects .card');
                
                let clickableCards = 0;
                cards.forEach((card, index) => {
                    if (this.addCardClickListener(card, index)) {
                        clickableCards++;
                    }
                });
            } catch (error) {
                console.error('Error setting card clickability:', error);
            }
        }

        addCardClickListener(card, index) {
            if (card._hasModalClickListener) {
                return false;
            }

            card.style.cursor = 'pointer';
            
            const originalTransform = card.style.transform || '';
            const originalBoxShadow = card.style.boxShadow || '';
            
            card.addEventListener('mouseenter', () => {
                if (!this.isOpen) {
                    card.style.transform = 'translateY(-5px) scale(1.02)';
                    card.style.boxShadow = '0 15px 30px rgba(0, 255, 136, 0.2)';
                }
            });

            card.addEventListener('mouseleave', () => {
                if (!this.isOpen) {
                    card.style.transform = originalTransform;
                    card.style.boxShadow = originalBoxShadow;
                }
            });

            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const ignoredElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
                const isIgnored = ignoredElements.some(selector => 
                    e.target.closest(selector) || e.target.tagName === selector
                );

                if (isIgnored) {
                    return;
                }

                const projectId = this.getProjectIdFromCard(card);
                if (projectId) {
                    requestAnimationFrame(() => this.open(projectId));
                }
            };

            if (card._clickHandler) {
                card.removeEventListener('click', card._clickHandler);
            }

            card._clickHandler = clickHandler;
            card.addEventListener('click', clickHandler);

            card._hasModalClickListener = true;
            return true;
        }

        getProjectIdFromCard(card) {
            const title = card.querySelector('h3')?.textContent?.trim().toLowerCase();
            if (!title) return null;

            const projectMap = {
                'talent protocol': 'talent-protocol',
                'intract': 'intract', 
                'look hook': 'look-hook',
                'hellocelo': 'hello-celo',
                'hellovote': 'hello-vote',
                'your project here?': 'collaboration',
                'new project': 'coming-soon-1',
                'another network': 'coming-soon-2'
            };

            return projectMap[title] || null;
        }

        getProjectData(projectId) {
            const projects = {
                'talent-protocol': {
                    id: 'talent-protocol',
                    title: 'TALENT PROTOCOL',
                    subtitle: 'Your Web3 Reputation',
                    logo: 'images/talent.logo.svg',
                    
                    sections: [
                        {
                            title: 'WHAT IS TALENT PROTOCOL?',
                            icon: '🎯',
                            content: `Talent Protocol is a platform that changes how developers and creators present their work in the Web3 world. It works like a digital professional passport that automatically updates with your achievements on blockchains, GitHub, and other platforms. This is not a static CV - it's living proof of your skills and contributions to ecosystem development.`
                        },
                        {
                            title: 'WHAT DO YOU GAIN AS A USER?',
                            icon: '💫',
                            benefits: [
                                {
                                    icon: '🏆',
                                    title: 'VERIFIABLE REPUTATION',
                                    description: 'Your Builder Score shows the real impact of your work. Projects can easily verify your skills and experience.'
                                },
                                {
                                    icon: '💼',
                                    title: 'ACCESS TO OPPORTUNITIES',
                                    description: 'Receive invitations to interesting projects, grant programs, and collaboration opportunities tailored to your skills.'
                                },
                                {
                                    icon: '🌍',
                                    title: 'GLOBAL COMMUNITY',
                                    description: 'Join 11 million developers building the future of work in Web3 together. Exchange experiences and collaborate.'
                                }
                            ]
                        }
                    ],
                    stats: [
                        { number: "11M+", label: "Indexed Developers" },
                        { number: "1M+", label: "Active Talent Passports" },
                        { number: "40+", label: "Platform Integrations" }
                    ],
                    links: {
                        primary: { text: "🎯 CREATE YOUR TALENT PASSPORT", url: "https://talentprotocol.com" },
                        secondary: { text: "📚 EXPLORE DOCUMENTATION", url: "https://docs.talentprotocol.com" },
                        community: { text: "💬 JOIN DISCORD", url: "https://discord.gg/talentprotocol" }
                    }
                }
            };

            return projects[projectId] || {
                id: projectId,
                title: projectId.toUpperCase().replace('-', ' '),
                subtitle: 'Project Details',
                logo: '',
                sections: [
                    {
                        title: 'INFORMATION',
                        icon: 'ℹ️',
                        content: 'Detailed information about this project will be available soon.'
                    }
                ],
                stats: [],
                links: {
                    primary: { text: "🌐 HOME PAGE", url: "#" },
                    secondary: { text: "📚 DOCUMENTATION", url: "#" },
                    community: { text: "💬 COMMUNITY", url: "#" }
                }
            };
        }

        open(projectId) {
            if (!this.initialized) {
                return;
            }

            if (this._openingInProgress) {
                return;
            }

            this._openingInProgress = true;

            if (this.isOpen) {
                this.close();
                setTimeout(() => {
                    this._openingInProgress = false;
                    this.open(projectId);
                }, 300);
                return;
            }

            const projectData = this.getProjectData(projectId);
            if (!projectData) {
                this._openingInProgress = false;
                return;
            }

            this.projectData = projectData;
            this.renderModalContent();
            
            this.isOpen = true;
            this.overlay.style.pointerEvents = 'auto';
            
            requestAnimationFrame(() => {
                this.overlay.style.visibility = 'visible';
                this.overlay.style.opacity = '1';
                
                if (this.modal) {
                    this.modal.style.visibility = 'visible';
                    this.modal.style.opacity = '1';
                    this.modal.style.transform = 'translateY(0)';
                }
                
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    this._openingInProgress = false;
                }, 300);
            });
        }

        renderModalContent() {
            const { title, subtitle, logo, sections, stats, links } = this.projectData;

            const titleEl = document.getElementById('modalTitle');
            const subtitleEl = document.getElementById('modalSubtitle');
            
            if (titleEl) titleEl.textContent = title;
            if (subtitleEl) subtitleEl.textContent = subtitle;
            
            const logoImg = document.getElementById('modalLogo');
            if (logoImg && logo) {
                logoImg.src = logo;
                logoImg.alt = title;
                logoImg.style.display = 'block';
            } else if (logoImg) {
                logoImg.style.display = 'none';
            }

            const contentEl = document.getElementById('modalContent');
            const actionsEl = document.getElementById('modalActions');
            
            if (contentEl) contentEl.innerHTML = this.generateContentHTML(sections, stats);
            if (actionsEl) actionsEl.innerHTML = this.generateActionsHTML(links);
        }

        generateContentHTML(sections, stats) {
            try {
                let html = '';
                sections.forEach(section => {
                    html += `
                        <div class="project-modal-section">
                            <h3 class="project-modal-section-title">
                                <span>${section.icon}</span>
                                ${section.title}
                            </h3>
                    `;

                    if (section.content) {
                        const formattedContent = section.content.replace(/\n/g, '<br>');
                        html += `<div class="project-modal-text">${formattedContent}</div>`;
                    }

                    if (section.benefits) {
                        html += `<div class="project-modal-benefits">`;
                        section.benefits.forEach(benefit => {
                            html += `
                                <div class="project-modal-benefit">
                                    <div class="project-modal-benefit-icon">${benefit.icon}</div>
                                    <div class="project-modal-benefit-content">
                                        <h4>${benefit.title}</h4>
                                        <p>${benefit.description}</p>
                                    </div>
                                </div>
                            `;
                        });
                        html += `</div>`;
                    }

                    html += `</div>`;
                });

                if (stats && stats.length > 0) {
                    html += `<div class="project-modal-section">
                        <h3 class="project-modal-section-title">
                            <span>📊</span>
                            STATISTICS
                        </h3>
                        <div class="project-modal-stats">`;
                    
                    stats.forEach(stat => {
                        html += `
                            <div class="project-modal-stat">
                                <div class="project-modal-stat-number">${stat.number}</div>
                                <div class="project-modal-stat-label">${stat.label}</div>
                            </div>
                        `;
                    });
                    
                    html += `</div></div>`;
                }

                return html;
            } catch (error) {
                console.error('Error generating content:', error);
                return '<div class="project-modal-text">Error loading content</div>';
            }
        }

        generateActionsHTML(links) {
            return `
                <a href="${links.primary.url}" class="project-modal-btn primary" target="_blank" rel="noopener">
                    ${links.primary.text}
                </a>
                <a href="${links.secondary.url}" class="project-modal-btn secondary" target="_blank" rel="noopener">
                    ${links.secondary.text}
                </a>
                <a href="${links.community.url}" class="project-modal-btn community" target="_blank" rel="noopener">
                    ${links.community.text}
                </a>
            `;
        }

        close() {
            if (!this.isOpen || this._closingInProgress) return;
            
            this._closingInProgress = true;
            
            this.overlay.style.opacity = '0';
            this.overlay.style.pointerEvents = 'none';
            this.isOpen = false;
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (!this.isOpen) {
                    this.overlay.style.visibility = 'hidden';
                }
                this._closingInProgress = false;
            }, 300);
        }
    }

    window.ProjectModal = ProjectModal;

    const debuggerScript = document.createElement('script');
    debuggerScript.src = 'components/modals/project-modal/modal-debugger.js';
    document.head.appendChild(debuggerScript);

    window.projectModal = new ProjectModal();

})();
