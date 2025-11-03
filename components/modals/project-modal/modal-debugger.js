// components/modals/project-modal/modal-debugger.js

class ModalDebugger {
    static overlayId = 'projectModalOverlay';
    static modalId = 'projectModal';
    
    static diagnose() {
        console.log('=== MODAL DIAGNOSIS ===\n');
        
        const overlay = document.getElementById(this.overlayId);
        const modal = document.getElementById(this.modalId);
        
        // Check element existence
        const elements = {
            overlay: overlay ? this.overlayId : null,
            container: modal ? this.modalId : null
        };
        console.log('Elements found:', elements);
        
        // Check styles
        if (overlay) {
            console.log('Overlay styles:', this.getComputedStyles(overlay));
        }
        if (modal) {
            console.log('Container styles:', this.getComputedStyles(modal));
        }
        
        // Check modal structure
        const structure = {
            header: !!modal?.querySelector('.project-modal-header'),
            content: !!modal?.querySelector('.project-modal-content'),
            footer: !!modal?.querySelector('.project-modal-footer')
        };
        console.log('Modal structure:', structure);
        
        // Check CSS link
        const cssLink = document.querySelector('link[href*="project-modal.css"]');
        const cssStatus = {
            linkFound: !!cssLink,
            href: cssLink?.href || null
        };
        console.log('CSS status:', cssStatus);
        
        return {
            elements,
            structure,
            cssStatus
        };
    }
    
    static repair() {
        console.log('=== REPAIRING MODAL ===\n');
        
        const overlay = document.getElementById(this.overlayId);
        const modal = document.getElementById(this.modalId);
        
        if (!overlay || !modal) {
            console.error('Modal elements not found! Cannot repair.');
            return;
        }
        
        // Reset critical styles
        overlay.style.cssText = `
            display: none;
            visibility: hidden;
            opacity: 0;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.75);
            z-index: 10000;
            transition: opacity 0.3s ease;
        `;
        
        modal.style.cssText = `
            position: relative;
            background: #fff;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            border-radius: 12px;
            overflow-y: auto;
            transform: translateY(0);
            transition: transform 0.3s ease;
        `;
        
        console.log('✅ Base styles repaired');
        
        // Check CSS
        const cssLink = document.querySelector('link[href*="project-modal.css"]');
        if (!cssLink) {
            this.reloadCSS();
        }
        
        console.log('✅ Modal repaired successfully');
    }
    
    static forceOpen() {
        console.log('=== FORCE OPENING MODAL ===\n');
        
        const overlay = document.getElementById(this.overlayId);
        if (!overlay) {
            console.error('Modal overlay not found!');
            return;
        }
        
        // Force display
        overlay.style.display = 'flex';
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Modal forced open');
        this.diagnose();
    }
    
    static getComputedStyles(element) {
        const computed = window.getComputedStyle(element);
        return {
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            position: computed.position,
            zIndex: computed.zIndex,
            transform: computed.transform
        };
    }
    
    static reloadCSS() {
        const cssPath = 'components/modals/project-modal/project-modal.css';
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath;
        document.head.appendChild(link);
        console.log('✅ CSS reloaded');
    }
}

// Make available globally
window.ModalDebugger = ModalDebugger;
