// Mobile Menu Toggle
const menuBars = document.querySelector('.menu-bars');
const navHeader = document.querySelector('.nav-header');

if (menuBars && navHeader) {
    menuBars.addEventListener('click', () => {
        navHeader.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navHeader.classList.remove('active');
        });
    });
}

// Accordion Functionality (for historiaProv.html and similar)
document.querySelectorAll('.acordeon-titulo').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const isActive = content.classList.contains('active');

        // Close all accordions
        document.querySelectorAll('.acordeon-contenido').forEach(item => {
            item.classList.remove('active');
            item.style.maxHeight = null;
        });

        // Open clicked one if not active
        if (!isActive) {
            content.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// Leaflet Map for Argentina Communities (cdad-colegios.html)
if (document.getElementById('mapa-argentina')) {
    try {
        const mapArgentina = L.map('mapa-argentina').setView([-34.0, -60.0], 4); // Center on Argentina

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapArgentina);

        // Add markers for communities
        document.querySelectorAll('.btn-ver').forEach(btn => {
            const lat = parseFloat(btn.dataset.lat);
            const lng = parseFloat(btn.dataset.lng);
            const communityName = btn.closest('.comunidad')?.querySelector('h3')?.textContent || 'Comunidad';

            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng]).addTo(mapArgentina);
                marker.bindPopup(`<b>${communityName}</b><br>Obras educativas y pastorales.`);
            }
        });

        // Event for "Ver en el mapa" buttons
        document.querySelectorAll('.btn-ver').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lat = parseFloat(btn.dataset.lat);
                const lng = parseFloat(btn.dataset.lng);
                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                    mapArgentina.setView([lat, lng], 12);
                }
            });
        });
    } catch (error) {
        console.error('Error initializing Argentina map:', error);
        document.getElementById('mapa-argentina').innerHTML = '<p>Error al cargar el mapa. Intenta recargar la página.</p>';
    }
}

// Leaflet Map for World Presence (mundo.html)
if (document.getElementById('mapa-mundial')) {
    try {
        const mapWorld = L.map('mapa-mundial').setView([0, 0], 2); // Global view

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapWorld);

        // Example markers for global presence (customize with real locations)
        const globalLocations = [
            { coords: [-34.0, -60.0], name: 'Argentina' },
            { coords: [41.0, 12.0], name: 'Italia' },
            { coords: [-12.0, -77.0], name: 'Perú' },
            { coords: [40.0, -3.0], name: 'España' },
            { coords: [6.0, 3.0], name: 'Nigeria' } // Add more as needed
        ];

        globalLocations.forEach(loc => {
            L.marker(loc.coords).addTo(mapWorld)
                .bindPopup(`Presencia en <b>${loc.name}</b><br>Obras educativas y sociales.`);
        });
    } catch (error) {
        console.error('Error initializing world map:', error);
        document.getElementById('mapa-mundial').innerHTML = '<p>Error al cargar el mapa mundial. Intenta recargar la página.</p>';
    }
}

// Contact Form Handling (contacto.html)
if (document.getElementById('contacto-form')) {
    const form = document.getElementById('contacto-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const nombre = formData.get('nombre')?.trim();
        const email = formData.get('email')?.trim();
        const consulta = formData.get('consulta')?.trim();

        // Basic validation
        if (!nombre || !email || !consulta) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (!email.includes('@')) {
            alert('Por favor, ingresa un email válido.');
            return;
        }

        // Demo submission (replace with actual API call, e.g., fetch('/api/contact'))
        alert(`¡Gracias, ${nombre}! Tu mensaje ha sido enviado. Te contactaremos pronto vía ${email}.`);
        form.reset(); // Clear form

        // For production: 
        // fetch('/api/send-email', { method: 'POST', body: formData })
        //     .then(response => response.json())
        //     .then(data => console.log('Success:', data))
        //     .catch(error => alert('Error al enviar: ' + error));
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade-In Animation on Scroll (for sections)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.animationPlayState = 'paused';
    observer.observe(section);
});

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    // Any additional init code here
    console.log('Site script loaded successfully.');
});