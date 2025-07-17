// main.js - Interactive features for Neural AI Website

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger menu for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Tab switching for architectures
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            this.classList.add('active');
            const tab = this.getAttribute('data-tab');
            document.getElementById(tab).classList.add('active');
        });
    });

    // Hero section scroll buttons
    window.scrollToSection = function (id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    };

    // Interactive neural network demo (simple animated effect)
    const canvas = document.getElementById('interactive-network-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = 500;
        let height = canvas.height = 300;
        let epoch = 0, loss = 0.1, accuracy = 0;
        function drawNetwork() {
            ctx.clearRect(0, 0, width, height);
            // Draw layers and animated connections
            let layers = parseInt(document.getElementById('layer-count').value);
            let neurons = parseInt(document.getElementById('neuron-count').value);
            let layerSpacing = width / (layers + 1);
            let neuronSpacing = height / (neurons + 1);
            let nodes = [];
            for (let l = 0; l <= layers; l++) {
                nodes[l] = [];
                for (let n = 0; n < neurons; n++) {
                    let x = layerSpacing * l + 40;
                    let y = neuronSpacing * (n + 1);
                    nodes[l].push({ x, y });
                    ctx.beginPath();
                    ctx.arc(x, y, 12, 0, 2 * Math.PI);
                    ctx.fillStyle = l === 0 ? '#00eaff' : l === layers ? '#ff00c8' : '#0ff';
                    ctx.shadowColor = '#0ff';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
            // Draw animated connections
            ctx.strokeStyle = 'rgba(0,255,255,0.2)';
            for (let l = 0; l < layers; l++) {
                for (let n1 = 0; n1 < neurons; n1++) {
                    for (let n2 = 0; n2 < neurons; n2++) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[l][n1].x, nodes[l][n1].y);
                        ctx.lineTo(nodes[l+1][n2].x, nodes[l+1][n2].y);
                        ctx.stroke();
                    }
                }
            }
        }
        function animate() {
            drawNetwork();
            document.getElementById('epoch-count').textContent = epoch;
            document.getElementById('loss-value').textContent = (loss * Math.exp(-epoch/50)).toFixed(3);
            document.getElementById('accuracy-value').textContent = Math.min(100, (epoch*2)).toFixed(0) + '%';
            if (isTraining) epoch++;
            requestAnimationFrame(animate);
        }
        let isTraining = false;
        document.getElementById('start-training').onclick = () => { isTraining = true; };
        document.getElementById('pause-training').onclick = () => { isTraining = false; };
        document.getElementById('reset-network').onclick = () => { epoch = 0; loss = 0.1; accuracy = 0; };
        document.getElementById('layer-count').oninput = function () {
            document.getElementById('layer-count-value').textContent = this.value;
        };
        document.getElementById('neuron-count').oninput = function () {
            document.getElementById('neuron-count-value').textContent = this.value;
        };
        document.getElementById('learning-rate').oninput = function () {
            document.getElementById('learning-rate-value').textContent = this.value;
        };
        animate();
    }
});