// About Project section - SIMPLE VERSION (bez problematycznych animacji)
console.log('About Project section loaded successfully');

// Proste efekty hover - karty zawsze widoczne
document.addEventListener('DOMContentLoaded', function() {
    console.log('About Project initialized');
    
    // Upewnij się że wszystkie karty są widoczne
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'none';
    });
});