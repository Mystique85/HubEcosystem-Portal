class CryptoNews {
    constructor() {
        this.modal = document.getElementById('newsModal');
        this.newsContent = document.getElementById('newsContent');
        this.init();
    }

    init() {
        // Add event listeners after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeNewsModal();
            });
        } else {
            this.initializeNewsModal();
        }
    }

    initializeNewsModal() {
        setTimeout(() => {
            const newsBtn = document.getElementById('newsBtn');
            const closeModal = document.getElementById('closeModal');
            
            if (newsBtn) {
                newsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal();
                });
            }
            
            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    this.closeModal();
                });
            }

            if (this.modal) {
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) {
                        this.closeModal();
                    }
                });
            }
        }, 1000);
    }

    openModal() {
        if (this.modal) {
            this.modal.style.display = 'flex';
            this.loadNews();
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    async loadNews() {
        try {
            // Using CoinDesk RSS feed
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.coindesk.com/arc/outboundfeeds/rss/');
            const data = await response.json();
            
            this.displayNews(data.items);
        } catch (error) {
            console.log('Error loading news:', error);
            if (this.newsContent) {
                this.newsContent.innerHTML = '<div class="loading-news">Failed to load news. Please try again later.</div>';
            }
        }
    }

    displayNews(newsItems) {
        if (!this.newsContent) return;
        
        this.newsContent.innerHTML = newsItems.slice(0, 10).map(item => `
            <div class="news-item">
                <div class="news-title">
                    <a href="${item.link}" target="_blank">
                        ${item.title}
                    </a>
                </div>
                <div class="news-source">CoinDesk</div>
                <div class="news-date">${new Date(item.pubDate).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
}

// Initialize news modal
new CryptoNews();