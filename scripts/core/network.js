class InteractiveNetwork {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.createNodes();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNodes() {
        const nodeCount = Math.min(160, Math.floor((window.innerWidth * window.innerHeight) / 7000));
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                color: this.randomNodeColor(),
                connections: []
            });
        }
    }

    randomNodeColor() {
        const colors = [
            '#00ff88', '#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        const follower = document.getElementById('mouseFollower');
        if (follower) {
            follower.style.left = (e.clientX - 10) + 'px';
            follower.style.top = (e.clientY - 10) + 'px';
        }
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            const dx = node.x - this.mouse.x;
            const dy = node.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const force = (200 - distance) / 200;
                node.vx += (dx / distance) * force * 0.4;
                node.vy += (dy / distance) * force * 0.4;
            }

            const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
            if (speed > 2) {
                node.vx = (node.vx / speed) * 2;
                node.vy = (node.vy / speed) * 2;
            }
        });
    }

    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 2, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 2
            );
            gradient.addColorStop(0, node.color + '40');
            gradient.addColorStop(1, node.color + '00');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color;
            this.ctx.fill();
        });
    }

    drawConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeA = this.nodes[i];
                const nodeB = this.nodes[j];
                const dx = nodeA.x - nodeB.x;
                const dy = nodeA.y - nodeB.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 180) {
                    const opacity = 1 - (distance / 180);
                    
                    const mouseDistA = Math.sqrt(
                        Math.pow(nodeA.x - this.mouse.x, 2) + 
                        Math.pow(nodeA.y - this.mouse.y, 2)
                    );
                    const mouseDistB = Math.sqrt(
                        Math.pow(nodeB.x - this.mouse.x, 2) + 
                        Math.pow(nodeB.y - this.mouse.y, 2)
                    );
                    
                    let lineWidth = 0.4;
                    let color = `rgba(139, 92, 246, ${opacity * 0.3})`;
                    
                    if (mouseDistA < 100 || mouseDistB < 100) {
                        lineWidth = 1.2;
                        color = `rgba(0, 255, 136, ${opacity * 0.8})`;
                    }

                    this.ctx.beginPath();
                    this.ctx.moveTo(nodeA.x, nodeA.y);
                    this.ctx.lineTo(nodeB.x, nodeB.y);
                    this.ctx.strokeStyle = color;
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.stroke();

                    this.connections.push({ nodeA, nodeB, distance });
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateNodes();
        this.drawConnections();
        this.drawNodes();

        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            new InteractiveNetwork();
        }, 100);
    });
} else {
    setTimeout(() => {
        new InteractiveNetwork();
    }, 100);
}