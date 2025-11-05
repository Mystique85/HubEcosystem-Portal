class Web3Auth {
    constructor() {
        this.user = null;
        this.provider = null;
        this.init();
    }

    init() {
        console.log("🦊 Web3Auth initialized");
        this.checkExistingSession();
        this.setupEventListeners();
        
        // Poczekaj aż header się załaduje, potem zaktualizuj UI
        setTimeout(() => {
            console.log('⏰ Delayed UI update after header load');
            this.updateUI();
        }, 1000);
    }

    checkExistingSession() {
        const userData = localStorage.getItem('hub_user');
        if (userData) {
            this.user = JSON.parse(userData);
            console.log('📁 Found existing session:', this.user.shortAddress);
        } else {
            console.log('📁 No existing session found');
        }
    }

    async connectWallet() {
        try {
            console.log('🦊 Connecting wallet...');
            
            // Sprawdź czy MetaMask jest dostępny
            if (typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask or another Web3 wallet!');
                return null;
            }

            // Poproś o połączenie z portfelem
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const address = accounts[0];
            
            // Prosta weryfikacja bez podpisywania (na początek)
            this.user = {
                address: address,
                shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
                signed: true,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('hub_user', JSON.stringify(this.user));
            this.updateUI();
            
            console.log('✅ Wallet connected:', this.user.shortAddress);
            
            // Pokaz powiadomienie o sukcesie
            this.showSuccessNotification();
            
            return this.user;
            
        } catch (error) {
            console.error('❌ Wallet connection failed:', error);
            if (error.code === 4001) {
                alert('Connection rejected by user');
            } else {
                alert('Wallet connection failed: ' + error.message);
            }
            return null;
        }
    }

    showSuccessNotification() {
        // Utwórz tymczasowe powiadomienie
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #00ff88; color: #0a0a0a; padding: 12px 20px; border-radius: 8px; z-index: 10000; font-weight: bold; box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);">
                ✅ Successfully connected!
            </div>
        `;
        document.body.appendChild(notification);
        
        // Usuń po 3 sekundach
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    disconnect() {
        console.log('👋 Disconnecting user...');
        
        // Usuń dane użytkownika
        localStorage.removeItem('hub_user');
        this.user = null;
        this.provider = null;
        
        // Zamknij dropdown
        this.closeUserDropdown();
        
        // Zaktualizuj UI
        this.updateUI();
        
        console.log('✅ User disconnected');
        
        // Pokaz powiadomienie o wylogowaniu
        this.showDisconnectNotification();
    }

    showDisconnectNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #ff4444; color: white; padding: 12px 20px; border-radius: 8px; z-index: 10000; font-weight: bold; box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);">
                👋 Disconnected
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    closeUserDropdown() {
        const userDropdown = document.querySelector('.nav-user-btn')?.closest('.nav-dropdown');
        if (userDropdown) {
            const dropdownMenu = userDropdown.querySelector('.nav-dropdown-menu');
            const userPanelBtn = document.getElementById('userPanelBtn');
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            if (userPanelBtn) userPanelBtn.classList.remove('active');
        }
    }

    toggleUserDropdown() {
        const userDropdown = document.querySelector('.nav-user-btn')?.closest('.nav-dropdown');
        if (!userDropdown) {
            console.log('❌ User dropdown not found');
            return;
        }

        const dropdownMenu = userDropdown.querySelector('.nav-dropdown-menu');
        const userPanelBtn = document.getElementById('userPanelBtn');
        
        if (!dropdownMenu || !userPanelBtn) {
            console.log('❌ Dropdown elements not found');
            return;
        }

        const isOpen = dropdownMenu.classList.contains('show');
        
        // Zamknij wszystkie dropdowny
        this.closeAllDropdowns();
        
        // Otwórz/zamknij user dropdown
        if (!isOpen) {
            dropdownMenu.classList.add('show');
            userPanelBtn.classList.add('active');
            console.log('✅ User dropdown opened');
        } else {
            console.log('✅ User dropdown closed');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            if (menu) menu.classList.remove('show');
        });
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        // Also remove active class from userPanelBtn
        const userPanelBtn = document.getElementById('userPanelBtn');
        if (userPanelBtn) userPanelBtn.classList.remove('active');
    }

    updateUI() {
        const signBtn = document.getElementById('signBtn');
        const gmBtn = document.getElementById('gmBtn');
        const userPanelBtn = document.getElementById('userPanelBtn');
        const userAddress = document.getElementById('userAddress');
        const dropdownUserAddress = document.getElementById('dropdownUserAddress');
        const mobileUserSection = document.getElementById('mobileUserSection');
        const mobileUserAddress = document.getElementById('mobileUserAddress');
        const mobileSignBtn = document.getElementById('mobileSignBtn');
        const mobileGmBtn = document.getElementById('mobileGmBtn');

        console.log('🔄 Updating UI - User:', this.user);

        if (this.user) {
            // Użytkownik zalogowany
            console.log('✅ User logged in, showing GM button');
            if (signBtn) signBtn.style.display = 'none';
            if (gmBtn) gmBtn.style.display = 'flex';
            if (userPanelBtn) {
                userPanelBtn.style.display = 'flex';
                if (userAddress) userAddress.textContent = this.user.shortAddress;
            }
            if (dropdownUserAddress) dropdownUserAddress.textContent = this.user.shortAddress;
            if (mobileUserSection) mobileUserSection.style.display = 'block';
            if (mobileUserAddress) mobileUserAddress.textContent = this.user.shortAddress;
            if (mobileSignBtn) mobileSignBtn.style.display = 'none';
            if (mobileGmBtn) mobileGmBtn.style.display = 'flex';
        } else {
            // Użytkownik niezalogowany
            console.log('❌ User not logged in, showing SIGN button');
            if (signBtn) signBtn.style.display = 'flex';
            if (gmBtn) gmBtn.style.display = 'none';
            if (userPanelBtn) userPanelBtn.style.display = 'none';
            if (mobileUserSection) mobileUserSection.style.display = 'none';
            if (mobileSignBtn) mobileSignBtn.style.display = 'flex';
            if (mobileGmBtn) mobileGmBtn.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Bezpośrednie event listeners bez opóźnienia
        const setupListeners = () => {
            console.log('🎯 Setting up direct event listeners');
            
            // Disconnect button - bezpośredni event listener
            const disconnectBtn = document.getElementById('disconnectBtn');
            const mobileDisconnectBtn = document.getElementById('mobileDisconnectBtn');
            
            if (disconnectBtn) {
                disconnectBtn.addEventListener('click', (e) => {
                    console.log('🔴 DIRECT: Disconnect button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.disconnect();
                });
            }
            
            if (mobileDisconnectBtn) {
                mobileDisconnectBtn.addEventListener('click', (e) => {
                    console.log('🔴 DIRECT: Mobile disconnect button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.disconnect();
                });
            }

            // Sign button - otwórz modal zamiast bezpośrednio łączyć
            const signBtn = document.getElementById('signBtn');
            const mobileSignBtn = document.getElementById('mobileSignBtn');
            
            if (signBtn) {
                signBtn.addEventListener('click', (e) => {
                    console.log('🔵 SIGN button clicked - opening auth modal');
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.authModal) {
                        window.authModal.open();
                    } else {
                        // Fallback - bezpośrednie połączenie jeśli modal nie działa
                        this.connectWallet();
                    }
                });
            }
            
            if (mobileSignBtn) {
                mobileSignBtn.addEventListener('click', (e) => {
                    console.log('🔵 MOBILE SIGN button clicked - opening auth modal');
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.authModal) {
                        window.authModal.open();
                    } else {
                        // Fallback
                        this.connectWallet();
                    }
                });
            }
        };

        // Uruchom od razu i z opóźnieniem dla bezpieczeństwa
        setupListeners();
        setTimeout(setupListeners, 2000);
        
        // Pozostałe event listeners z opóźnieniem
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                // User Panel Dropdown
                if (e.target.closest('#userPanelBtn')) {
                    console.log('🔵 User panel button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleUserDropdown();
                }
                
                // Zamknij dropdowny przy kliknięciu poza
                if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-dropdown-menu')) {
                    this.closeAllDropdowns();
                }
            });
            
            // Zapobiegaj zamykaniu przy kliknięciu w dropdown menu
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                if (menu) {
                    menu.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            });
            
        }, 1500);
    }
}

// Globalna instancja
window.web3Auth = new Web3Auth();