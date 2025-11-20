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

            // Crear icono circular personalizado
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 3px solid #4B3621; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><img src="../IMG/cdad-colegios.png" style="width: 100%; height: 100%; object-fit: cover;"/></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            document.querySelectorAll('.btn-ver').forEach(btn => {
                const lat = parseFloat(btn.dataset.lat);
                const lng = parseFloat(btn.dataset.lng);
                const communityName = btn.closest('.comunidad')?.querySelector('h3')?.textContent || 'Comunidad';

                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(mapArgentina);
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

            // Crear icono personalizado circular
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 3px solid #4B3621; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><img src="../IMG/Instituto.jpg" style="width: 100%; height: 100%; object-fit: cover;"/></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
                popupAnchor: [0, -20]
            });

            const globalLocations = [
                { coords: [-34.6037, -58.3816], name: 'Argentina' },
                { coords: [-15.8267, -47.9218], name: 'Brasil' },
                { coords: [-16.5000, -68.1500], name: 'Bolivia' },
                { coords: [-12.0464, -77.0428], name: 'Perú' },
                { coords: [41.8719, 12.5674], name: 'Italia' },
                { coords: [40.4168, -3.7038], name: 'España' },
                { coords: [51.1657, 10.4515], name: 'Alemania' },
                { coords: [45.9432, 24.9668], name: 'Rumanía' },
                { coords: [20.5937, 78.9629], name: 'India' },
                { coords: [11.8037, -15.1804], name: 'Guinea Bissau' },
                { coords: [14.4974, -14.4524], name: 'Senegal' },
                { coords: [-18.7669, 46.8691], name: 'Madagascar' },
                { coords: [21.9162, 95.9560], name: 'Myanmar' },
                { coords: [7.9465, -1.0232], name: 'Ghana' }
            ];

            globalLocations.forEach(loc => {
                L.marker(loc.coords, { icon: customIcon }).addTo(mapWorld)
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

    // Mapa de Historia (historiaProv.html)
    if (document.getElementById('mapa-historia')) {
        try {
            const mapHistoria = L.map('mapa-historia').setView([-20.0, -63.0], 5);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                subdomains: ['a', 'b', 'c'],
                minZoom: 0,
                maxZoom: 19
            }).addTo(mapHistoria);

            // Agregar marcadores para cada comunidad
            document.querySelectorAll('.acordeon-titulo[data-lat]').forEach(btn => {
                const lat = parseFloat(btn.dataset.lat);
                const lng = parseFloat(btn.dataset.lng);
                const nombre = btn.textContent.trim();

                if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                    const marker = L.marker([lat, lng]).addTo(mapHistoria);
                    marker.bindPopup(`<b>${nombre}</b>`);

                    // Click en botón centra el mapa
                    btn.addEventListener('click', () => {
                        mapHistoria.setView([lat, lng], 12);
                        marker.openPopup();
                    });
                }
            });
        } catch (error) {
            console.error('Error initializing history map:', error);
            document.getElementById('mapa-historia').innerHTML = '<p>Error al cargar el mapa.</p>';
        }
    }

    // Carrusel de fotos automático
    const carruselSlides = document.querySelectorAll('.carrusel-slide');
    const indicadores = document.querySelectorAll('.indicador');
    const btnPrev = document.querySelector('.carrusel-btn-prev');
    const btnNext = document.querySelector('.carrusel-btn-next');
    
    if (carruselSlides.length > 0) {
        let slideActual = 0;
        let intervaloCarrusel;
        
        function mostrarSlide(indice) {
            // Ocultar todos los slides
            carruselSlides.forEach(slide => slide.classList.remove('activo'));
            indicadores.forEach(ind => ind.classList.remove('activo'));
            
            // Mostrar el slide actual
            slideActual = indice;
            if (slideActual >= carruselSlides.length) slideActual = 0;
            if (slideActual < 0) slideActual = carruselSlides.length - 1;
            
            carruselSlides[slideActual].classList.add('activo');
            indicadores[slideActual].classList.add('activo');
        }
        
        function siguienteSlide() {
            mostrarSlide(slideActual + 1);
        }
        
        function slideAnterior() {
            mostrarSlide(slideActual - 1);
        }
        
        function iniciarCarrusel() {
            intervaloCarrusel = setInterval(siguienteSlide, 4000); // Cambia cada 4 segundos
        }
        
        function detenerCarrusel() {
            clearInterval(intervaloCarrusel);
        }
        
        // Botones de navegación (solo si existen)
        if (btnNext && btnPrev) {
            btnNext.addEventListener('click', () => {
                detenerCarrusel();
                siguienteSlide();
                iniciarCarrusel();
            });
            
            btnPrev.addEventListener('click', () => {
                detenerCarrusel();
                slideAnterior();
                iniciarCarrusel();
            });
        }
        
        // Indicadores (solo si existen)
        if (indicadores.length > 0) {
            indicadores.forEach((indicador, indice) => {
                indicador.addEventListener('click', () => {
                    detenerCarrusel();
                    mostrarSlide(indice);
                    iniciarCarrusel();
                });
            });
        }
        
        // Pausar al pasar el mouse (solo si existe el contenedor)
        const carruselContainer = document.querySelector('.carrusel-container');
        if (carruselContainer) {
            carruselContainer.addEventListener('mouseenter', detenerCarrusel);
            carruselContainer.addEventListener('mouseleave', iniciarCarrusel);
        }
        
        // Iniciar el carrusel automático
        iniciarCarrusel();
    }

    // Carrusel del gobierno provincial automático
    const gobiernoSlides = document.querySelectorAll('.gobierno-carrusel-slide');
    const gobiernoIndicadores = document.querySelectorAll('.gobierno-indicador');
    const gobiernoBtnPrev = document.querySelector('.gobierno-btn-prev');
    const gobiernoBtnNext = document.querySelector('.gobierno-btn-next');
    
    if (gobiernoSlides.length > 0) {
        let gobiernoSlideActual = 0;
        let gobiernoIntervalo;
        
        function mostrarGobiernoSlide(indice) {
            gobiernoSlides.forEach(slide => slide.classList.remove('activo'));
            gobiernoIndicadores.forEach(ind => ind.classList.remove('activo'));
            
            gobiernoSlideActual = indice;
            if (gobiernoSlideActual >= gobiernoSlides.length) gobiernoSlideActual = 0;
            if (gobiernoSlideActual < 0) gobiernoSlideActual = gobiernoSlides.length - 1;
            
            gobiernoSlides[gobiernoSlideActual].classList.add('activo');
            gobiernoIndicadores[gobiernoSlideActual].classList.add('activo');
        }
        
        function siguienteGobiernoSlide() {
            mostrarGobiernoSlide(gobiernoSlideActual + 1);
        }
        
        function anteriorGobiernoSlide() {
            mostrarGobiernoSlide(gobiernoSlideActual - 1);
        }
        
        function iniciarGobiernoCarrusel() {
            gobiernoIntervalo = setInterval(siguienteGobiernoSlide, 5000); // Cambia cada 5 segundos
        }
        
        function detenerGobiernoCarrusel() {
            clearInterval(gobiernoIntervalo);
        }
        
        // Botones de navegación
        gobiernoBtnNext.addEventListener('click', () => {
            detenerGobiernoCarrusel();
            siguienteGobiernoSlide();
            iniciarGobiernoCarrusel();
        });
        
        gobiernoBtnPrev.addEventListener('click', () => {
            detenerGobiernoCarrusel();
            anteriorGobiernoSlide();
            iniciarGobiernoCarrusel();
        });
        
        // Indicadores
        gobiernoIndicadores.forEach((indicador, indice) => {
            indicador.addEventListener('click', () => {
                detenerGobiernoCarrusel();
                mostrarGobiernoSlide(indice);
                iniciarGobiernoCarrusel();
            });
        });
        
        // Pausar al pasar el mouse
        const gobiernoCarruselContainer = document.querySelector('.gobierno-carrusel-container');
        gobiernoCarruselContainer.addEventListener('mouseenter', detenerGobiernoCarrusel);
        gobiernoCarruselContainer.addEventListener('mouseleave', iniciarGobiernoCarrusel);
        
        // Iniciar el carrusel automático
        iniciarGobiernoCarrusel();
    }

    // Timelines desplegables (espiritualidad.html)
    const botonesTimeline = document.querySelectorAll('.btn-timeline');
    
    botonesTimeline.forEach(boton => {
        boton.addEventListener('click', function() {
            // Obtener el contenedor padre (figura-card, carisma-card, etc.)
            const card = this.parentElement;
            const timelineContenido = card.querySelector('.timeline-contenido');
            
            // Toggle del contenido
            if (timelineContenido.classList.contains('activo')) {
                timelineContenido.classList.remove('activo');
                this.classList.remove('activo');
                this.textContent = this.textContent.includes('Timeline') ? 'Ver Timeline' : 'Ver más';
            } else {
                timelineContenido.classList.add('activo');
                this.classList.add('activo');
                this.textContent = 'Ocultar';
            }
        });
    });

    // Acordeón de Oraciones
    document.querySelectorAll('.oracion-titulo').forEach(button => {
        button.addEventListener('click', function() {
            const oracionTexto = this.nextElementSibling;
            const estaActivo = oracionTexto.classList.contains('activo');
            
            // Cerrar todas las oraciones
            document.querySelectorAll('.oracion-texto').forEach(texto => {
                texto.classList.remove('activo');
            });
            document.querySelectorAll('.oracion-titulo').forEach(titulo => {
                titulo.classList.remove('activo');
            });
            
            // Si no estaba activo, abrirlo
            if (!estaActivo) {
                oracionTexto.classList.add('activo');
                this.classList.add('activo');
            }
        });
    });

    // Carrusel automático del hero SOLAMENTE en index.html
    const heroCarruselContainer = document.querySelector('.hero-carrusel');
    
    if (heroCarruselContainer) {
        const heroSlides = document.querySelectorAll('.hero-slide');
        
        if (heroSlides.length > 0) {
            let slideActual = 0;
            
            // Asegurar que el primer slide tenga la clase activo
            heroSlides[0].classList.add('activo');
            
            function siguienteSlide() {
                // Quitar clase activo del slide actual
                heroSlides[slideActual].classList.remove('activo');
                
                // Pasar al siguiente slide
                slideActual = (slideActual + 1) % heroSlides.length;
                
                // Agregar clase activo al nuevo slide
                heroSlides[slideActual].classList.add('activo');
            }
            
            // Cambiar cada 4 segundos
            setInterval(siguienteSlide, 4000);
            
        }
    }

    // ===== CARRUSELES HISTÓRICOS =====
    const carruselesHistoricos = document.querySelectorAll('.fotos-historicas');
    
    carruselesHistoricos.forEach((seccionCarrusel) => {
        const carruselContainer = seccionCarrusel.querySelector('.carrusel-historico');
        const slides = seccionCarrusel.querySelectorAll('.carrusel-historico-slide');
        const btnPrev = seccionCarrusel.querySelector('.carrusel-btn-prev-hist');
        const btnNext = seccionCarrusel.querySelector('.carrusel-btn-next-hist');
        const indicadores = seccionCarrusel.querySelectorAll('.indicador-hist');
        
        if (slides.length > 0) {
            let slideActual = 0;
            let intervaloAuto;
            
            // Función para mostrar un slide específico
            function mostrarSlide(index) {
                // Ocultar todos los slides
                slides.forEach(slide => {
                    slide.style.opacity = '0';
                    slide.style.zIndex = '1';
                });
                
                // Remover clase activa de todos los indicadores
                indicadores.forEach(ind => ind.classList.remove('activo'));
                
                // Mostrar el slide actual
                slides[index].style.opacity = '1';
                slides[index].style.zIndex = '2';
                
                // Activar indicador correspondiente
                if (indicadores[index]) {
                    indicadores[index].classList.add('activo');
                }
                
                slideActual = index;
            }
            
            // Función para ir al siguiente slide
            function siguienteSlide() {
                const nuevoIndex = (slideActual + 1) % slides.length;
                mostrarSlide(nuevoIndex);
            }
            
            // Función para ir al slide anterior
            function anteriorSlide() {
                const nuevoIndex = (slideActual - 1 + slides.length) % slides.length;
                mostrarSlide(nuevoIndex);
            }
            
            // Función para iniciar avance automático
            function iniciarAuto() {
                intervaloAuto = setInterval(siguienteSlide, 5000);
            }
            
            // Función para detener avance automático
            function detenerAuto() {
                clearInterval(intervaloAuto);
            }
            
            // Event listeners para botones
            if (btnPrev) {
                btnPrev.addEventListener('click', () => {
                    anteriorSlide();
                    detenerAuto();
                    iniciarAuto(); // Reiniciar el temporizador
                });
            }
            
            if (btnNext) {
                btnNext.addEventListener('click', () => {
                    siguienteSlide();
                    detenerAuto();
                    iniciarAuto(); // Reiniciar el temporizador
                });
            }
            
            // Event listeners para indicadores
            indicadores.forEach((indicador, index) => {
                indicador.addEventListener('click', () => {
                    mostrarSlide(index);
                    detenerAuto();
                    iniciarAuto(); // Reiniciar el temporizador
                });
            });
            
            // Pausar en hover
            if (carruselContainer) {
                carruselContainer.addEventListener('mouseenter', detenerAuto);
                carruselContainer.addEventListener('mouseleave', iniciarAuto);
            }
            
            // Inicializar
            mostrarSlide(0);
            iniciarAuto();
        }
    });

    // Botón "Ver más" del timeline (historiaInst.html)
    const btnVerMasTimeline = document.getElementById('btn-ver-mas-timeline');
    if (btnVerMasTimeline) {
        btnVerMasTimeline.addEventListener('click', function() {
            const itemsOcultos = document.querySelectorAll('.timeline-item-oculto');
            itemsOcultos.forEach(item => {
                item.classList.add('mostrar');
            });
            btnVerMasTimeline.style.display = 'none';
        });
    }

    // Modal para imágenes en galería (cdad-colegios.html)
    const galeriaImagenes = document.querySelectorAll('.galeria-imagenes img');
    if (galeriaImagenes.length > 0) {
        // Crear modal si no existe
        let modal = document.querySelector('.modal-imagen');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'modal-imagen';
            modal.innerHTML = `
                <span class="cerrar-modal">&times;</span>
                <img src="" alt="Imagen expandida">
            `;
            document.body.appendChild(modal);
        }

        const modalImg = modal.querySelector('img');
        const cerrarModal = modal.querySelector('.cerrar-modal');

        // Agregar click a cada imagen
        galeriaImagenes.forEach(img => {
            img.addEventListener('click', function() {
                modal.classList.add('activo');
                modalImg.src = this.src;
                modalImg.alt = this.alt;
            });
        });

        // Cerrar modal
        cerrarModal.addEventListener('click', function() {
            modal.classList.remove('activo');
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('activo');
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('activo')) {
                modal.classList.remove('activo');
            }
        });
    }

    // Carrusel Comunidades y Laicos
    const carruselColegios = document.querySelector('.carrusel-colegios-imagenes');
    if (carruselColegios) {
        const slides = carruselColegios.querySelectorAll('.carrusel-colegios-slide');
        const btnPrev = document.querySelector('.carrusel-btn-prev-colegios');
        const btnNext = document.querySelector('.carrusel-btn-next-colegios');
        const indicadores = document.querySelector('.carrusel-colegios-indicadores');
        
        let currentIndex = 0;
        let autoPlayInterval;
        
        // Crear indicadores
        slides.forEach((_, index) => {
            const indicador = document.createElement('div');
            indicador.classList.add('indicador-colegios');
            if (index === 0) indicador.classList.add('activo');
            indicador.addEventListener('click', () => goToSlide(index));
            indicadores.appendChild(indicador);
        });
        
        const dots = indicadores.querySelectorAll('.indicador-colegios');
        
        function updateCarousel() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('activo', index === currentIndex);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('activo', index === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 6000);
        }
        
        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }
        
        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }
        
        // Event listeners
        btnNext.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        
        btnPrev.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
        
        // Pausar en hover
        carruselColegios.addEventListener('mouseenter', stopAutoPlay);
        carruselColegios.addEventListener('mouseleave', startAutoPlay);
        
        // Iniciar autoplay
        startAutoPlay();
    }

    // Manejo del formulario de contacto con FormSubmit
    const contactForm = document.getElementById('contacto-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        
        // FormSubmit maneja el envío automáticamente, solo mostramos feedback
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('.btn-submit');
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
        });
    }

    console.log('All scripts initialized successfully.');
});
