// Background Animation
const canvas = document.getElementById('background-animation');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const celestialObjects = [];
const starCount = 200;
const planetCount = 5;
const galaxyCount = 10;

let mouse = { x: null, y: null, radius: 50 };

// Create stars, planets, and galaxies
function createCelestialObjects() {
    // Create stars
    for (let i = 0; i < starCount; i++) {
        celestialObjects.push({
            type: 'star',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
            velocity: { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 }
        });
    }

    // Create planets
    for (let i = 0; i < planetCount; i++) {
        celestialObjects.push({
            type: 'planet',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 20 + 10,
            color: `hsl(${Math.random() * 360}, 50%, 50%)`,
            velocity: { x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2 }
        });
    }

    // Create galaxies
    for (let i = 0; i < galaxyCount; i++) {
        celestialObjects.push({
            type: 'galaxy',
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 100 + 50,
            color: `hsla(${Math.random() * 360}, 70%, 50%, 0.3)`,
            rotation: Math.random() * Math.PI * 2,
            velocity: { x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1 }
        });
    }
}

createCelestialObjects();

function drawSpaceBackground() {
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    celestialObjects.forEach(object => {
        ctx.beginPath();

        if (object.type === 'star') {
            ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
        } else if (object.type === 'planet') {
            ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
        } else if (object.type === 'galaxy') {
            ctx.save();
            ctx.translate(object.x, object.y);
            ctx.rotate(object.rotation);
            ctx.beginPath();
            ctx.ellipse(0, 0, object.radius, object.radius / 2, 0, 0, Math.PI * 2);
            ctx.fillStyle = object.color;
            ctx.fill();
            ctx.restore();
        }

        // Black hole (mouse) interaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - object.x;
            let dy = mouse.y - object.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + object.radius) {
                let angle = Math.atan2(dy, dx);
                object.x = mouse.x - Math.cos(angle) * (mouse.radius + object.radius);
                object.y = mouse.y - Math.sin(angle) * (mouse.radius + object.radius);
            }
        }

        // Move objects
        object.x += object.velocity.x;
        object.y += object.velocity.y;

        // Wrap around screen
        if (object.x < -object.radius) object.x = canvas.width + object.radius;
        if (object.x > canvas.width + object.radius) object.x = -object.radius;
        if (object.y < -object.radius) object.y = canvas.height + object.radius;
        if (object.y > canvas.height + object.radius) object.y = -object.radius;
    });

    // Draw shooting star
    if (Math.random() < 0.02) {
        let shootingStar = {
            x: Math.random() * canvas.width,
            y: 0,
            length: Math.random() * 80 + 20,
            speed: Math.random() * 10 + 5,
            angle: Math.random() * Math.PI / 4 + Math.PI / 4
        };
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
                   shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    requestAnimationFrame(drawSpaceBackground);
}

drawSpaceBackground();

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});