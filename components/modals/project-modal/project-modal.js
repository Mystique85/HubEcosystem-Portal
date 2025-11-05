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
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                'karma gap': 'karma-gap',
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
                'karma-gap': {
                    id: 'karma-gap',
                    title: 'KARMA GAP',
                    subtitle: 'On-Chain Grant Accountability Protocol',
                    logo: 'images/karma-gap.png',
                    logoStyle: 'width: 200px; height: auto; max-height: 80px;',
                    showTitleInHeader: false,
                    
                    sections: [
                        {
                            title: 'WHAT IS KARMA GAP?',
                            icon: '🌱',
                            content: `Karma GAP (Grantee Accountability Protocol) provides the foundational infrastructure for on-chain reputation in the grants ecosystem. It allows grantees to build a verifiable track record of their work and enables funders to measure impact with transparency and data-driven insights.

The protocol addresses critical problems in the grant ecosystem: lack of standardized reporting, scattered information that's hard to track, and the inability for grantees to carry their reputation across different ecosystems and DAOs.`
                        },
                        {
                            title: 'CORE SOLUTIONS & TECHNOLOGY',
                            icon: '🚀',
                            content: `Karma GAP leverages Ethereum Attestation Service (EAS) for on-chain reporting, allowing grantees to self-report progress and milestones directly on-chain. This creates permanent, tamper-resistant records of work that are accessible across the entire Web3 ecosystem.

The protocol enables universal data access by storing grant-related data on-chain, reducing reliance on external links and manual tracking. This structured, permissionless data layer enables better analytics and tooling for the entire grants ecosystem.`
                        },
                        {
                            title: 'KEY FEATURES & BENEFITS',
                            icon: '💫',
                            benefits: [
                                {
                                    icon: '📊',
                                    title: 'ON-CHAIN REPUTATION BUILDING',
                                    description: 'Grantees can establish verifiable track records that travel with them across different DAOs and ecosystems, eliminating the need to start from scratch with each new grant application.'
                                },
                                {
                                    icon: '🌍',
                                    title: 'PORTABLE REPUTATION PROFILES',
                                    description: 'Build a unified reputation profile that showcases your complete grant history, progress updates, and milestone achievements across multiple ecosystems and funding programs.'
                                },
                                {
                                    icon: '⚙️',
                                    title: 'DEVELOPER-FRIENDLY INFRASTRUCTURE',
                                    description: 'With the karma-gap-sdk, developers can build custom applications and analytics on top of standardized, structured on-chain grant data, enabling novel tools for impact analysis and grant evaluation.'
                                },
                                {
                                    icon: '🔍',
                                    title: 'TRANSPARENCY & ACCOUNTABILITY',
                                    description: 'Grant programs and DAOs gain unprecedented visibility into how funds are being used, project progress, and outcomes, enabling data-driven capital allocation decisions.'
                                }
                            ]
                        },
                        {
                            title: 'ECOSYSTEM IMPACT & ADOPTION',
                            icon: '📈',
                            content: `Karma GAP is trusted by 25+ leading on-chain communities including Gitcoin, Optimism, Arbitrum, Moonbeam, and ENS. The platform has indexed 60,000+ delegates and tracks 2,000+ grants with 700+ grant updates recorded on-chain.

The protocol represents a fundamental shift in how public goods funding and grant programs operate in Web3, moving from opaque, siloed reporting to transparent, verifiable, and interoperable reputation systems.`
                        }
                    ],
                    stats: [
                        { number: "2,000+", label: "Grants Tracked" },
                        { number: "60,000+", label: "Delegates Indexed" },
                        { number: "25+", label: "On-chain Communities" },
                        { number: "700+", label: "Grant Updates" }
                    ],
                    links: {
                        primary: { text: "🚀 Explore GAP Protocol", url: "https://gap.karmahq.xyz" },
                        secondary: { text: "📚 Documentation", url: "https://docs.gap.karmahq.xyz" },
                        community: { text: "💬 Join Discord", url: "https://discord.gg/karmahq" },
                        twitter: { text: "🐦 Follow on X", url: "https://x.com/karmahq_" }
                    }
                },
                'talent-protocol': {
                    id: 'talent-protocol',
                    title: 'TALENT PROTOCOL',
                    subtitle: 'Your Web3 Reputation',
                    logo: 'images/talent.logo.svg',
                    logoStyle: 'width: 50px; height: 50px;',
                    showTitleInHeader: true,
                    
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
                        primary: { text: "🎯 Create Your Talent Passport", url: "https://talentprotocol.com" },
                        secondary: { text: "📚 Explore Documentation", url: "https://docs.talentprotocol.com" },
                        community: { text: "💬 Join Discord", url: "https://discord.gg/talentprotocol" },
                        twitter: { text: "🐦 Follow on X", url: "https://x.com/talentprotocol" }
                    }
                },
                'intract': {
                    id: 'intract',
                    title: 'INTRACT',
                    subtitle: 'Web3 Quest Platform',
                    logo: 'images/intract.logo.svg',
                    logoStyle: 'width: 50px; height: 50px;',
                    showTitleInHeader: true,
                    
                    sections: [
                        {
                            title: 'WHAT IS INTRACT?',
                            icon: '🎮',
                            content: `Intract is a leading Web3 quest platform that helps users discover and engage with new blockchain projects through gamified experiences. Complete quests, earn rewards, and explore the ecosystem in a fun and interactive way.`
                        },
                        {
                            title: 'KEY FEATURES',
                            icon: '🚀',
                            benefits: [
                                {
                                    icon: '🏆',
                                    title: 'GAMIFIED EXPERIENCE',
                                    description: 'Complete quests and challenges to earn points and rewards while learning about new projects.'
                                },
                                {
                                    icon: '💰',
                                    title: 'REWARD SYSTEM',
                                    description: 'Earn tokens, NFTs, and other rewards for your participation and engagement with projects.'
                                },
                                {
                                    icon: '🌐',
                                    title: 'ECOSYSTEM DISCOVERY',
                                    description: 'Discover new projects and protocols across multiple blockchain ecosystems.'
                                }
                            ]
                        }
                    ],
                    stats: [
                        { number: "500K+", label: "Active Users" },
                        { number: "1000+", label: "Projects" },
                        { number: "50+", label: "Blockchains" }
                    ],
                    links: {
                        primary: { text: "🎮 Start Quests", url: "https://intract.io" },
                        secondary: { text: "📚 Documentation", url: "https://docs.intract.io" },
                        community: { text: "💬 Join Discord", url: "https://discord.gg/intract" },
                        twitter: { text: "🐦 Follow on X", url: "https://x.com/IntractQuests" }
                    }
                },
                'look-hook': {
                    id: 'look-hook',
                    title: 'LOOK HOOK',
                    subtitle: 'NFT Analytics Platform',
                    logo: 'images/lookhook.logo.svg',
                    logoStyle: 'width: 50px; height: 50px;',
                    showTitleInHeader: true,
                    
                    sections: [
                        {
                            title: 'WHAT IS LOOK HOOK?',
                            icon: '📊',
                            content: `Look Hook provides advanced analytics and insights for NFT markets. Track sales, trends, and market data across multiple platforms to make informed investment decisions.`
                        }
                    ],
                    stats: [
                        { number: "50K+", label: "NFT Collections" },
                        { number: "10M+", label: "Sales Tracked" },
                        { number: "20+", label: "Marketplaces" }
                    ],
                    links: {
                        primary: { text: "📊 Explore Analytics", url: "https://lookhook.com" },
                        secondary: { text: "📚 API Docs", url: "https://docs.lookhook.com" },
                        community: { text: "💬 Join Discord", url: "https://discord.gg/lookhook" },
                        twitter: { text: "🐦 Follow on X", url: "https://x.com/HashCoinFarm" }
                    }
                },
                'hello-celo': {
                    id: 'hello-celo',
                    title: 'HELLO CELO',
                    subtitle: 'Celo Ecosystem Onboarding',
                    logo: 'images/celo.logo.svg',
                    logoStyle: 'width: 50px; height: 50px;',
                    showTitleInHeader: true,
                    
                    sections: [
                        {
                            title: 'WHAT IS HELLO CELO?',
                            icon: '🌍',
                            content: `Hello Celo is an onboarding platform designed to help users discover and participate in the Celo ecosystem. Learn about Celo protocols, earn rewards, and join the mobile-first blockchain revolution.`
                        }
                    ],
                    stats: [
                        { number: "1M+", label: "Users Onboarded" },
                        { number: "100+", label: "Projects" },
                        { number: "$10M+", label: "Rewards Distributed" }
                    ],
                    links: {
                        primary: { text: "🌍 Join Celo", url: "https://celo.org" },
                        secondary: { text: "📚 Learn More", url: "https://docs.celo.org" },
                        community: { text: "💬 Join Discord", url: "https://discord.gg/celo" },
                        twitter: { text: "🐦 Follow on X", url: "https://x.com/HelloCelo_HC" }
                    }
                }
            };

            return projects[projectId] || {
                id: projectId,
                title: projectId.toUpperCase().replace('-', ' '),
                subtitle: 'Project Details',
                logo: '',
                logoStyle: 'width: 50px; height: 50px;',
                showTitleInHeader: true,
                sections: [
                    {
                        title: 'INFORMATION',
                        icon: 'ℹ️',
                        content: 'Detailed information about this project will be available soon.'
                    }
                ],
                stats: [],
                links: {
                    primary: { text: "🌐 Home Page", url: "#" },
                    secondary: { text: "📚 Documentation", url: "#" },
                    community: { text: "💬 Community", url: "#" },
                    twitter: { text: "🐦 Follow on X", url: "#" }
                }
            };
        }

        open(projectId) {
            if (!this.initialized) {
                return;
            }

            if (this.isOpen) {
                this.close();
                setTimeout(() => this.open(projectId), 350);
                return;
            }

            const projectData = this.getProjectData(projectId);
            if (!projectData) {
                return;
            }

            this.projectData = projectData;
            this.renderModalContent();
            
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
            
            this.overlay.style.visibility = 'visible';
            this.overlay.style.opacity = '1';
            this.overlay.style.pointerEvents = 'auto';
            this.overlay.style.display = 'flex';
            
            this.modal.style.visibility = 'visible';
            this.modal.style.opacity = '1';
            this.modal.style.transform = 'translateY(0)';
            this.modal.style.display = 'block';
        }

        renderModalContent() {
            const { title, subtitle, logo, logoStyle, showTitleInHeader, sections, stats, links } = this.projectData;

            const contentEl = document.getElementById('modalContent');
            let contentHTML = '';
            
            // Tytuł w content będzie wyświetlany TYLKO jeśli showTitleInHeader jest true
            if (showTitleInHeader) {
                contentHTML += `
                    <div class="project-modal-section" style="margin-top: 0; padding-top: 0;">
                        <h2 class="project-modal-main-title">${title}</h2>
                        ${subtitle ? `<p class="project-modal-main-subtitle">${subtitle}</p>` : ''}
                    </div>
                `;
            }
            
            contentHTML += this.generateContentHTML(sections, stats);
            
            if (contentEl) contentEl.innerHTML = contentHTML;
            
            const logoImg = document.getElementById('modalLogo');
            if (logoImg && logo) {
                logoImg.src = logo;
                logoImg.alt = title;
                logoImg.style.display = 'block';
                
                if (logoStyle) {
                    logoImg.style.cssText += logoStyle;
                }
                
                if (!showTitleInHeader) {
                    logoImg.style.margin = '0 auto';
                }
            } else if (logoImg) {
                logoImg.style.display = 'none';
            }

            const actionsEl = document.getElementById('modalActions');
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
                <a href="${links.primary.url}" class="project-modal-btn primary small" target="_blank" rel="noopener">
                    ${links.primary.text}
                </a>
                <a href="${links.secondary.url}" class="project-modal-btn secondary small" target="_blank" rel="noopener">
                    ${links.secondary.text}
                </a>
                <a href="${links.community.url}" class="project-modal-btn community small" target="_blank" rel="noopener">
                    ${links.community.text}
                </a>
                <a href="${links.twitter.url}" class="project-modal-btn twitter small" target="_blank" rel="noopener">
                    ${links.twitter.text}
                </a>
            `;
        }

        close() {
            if (!this.isOpen) return;
            
            this.overlay.style.opacity = '0';
            this.overlay.style.pointerEvents = 'none';
            
            this.modal.style.opacity = '0';
            this.modal.style.transform = 'translateY(20px)';
            
            this.isOpen = false;
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (!this.isOpen) {
                    this.overlay.style.visibility = 'hidden';
                    this.modal.style.visibility = 'hidden';
                }
            }, 300);
        }
    }

    window.ProjectModal = ProjectModal;
    window.projectModal = new ProjectModal();
})();