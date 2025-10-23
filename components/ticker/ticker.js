class CryptoTicker {
    constructor() {
        this.tickerContent = document.getElementById('tickerContent');
        this.tickerContentDuplicate = document.getElementById('tickerContentDuplicate');
        
        // Top 15 kryptowalut z ich ID CoinGecko
        this.cryptos = [
            { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
            { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
            { id: 'tether', symbol: 'USDT', name: 'Tether' },
            { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
            { id: 'solana', symbol: 'SOL', name: 'Solana' },
            { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin' },
            { id: 'ripple', symbol: 'XRP', name: 'XRP' },
            { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
            { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
            { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
            { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
            { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
            { id: 'polygon-pos', symbol: 'MATIC', name: 'Polygon' },
            { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
            { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' }
        ];
        
        this.init();
    }

    async init() {
        // Najpierw ładujemy ikony
        await this.preloadIcons();
        // Potem ceny
        await this.loadPrices();
        // Aktualizuj co 2 minuty
        setInterval(() => this.loadPrices(), 120000);
    }

    async preloadIcons() {
        // Preload icons for better performance
        this.cryptos.forEach(crypto => {
            const img = new Image();
            img.src = this.getIconUrl(crypto.id);
        });
    }

    getIconUrl(cryptoId) {
        // Mapowanie ID do ścieżek ikon
        const iconMap = {
            'bitcoin': 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
            'ethereum': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
            'tether': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
            'binancecoin': 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
            'solana': 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
            'usd-coin': 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
            'ripple': 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
            'cardano': 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
            'dogecoin': 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
            'avalanche-2': 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
            'polkadot': 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
            'chainlink': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
            'polygon-pos': 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
            'litecoin': 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
            'uniswap': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png'
        };
        
        return iconMap[cryptoId] || `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`;
    }

    async loadPrices() {
        try {
            const cryptoIds = this.cryptos.map(c => c.id).join(',');
            const response = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true`
            );
            
            if (!response.ok) {
                throw new Error('API response not ok');
            }
            
            const data = await response.json();
            this.updateTicker(data);
            
        } catch (error) {
            console.log('Error loading crypto prices:', error);
            this.showFallbackTicker();
        }
    }

    updateTicker(data) {
        if (!this.tickerContent) return;
        
        this.tickerContent.innerHTML = '';
        this.tickerContentDuplicate.innerHTML = '';
        
        this.cryptos.forEach(crypto => {
            if (data[crypto.id]) {
                const item = this.createTickerItem(crypto, data[crypto.id]);
                this.tickerContent.appendChild(item.cloneNode(true));
                this.tickerContentDuplicate.appendChild(item.cloneNode(true));
            }
        });
    }

    createTickerItem(crypto, data) {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        
        const change = data.usd_24h_change;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSymbol = change >= 0 ? '↗' : '↘';
        
        item.innerHTML = `
            <img src="${this.getIconUrl(crypto.id)}" alt="${crypto.name}" class="crypto-icon" 
                 onerror="this.src='https://assets.coingecko.com/coins/images/1/small/bitcoin.png'">
            <span class="crypto-name">${crypto.symbol}</span>
            <span class="crypto-price">$${this.formatPrice(data.usd)}</span>
            <span class="crypto-change ${changeClass}">
                ${changeSymbol} ${Math.abs(change).toFixed(2)}%
            </span>
        `;
        
        return item;
    }

    formatPrice(price) {
        if (price > 1000) {
            return price.toLocaleString(undefined, {maximumFractionDigits: 0});
        } else if (price > 1) {
            return price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        } else {
            return price.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 4});
        }
    }

    showFallbackTicker() {
        const fallbackData = [
            { symbol: 'BTC', price: 43250.67, change: 2.34 },
            { symbol: 'ETH', price: 2345.89, change: 1.56 },
            { symbol: 'BNB', price: 312.45, change: -0.78 },
            { symbol: 'SOL', price: 98.76, change: 5.43 },
            { symbol: 'XRP', price: 0.5678, change: 0.23 },
            { symbol: 'ADA', price: 0.4321, change: -1.12 },
            { symbol: 'AVAX', price: 34.56, change: 3.21 },
            { symbol: 'DOT', price: 6.78, change: -0.45 },
            { symbol: 'LINK', price: 14.32, change: 2.11 },
            { symbol: 'MATIC', price: 0.789, change: 0.67 }
        ];
        
        if (!this.tickerContent) return;
        
        this.tickerContent.innerHTML = '';
        this.tickerContentDuplicate.innerHTML = '';
        
        fallbackData.forEach(crypto => {
            const item = document.createElement('div');
            item.className = 'ticker-item';
            const changeClass = crypto.change >= 0 ? 'positive' : 'negative';
            const changeSymbol = crypto.change >= 0 ? '↗' : '↘';
            
            item.innerHTML = `
                <div class="crypto-icon-placeholder">${crypto.symbol.charAt(0)}</div>
                <span class="crypto-name">${crypto.symbol}</span>
                <span class="crypto-price">$${this.formatPrice(crypto.price)}</span>
                <span class="crypto-change ${changeClass}">
                    ${changeSymbol} ${Math.abs(crypto.change).toFixed(2)}%
                </span>
            `;
            
            this.tickerContent.appendChild(item.cloneNode(true));
            this.tickerContentDuplicate.appendChild(item.cloneNode(true));
        });
    }
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            new CryptoTicker();
        }, 500);
    });
} else {
    setTimeout(() => {
        new CryptoTicker();
    }, 500);
}