/**
 * Neural Networks and AI Website - Interactive JavaScript
 * Comprehensive functionality including neural network visualizations,
 * smooth scrolling, interactive components, and dynamic UI elements
 */

// ===== GLOBAL VARIABLES AND CONFIGURATION =====
let heroCanvas, heroCtx;
let interactiveCanvas, interactiveCtx;
let animationId;
let isTraining = false;
let currentEpoch = 0;
let currentLoss = 1.000;
let currentAccuracy = 0;

// Neural network configuration
let networkConfig = {
    layers: 2,
    neuronsPerLayer: 4,
    learningRate: 0.1,
    activationFunction: 'relu'
};

// Animation variables
let nodes = [];
let connections = [];
let dataFlows = [];
let time = 0;

// ===== UTILITY FUNCTIONS =====

/**
 * Smooth scrolling to target section
 */
function scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        const offsetTop = target.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

/**
 * Generate random number between min and max
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Linear interpolation
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Distance between two points
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ===== NEURAL NETWORK CLASSES =====

/**
 * Neural Network Node Class
 */
class NeuralNode {
    constructor(x, y, layer, index) {
        this.x = x;
        this.y = y;
        this.layer = layer;
        this.index = index;
        this.radius = random(8, 12);
        this.baseRadius = this.radius;
        this.activation = random(0, 1);
        this.targetActivation = random(0, 1);
        this.pulsePhase = random(0, Math.PI * 2);
        this.glowIntensity = 0;
    }

    update(deltaTime) {
        // Smooth activation changes
        this.activation = lerp(this.activation, this.targetActivation, 0.02);
        
        // Pulsing animation
        this.pulsePhase += deltaTime * 0.002;
        this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 2;
        
        // Glow effect based on activation
        this.glowIntensity = this.activation * 0.8 + 0.2;
    }

    draw(ctx) {
        // Glow effect
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
        gradient.addColorStop(0, `rgba(0, 255, 255, ${this.glowIntensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(this.x - this.radius * 3, this.y - this.radius * 3, this.radius * 6, this.radius * 6);
        
        // Node circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Color based on activation level
        const intensity = Math.floor(this.activation * 255);
        ctx.fillStyle = `rgb(${intensity}, ${Math.floor(intensity * 0.8)}, 255)`;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    setActivation(value) {
        this.targetActivation = Math.max(0, Math.min(1, value));
    }
}

/**
 * Neural Network Connection Class
 */
class NeuralConnection {
    constructor(fromNode, toNode) {
        this.fromNode = fromNode;
        this.toNode = toNode;
        this.weight = random(-1, 1);
        this.targetWeight = this.weight;
        this.dataFlow = 0;
        this.flowSpeed = random(0.5, 1.5);
        this.particles = [];
    }

    update(deltaTime) {
        // Smooth weight changes
        this.weight = lerp(this.weight, this.targetWeight, 0.01);
        
        // Update data flow particles
        this.particles = this.particles.filter(particle => {
            particle.progress += this.flowSpeed * deltaTime * 0.001;
            return particle.progress <= 1;
        });
        
        // Add new particles based on activation
        if (this.fromNode.activation > 0.3 && Math.random() < 0.02) {
            this.particles.push({
                progress: 0,
                intensity: this.fromNode.activation
            });
        }
    }

    draw(ctx) {
        const opacity = Math.abs(this.weight) * 0.6 + 0.1;
        const thickness = Math.abs(this.weight) * 3 + 1;
        
        // Connection line
        ctx.beginPath();
        ctx.moveTo(this.fromNode.x, this.fromNode.y);
        ctx.lineTo(this.toNode.x, this.toNode.y);
        
        // Color based on weight (positive = blue, negative = red)
        if (this.weight > 0) {
            ctx.strokeStyle = `rgba(0, 170, 255, ${opacity})`;
        } else {
            ctx.strokeStyle = `rgba(255, 100, 100, ${opacity})`;
        }
        
        ctx.lineWidth = thickness;
        ctx.stroke();
        
        // Draw data flow particles
        this.particles.forEach(particle => {
            const x = lerp(this.fromNode.x, this.toNode.x, particle.progress);
            const y = lerp(this.fromNode.y, this.toNode.y, particle.progress);
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 136, ${particle.intensity})`;
            ctx.fill();
        });
    }

    setWeight(value) {
        this.targetWeight = Math.max(-1, Math.min(1, value));
    }
}

// ===== NEURAL NETWORK VISUALIZATION =====

/**
 * Initialize hero background neural network
 */
function initHeroNetwork() {
    heroCanvas = document.getElementById('neural-network-canvas');
    if (!heroCanvas) return;
    
    heroCtx = heroCanvas.getContext('2d');
    resizeHeroCanvas();
    
    // Create network structure
    createHeroNetwork();
    
    // Start animation
    animateHeroNetwork();
}

/**
 * Resize hero canvas to fit container
 */
function resizeHeroCanvas() {
    if (!heroCanvas) return;
    
    const rect = heroCanvas.parentElement.getBoundingClientRect();
    heroCanvas.width = rect.width;
    heroCanvas.height = rect.height;
}

/**
 * Create hero network nodes and connections
 */
function createHeroNetwork() {
    nodes = [];
    connections = [];
    
    const layers = [6, 8, 10, 8, 4]; // Network architecture
    const layerSpacing = heroCanvas.width / (layers.length + 1);
    
    // Create nodes
    layers.forEach((nodeCount, layerIndex) => {
        const layerNodes = [];
        const nodeSpacing = heroCanvas.height / (nodeCount + 1);
        
        for (let i = 0; i < nodeCount; i++) {
            const x = layerSpacing * (layerIndex + 1);
            const y = nodeSpacing * (i + 1);
            const node = new NeuralNode(x, y, layerIndex, i);
            layerNodes.push(node);
            nodes.push(node);
        }
        
        // Create connections to next layer
        if (layerIndex < layers.length - 1) {
            const nextLayerStart = nodes.length;
            const nextLayerCount = layers[layerIndex + 1];
            
            layerNodes.forEach(fromNode => {
                for (let i = 0; i < nextLayerCount; i++) {
                    // We'll create the connection when the next layer is created
                }
            });
        }
    });
    
    // Create connections between layers
    let nodeIndex = 0;
    layers.forEach((nodeCount, layerIndex) => {
        if (layerIndex < layers.length - 1) {
            const currentLayerStart = nodeIndex;
            const nextLayerStart = nodeIndex + nodeCount;
            const nextLayerCount = layers[layerIndex + 1];
            
            for (let i = 0; i < nodeCount; i++) {
                for (let j = 0; j < nextLayerCount; j++) {
                    const fromNode = nodes[currentLayerStart + i];
                    const toNode = nodes[nextLayerStart + j];
                    connections.push(new NeuralConnection(fromNode, toNode));
                }
            }
        }
        nodeIndex += nodeCount;
    });
}

/**
 * Animate hero network
 */
function animateHeroNetwork() {
    if (!heroCtx) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - (animateHeroNetwork.lastTime || currentTime);
    animateHeroNetwork.lastTime = currentTime;
    
    time += deltaTime;
    
    // Clear canvas
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    
    // Update and draw connections
    connections.forEach(connection => {
        connection.update(deltaTime);
        connection.draw(heroCtx);
    });
    
    // Update and draw nodes
    nodes.forEach((node, index) => {
        // Simulate network activity
        if (Math.sin(time * 0.001 + index * 0.1) > 0.7) {
            node.setActivation(random(0.5, 1));
        } else if (Math.random() < 0.01) {
            node.setActivation(random(0, 0.3));
        }
        
        node.update(deltaTime);
        node.draw(heroCtx);
    });
    
    requestAnimationFrame(animateHeroNetwork);
}

// ===== INTERACTIVE NEURAL NETWORK DEMO =====

/**
 * Initialize interactive neural network demo
 */
function initInteractiveNetwork() {
    interactiveCanvas = document.getElementById('interactive-network-canvas');
    if (!interactiveCanvas) return;
    
    interactiveCtx = interactiveCanvas.getContext('2d');
    resizeInteractiveCanvas();
    
    // Setup controls
    setupNetworkControls();
    
    // Create initial network
    createInteractiveNetwork();
    
    // Start animation
    animateInteractiveNetwork();
}

/**
 * Resize interactive canvas
 */
function resizeInteractiveCanvas() {
    if (!interactiveCanvas) return;
    
    interactiveCanvas.width = interactiveCanvas.offsetWidth;
    interactiveCanvas.height = 400;
}

/**
 * Setup network control handlers
 */
function setupNetworkControls() {
    // Layer count control
    const layerCountSlider = document.getElementById('layer-count');
    const layerCountValue = document.getElementById('layer-count-value');
    
    if (layerCountSlider && layerCountValue) {
        layerCountSlider.addEventListener('input', (e) => {
            networkConfig.layers = parseInt(e.target.value);
            layerCountValue.textContent = e.target.value;
            createInteractiveNetwork();
        });
    }
    
    // Neuron count control
    const neuronCountSlider = document.getElementById('neuron-count');
    const neuronCountValue = document.getElementById('neuron-count-value');
    
    if (neuronCountSlider && neuronCountValue) {
        neuronCountSlider.addEventListener('input', (e) => {
            networkConfig.neuronsPerLayer = parseInt(e.target.value);
            neuronCountValue.textContent = e.target.value;
            createInteractiveNetwork();
        });
    }
    
    // Learning rate control
    const learningRateSlider = document.getElementById('learning-rate');
    const learningRateValue = document.getElementById('learning-rate-value');
    
    if (learningRateSlider && learningRateValue) {
        learningRateSlider.addEventListener('input', (e) => {
            networkConfig.learningRate = parseFloat(e.target.value);
            learningRateValue.textContent = e.target.value;
        });
    }
    
    // Activation function control
    const activationSelect = document.getElementById('activation-function');
    if (activationSelect) {
        activationSelect.addEventListener('change', (e) => {
            networkConfig.activationFunction = e.target.value;
        });
    }
    
    // Training controls
    const startButton = document.getElementById('start-training');
    const pauseButton = document.getElementById('pause-training');
    const resetButton = document.getElementById('reset-network');
    
    if (startButton) {
        startButton.addEventListener('click', startTraining);
    }
    
    if (pauseButton) {
        pauseButton.addEventListener('click', pauseTraining);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetNetwork);
    }
}

/**
 * Create interactive network based on current configuration
 */
function createInteractiveNetwork() {
    if (!interactiveCanvas) return;
    
    nodes = [];
    connections = [];
    
    // Create network architecture
    const layers = [3]; // Input layer
    for (let i = 0; i < networkConfig.layers; i++) {
        layers.push(networkConfig.neuronsPerLayer);
    }
    layers.push(2); // Output layer
    
    const layerSpacing = interactiveCanvas.width / (layers.length + 1);
    
    // Create nodes
    layers.forEach((nodeCount, layerIndex) => {
        const layerNodes = [];
        const nodeSpacing = interactiveCanvas.height / (nodeCount + 1);
        
        for (let i = 0; i < nodeCount; i++) {
            const x = layerSpacing * (layerIndex + 1);
            const y = nodeSpacing * (i + 1);
            const node = new NeuralNode(x, y, layerIndex, i);
            layerNodes.push(node);
            nodes.push(node);
        }
    });
    
    // Create connections
    let nodeIndex = 0;
    layers.forEach((nodeCount, layerIndex) => {
        if (layerIndex < layers.length - 1) {
            const currentLayerStart = nodeIndex;
            const nextLayerStart = nodeIndex + nodeCount;
            const nextLayerCount = layers[layerIndex + 1];
            
            for (let i = 0; i < nodeCount; i++) {
                for (let j = 0; j < nextLayerCount; j++) {
                    const fromNode = nodes[currentLayerStart + i];
                    const toNode = nodes[nextLayerStart + j];
                    connections.push(new NeuralConnection(fromNode, toNode));
                }
            }
        }
        nodeIndex += nodeCount;
    });
}

/**
 * Animate interactive network
 */
function animateInteractiveNetwork() {
    if (!interactiveCtx) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - (animateInteractiveNetwork.lastTime || currentTime);
    animateInteractiveNetwork.lastTime = currentTime;
    
    // Clear canvas
    interactiveCtx.clearRect(0, 0, interactiveCanvas.width, interactiveCanvas.height);
    
    // Update and draw connections
    connections.forEach(connection => {
        connection.update(deltaTime);
        connection.draw(interactiveCtx);
    });
    
    // Update and draw nodes
    nodes.forEach(node => {
        node.update(deltaTime);
        node.draw(interactiveCtx);
    });
    
    // Update training simulation
    if (isTraining) {
        simulateTraining();
    }
    
    requestAnimationFrame(animateInteractiveNetwork);
}

/**
 * Start training simulation
 */
function startTraining() {
    isTraining = true;
    const startButton = document.getElementById('start-training');
    if (startButton) {
        startButton.textContent = 'Training...';
        startButton.disabled = true;
    }
}

/**
 * Pause training simulation
 */
function pauseTraining() {
    isTraining = false;
    const startButton = document.getElementById('start-training');
    if (startButton) {
        startButton.textContent = 'Resume Training';
        startButton.disabled = false;
    }
}

/**
 * Reset network to initial state
 */
function resetNetwork() {
    isTraining = false;
    currentEpoch = 0;
    currentLoss = 1.000;
    currentAccuracy = 0;
    
    updateTrainingStats();
    
    const startButton = document.getElementById('start-training');
    if (startButton) {
        startButton.textContent = 'Start Training';
        startButton.disabled = false;
    }
    
    createInteractiveNetwork();
}

/**
 * Simulate training process
 */
function simulateTraining() {
    // Update training statistics
    currentEpoch += 0.1;
    currentLoss = Math.max(0.001, currentLoss - random(0.001, 0.005));
    currentAccuracy = Math.min(100, currentAccuracy + random(0.1, 0.5));
    
    updateTrainingStats();
    
    // Simulate network weight updates
    connections.forEach(connection => {
        if (Math.random() < 0.1) {
            const adjustment = (Math.random() - 0.5) * networkConfig.learningRate;
            connection.setWeight(connection.weight + adjustment);
        }
    });
    
    // Simulate activation changes
    nodes.forEach(node => {
        if (Math.random() < 0.05) {
            node.setActivation(random(0, 1));
        }
    });
}

/**
 * Update training statistics display
 */
function updateTrainingStats() {
    const epochElement = document.getElementById('epoch-count');
    const lossElement = document.getElementById('loss-value');
    const accuracyElement = document.getElementById('accuracy-value');
    
    if (epochElement) {
        epochElement.textContent = Math.floor(currentEpoch);
    }
    
    if (lossElement) {
        lossElement.textContent = currentLoss.toFixed(3);
    }
    
    if (accuracyElement) {
        accuracyElement.textContent = currentAccuracy.toFixed(1) + '%';
    }
}

// ===== NAVIGATION AND UI INTERACTIONS =====

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    // Mobile hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        });
    }
}

/**
 * Initialize tab functionality for architecture section
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.trend-card, .tool-card, .principle-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Initialize interactive hover effects
 */
function initHoverEffects() {
    // Add hover effects to cards
    document.querySelectorAll('.trend-card, .tool-card, .principle-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== WINDOW RESIZE HANDLING =====

/**
 * Handle window resize events
 */
function handleResize() {
    // Resize canvases
    resizeHeroCanvas();
    resizeInteractiveCanvas();
    
    // Recreate networks with new dimensions
    if (nodes.length > 0) {
        createHeroNetwork();
        createInteractiveNetwork();
    }
}

// ===== INITIALIZATION =====

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initNavigation();
    initTabs();
    initScrollAnimations();
    initHoverEffects();
    
    // Initialize neural network visualizations
    initHeroNetwork();
    initInteractiveNetwork();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initialize training stats
    updateTrainingStats();
    
    console.log('Neural Networks AI Website - JavaScript Initialized');
});

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK HANDLERS =====

/**
 * Global scroll function for button onclick handlers
 */
window.scrollToSection = scrollToSection;

// ===== PERFORMANCE MONITORING =====

/**
 * Monitor performance and optimize if needed
 */
function monitorPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Reduce animation complexity if FPS is too low
            if (fps < 30) {
                console.warn('Low FPS detected, optimizing animations');
                // Reduce particle count or animation frequency
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
}

// Start performance monitoring
monitorPerformance();