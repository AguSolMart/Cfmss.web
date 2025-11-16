// Esperar a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Initializing mobile menu');

    // Mobile Menu Toggle (Fix para Celular)
    const menuBars = document.querySelector('.menu-bars');
    const navHeader = document.querySelector('.nav-header');
    let menuOpen = false;

    if (menuBars && navHeader) {
        // Event listeners para click y touch (mejor en mobile)
        menuBars.addEventListener('click', toggleMenu);
        menuBars.addEventListener('touchstart', toggleMenu); // Para touch devices

        function toggleMenu(e) {
            e.preventDefault(); // Evita scroll jump en mobile
            menuOpen = !menuOpen;
            console.log('Menu toggled:', menuOpen ? 'Open' : 'Closed');

            if (menuOpen) {
                navHeader.classList.add('active');
                createBackdrop(); // Agregar overlay para cerrar al tocar fuera
            } else {
                navHeader.classList.remove('active');
                removeBackdrop();
            }
        }

        // Cerrar menú al clickear un link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevenir default para smooth scroll si aplica
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href; // Navegar a la ruta
                }
                // Cerrar menú después de navegación
                setTimeout(() => {
                    menuOpen = false;
                    navHeader.classList.remove('active');
                    removeBackdrop();
                }, 100);
            });
            link.addEventListener('touchstart', (e) => {
                // Mismo para touch
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
                setTimeout(() => {
                    menuOpen = false;
                    navHeader.classList.remove('active');
                    removeBackdrop();
                }, 100);
            });
        });

        // Función para backdrop (overlay negro semi-transparente)
        function createBackdrop() {
            let backdrop = document.querySelector('.menu-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.classList.add('menu-backdrop');
                backdrop.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 99;
                    display: none;
                `;
                document.body.appendChild(backdrop);
            }
            backdrop.style.display = 'block';
            backdrop.addEventListener('click', () => {
                menuOpen = false;
                navHeader.classList.remove('active');
                removeBackdrop();
            });
            backdrop.addEventListener('touchstart', () => {
                menuOpen = false;
                navHeader.classList.remove('active');
                removeBackdrop();
            });
        }

        function removeBackdrop() {
            const backdrop = document.querySelector('.menu-backdrop');
            if (backdrop) {
                backdrop.style.display = 'none';
            }
        }

        // Cerrar menú al redimensionar ventana (e.g., de mobile a desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && menuOpen) {
                menuOpen = false;
                navHeader.classList.remove('active');
                removeBackdrop();
            }
        });

    } else {
        console.warn('Menu elements not found - Check HTML selectors');
    }

    // Accordion Functionality (resto igual)
    document.querySelectorAll('.acordeon-titulo').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isActive = content.classList.contains('active');

            // Close all
            document.querySelectorAll('.acordeon-contenido').forEach(item => {
                item.classList.remove('active');
                item.style.maxHeight = null;
                item.style.display = 'none';
            });

            // Open clicked
            if (!isActive) {
                content.classList.add('active');
                content.style.display = 'block';
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // Leaflet Map for Argentina (resto igual, con try-catch)
    if (document.getElementById('mapa-argentina')) {
        try {
            const mapArgentina = L.map('mapa-argentina').setView([-34.0, -60.0], 4);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    minZoom: 0,
    maxZoom: 19
}).addTo(mapArgentina);

            document.querySelectorAll('.btn-ver').forEach(btn => {
                const lat = parseFloat(btn.dataset.lat);
                const lng = parseFloat(btn.dataset.lng);
                const communityName = btn.closest('.comunidad')?.querySelector('h3')?.textContent || 'Comunidad';

                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                    const marker = L.marker([lat, lng]).addTo(mapArgentina);
                    marker.bindPopup(`<b>${communityName}</b><br>Obras educativas y pastorales.`);
                }
            });

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
            document.getElementById('mapa-argentina').innerHTML = '<p>Error al cargar el mapa.</p>';
        }
    }

    // Leaflet Map for World (resto igual)
    if (document.getElementById('mapa-mundial')) {
        try {
            const mapWorld = L.map('mapa-mundial').setView([0, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    minZoom: 0,
    maxZoom: 19
}).addTo(mapWorld);

            const globalLocations = [
                { coords: [-34.0, -60.0], name: 'Argentina' },
                { coords: [41.0, 12.0], name: 'Italia' },
                { coords: [-12.0, -77.0], name: 'Perú' },
                { coords: [40.0, -3.0], name: 'España' },
                { coords: [6.0, 3.0], name: 'Nigeria' }
            ];

            globalLocations.forEach(loc => {
                L.marker(loc.coords).addTo(mapWorld)
                    .bindPopup(`Presencia en <b>${loc.name}</b><br>Obras educativas y sociales.`);
            });
        } catch (error) {
            console.error('Error initializing world map:', error);
            document.getElementById('mapa-mundial').innerHTML = '<p>Error al cargar el mapa.</p>';
        }
    }

    // Contact Form (resto igual)
    const form = document.getElementById('contacto-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const nombre = formData.get('nombre')?.trim();
            const email = formData.get('email')?.trim();
            const consulta = formData.get('consulta')?.trim();

            if (!nombre || !email || !consulta || !email.includes('@')) {
                alert('Por favor, completa todos los campos con datos válidos.');
                return;
            }

            alert(`¡Gracias, ${nombre}! Mensaje enviado.`);
            form.reset();
        });
    }

    // Smooth Scrolling (resto igual)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Fade-In Observer (resto igual)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('section').forEach(section => {
        section.style.animationPlayState = 'paused';
        observer.observe(section);
    });

    console.log('All scripts initialized successfully.');
});
