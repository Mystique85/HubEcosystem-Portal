class Web3Auth {
    constructor() {
        this.user = null;
        this.provider = null;
        this.init();
    }

    init() {
        this.checkExistingSession();
        this.setupEventListeners();
        
        // SZYBSZA INICJALIZACJA UI
        setTimeout(() => {
            this.updateUI();
        }, 300);
    }

    checkExistingSession() {
        const userData = localStorage.getItem('hub_user');
        if (userData) {
            this.user = JSON.parse(userData);
        }
    }

    async connectWallet() {
        try {
            if (typeof window.ethereum === 'undefined') {
                alert('Please install MetaMask or another Web3 wallet!');
                return null;
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const address = accounts[0];
            
            this.user = {
                address: address,
                shortAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
                signed: true,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('hub_user', JSON.stringify(this.user));
            this.updateUI();
            
            this.showSuccessNotification();
            
            return this.user;
            
        } catch (error) {
            if (error.code === 4001) {
                alert('Connection rejected by user');
            } else {
                alert('Wallet connection failed: ' + error.message);
            }
            return null;
        }
    }

    showSuccessNotification() {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #00ff88; color: #0a0a0a; padding: 12px 20px; border-radius: 8px; z-index: 10000; font-weight: bold; box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);">
                ✅ Successfully connected!
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    disconnect() {
        localStorage.removeItem('hub_user');
        this.user = null;
        this.provider = null;
        
        this.closeUserDropdown();
        this.updateUI();
        
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
            return;
        }

        const dropdownMenu = userDropdown.querySelector('.nav-dropdown-menu');
        const userPanelBtn = document.getElementById('userPanelBtn');
        
        if (!dropdownMenu || !userPanelBtn) {
            return;
        }

        const isOpen = dropdownMenu.classList.contains('show');
        
        this.closeAllDropdowns();
        
        if (!isOpen) {
            dropdownMenu.classList.add('show');
            userPanelBtn.classList.add('active');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
            if (menu) menu.classList.remove('show');
        });
        document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        const userPanelBtn = document.getElementById('userPanelBtn');
        if (userPanelBtn) userPanelBtn.classList.remove('active');
    }

    // POPRAWIONA METODA updateUI - KLUCZOWA ZMIANA!
    updateUI() {
        const isLoggedIn = !!this.user;
        
        // Desktop buttons
        const signBtn = document.getElementById('signBtn');
        const gmBtn = document.getElementById('gmBtn');
        const userPanelBtn = document.getElementById('userPanelBtn');
        const userAddress = document.getElementById('userAddress');
        const dropdownUserAddress = document.getElementById('dropdownUserAddress');
        
        // Mobile buttons
        const mobileUserSection = document.getElementById('mobileUserSection');
        const mobileUserAddress = document.getElementById('mobileUserAddress');
        const mobileSignBtn = document.getElementById('mobileSignBtn');
        const mobileGmBtn = document.getElementById('mobileGmBtn');

        if (isLoggedIn) {
            // USER LOGGED IN - hide SIGN, show GM & user panel
            if (signBtn) {
                signBtn.style.display = 'none';
                signBtn.style.visibility = 'hidden';
            }
            if (gmBtn) {
                gmBtn.style.display = 'flex';
                gmBtn.style.visibility = 'visible';
            }
            if (userPanelBtn) {
                userPanelBtn.style.display = 'flex';
                userPanelBtn.style.visibility = 'visible';
                if (userAddress) userAddress.textContent = this.user.shortAddress;
            }
            if (dropdownUserAddress) dropdownUserAddress.textContent = this.user.shortAddress;
            
            // Mobile
            if (mobileUserSection) {
                mobileUserSection.style.display = 'block';
                mobileUserSection.style.visibility = 'visible';
            }
            if (mobileUserAddress) mobileUserAddress.textContent = this.user.shortAddress;
            if (mobileSignBtn) {
                mobileSignBtn.style.display = 'none';
                mobileSignBtn.style.visibility = 'hidden';
            }
            if (mobileGmBtn) {
                mobileGmBtn.style.display = 'flex';
                mobileGmBtn.style.visibility = 'visible';
            }
        } else {
            // USER NOT LOGGED IN - ALWAYS show SIGN, hide others
            if (signBtn) {
                signBtn.style.display = 'flex';
                signBtn.style.visibility = 'visible';
                signBtn.style.opacity = '1';
                signBtn.style.pointerEvents = 'auto';
            }
            if (gmBtn) {
                gmBtn.style.display = 'none';
                gmBtn.style.visibility = 'hidden';
            }
            if (userPanelBtn) {
                userPanelBtn.style.display = 'none';
                userPanelBtn.style.visibility = 'hidden';
            }
            
            // Mobile
            if (mobileUserSection) {
                mobileUserSection.style.display = 'none';
                mobileUserSection.style.visibility = 'hidden';
            }
            if (mobileSignBtn) {
                mobileSignBtn.style.display = 'flex';
                mobileSignBtn.style.visibility = 'visible';
                mobileSignBtn.style.opacity = '1';
            }
            if (mobileGmBtn) {
                mobileGmBtn.style.display = 'none';
                mobileGmBtn.style.visibility = 'hidden';
            }
        }
    }

    setupEventListeners() {
        const setupListeners = () => {
            const disconnectBtn = document.getElementById('disconnectBtn');
            const mobileDisconnectBtn = document.getElementById('mobileDisconnectBtn');
            
            if (disconnectBtn) {
                disconnectBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.disconnect();
                });
            }
            
            if (mobileDisconnectBtn) {
                mobileDisconnectBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.disconnect();
                });
            }

            const signBtn = document.getElementById('signBtn');
            const mobileSignBtn = document.getElementById('mobileSignBtn');
            
            if (signBtn) {
                // Usuń istniejące event listeners i dodaj nowy
                signBtn.replaceWith(signBtn.cloneNode(true));
                const freshSignBtn = document.getElementById('signBtn');
                
                freshSignBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.authModal) {
                        window.authModal.open();
                    } else {
                        this.connectWallet();
                    }
                });
            }
            
            if (mobileSignBtn) {
                mobileSignBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (window.authModal) {
                        window.authModal.open();
                    } else {
                        this.connectWallet();
                    }
                });
            }
        };

        // Szybsze i pewniejsze setup event listeners
        setTimeout(setupListeners, 500);
        setTimeout(setupListeners, 1500); // Backup
        
        // Dropdown handling
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (e.target.closest('#userPanelBtn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleUserDropdown();
                }
                
                if (!e.target.closest('.nav-dropdown') && !e.target.closest('.nav-dropdown-menu')) {
                    this.closeAllDropdowns();
                }
            });
            
            document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
                if (menu) {
                    menu.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }
            });
        }, 1000);
    }
}

window.web3Auth = new Web3Auth();