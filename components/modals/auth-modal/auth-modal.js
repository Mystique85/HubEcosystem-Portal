class AuthModal {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        console.log('🛡️ AuthModal initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener będzie dodany po załadowaniu DOM
        setTimeout(() => {
            // Znajdź elementy modala
            this.modal = document.getElementById('authModal');
            const cancelBtn = document.getElementById('authModalCancel');
            const confirmBtn = document.getElementById('authModalConfirm');

            if (this.modal && cancelBtn && confirmBtn) {
                // Anuluj
                cancelBtn.addEventListener('click', () => {
                    this.close();
                });

                // Kontynuuj do podpisu
                confirmBtn.addEventListener('click', () => {
                    this.close();
                    // Uruchom proces podpisywania
                    if (window.web3Auth) {
                        window.web3Auth.connectWallet();
                    }
                });

                // Zamknij przy kliknięciu poza modalem
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) {
                        this.close();
                    }
                });

                // Zamknij przy ESC
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.close();
                    }
                });

                console.log('✅ AuthModal event listeners setup');
            } else {
                console.log('❌ AuthModal elements not found');
            }
        }, 1000);
    }

    open() {
        if (!this.modal) {
            console.log('❌ AuthModal not found');
            return;
        }

        this.modal.classList.add('show');
        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // Zablokuj scroll
        console.log('🛡️ AuthModal opened');
    }

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        this.isOpen = false;
        document.body.style.overflow = ''; // Odblokuj scroll
        console.log('🛡️ AuthModal closed');
    }
}

// Globalna instancja
window.authModal = new AuthModal();