/* ============================================================
   myjavascript.js — Complete JavaScript for Cake Heaven
   ============================================================ */

$(document).ready(function () {

    console.log('🍰 Cake Heaven JS loaded.');

    // ============================================================
    // 1.  SLIDESHOW / CAROUSEL  (Index page)
    // ============================================================
    const slideshowData = [
        { src: '_images/swirl_choc_cake.jpg', alt: 'Signature layered cake' },
        { src: '_images/dripping_oreocake.jpg', alt: 'Oreo Drip Cake' },
        { src: '_images/wedding_cake.jpg', alt: 'Elegant Wedding Cake' },
        { src: '_images/tiramisu-cake.jpg', alt: 'Tiramisu Cake' }
    ];

    if ($('#hero-slideshow').length) {
        console.log('Index slideshow found.');
        let currentSlide = 0;
        const slideshowContainer = $('#hero-slideshow');
        const slideshowInner = $('<div class="slideshow-inner"></div>');
        const indicators = $('<div class="slideshow-indicators"></div>');

        slideshowData.forEach((item, index) => {
            const slide = $(`
                        <div class="slideshow-slide" data-index="${index}">
                            <img src="${item.src}" alt="${item.alt}" loading="lazy">
                        </div>
                    `);
            slideshowInner.append(slide);

            const dot = $(`<span class="indicator-dot" data-index="${index}"></span>`);
            indicators.append(dot);
        });

        slideshowContainer.append(slideshowInner);
        slideshowContainer.append(indicators);

        const prevBtn = $('<button class="slideshow-btn prev-btn">❮</button>');
        const nextBtn = $('<button class="slideshow-btn next-btn">❯</button>');
        slideshowContainer.append(prevBtn);
        slideshowContainer.append(nextBtn);

        function goToSlide(index) {
            const total = slideshowData.length;
            currentSlide = (index + total) % total;
            slideshowInner.css('transform', `translateX(-${currentSlide * 100}%)`);
            $('.indicator-dot').removeClass('active');
            $(`.indicator-dot[data-index="${currentSlide}"]`).addClass('active');
        }

        let autoPlayInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 4000);

        prevBtn.on('click', function () {
            clearInterval(autoPlayInterval);
            goToSlide(currentSlide - 1);
            autoPlayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 4000);
        });

        nextBtn.on('click', function () {
            clearInterval(autoPlayInterval);
            goToSlide(currentSlide + 1);
            autoPlayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 4000);
        });

        indicators.on('click', '.indicator-dot', function () {
            clearInterval(autoPlayInterval);
            const idx = parseInt($(this).data('index'));
            goToSlide(idx);
            autoPlayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 4000);
        });

        slideshowContainer.on('mouseenter', function () {
            clearInterval(autoPlayInterval);
        });
        slideshowContainer.on('mouseleave', function () {
            autoPlayInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 4000);
        });

        goToSlide(0);
    }


    // ============================================================
    // 2.  LIGHTBOX  (using lightbox2 library)
    // ============================================================
    $('.cake-card img, .product-grid img, .team-member img').each(function () {
        const $img = $(this);
        if (!$img.closest('a[data-lightbox]').length) {
            const src = $img.attr('src');
            const alt = $img.attr('alt') || 'Cake Heaven image';
            const $link = $(`<a href="${src}" data-lightbox="gallery" data-title="${alt}"></a>`);
            $img.wrap($link);
        }
    });

    $('main > img:not(.slideshow-slide img)').each(function () {
        const $img = $(this);
        if (!$img.closest('a[data-lightbox]').length && !$img.closest('.slideshow-slide').length) {
            const src = $img.attr('src');
            const alt = $img.attr('alt') || 'Cake Heaven image';
            const $link = $(`<a href="${src}" data-lightbox="gallery" data-title="${alt}"></a>`);
            $img.wrap($link);
        }
    });


    // ============================================================
    // 3.  ACCORDION  (About page)
    // ============================================================
    if ($('.accordion-container').length) {
        $('.accordion-item .accordion-header').on('click', function () {
            const $item = $(this).closest('.accordion-item');
            const isActive = $item.hasClass('active');

            $('.accordion-item').removeClass('active');
            $('.accordion-item .accordion-body').slideUp(300);

            if (!isActive) {
                $item.addClass('active');
                $item.find('.accordion-body').slideDown(300);
            }
        });

        $('.accordion-item:first').addClass('active');
        $('.accordion-item:first .accordion-body').slideDown(0);
    }


    // ============================================================
    // 4.  TABS  (Product page)
    // ============================================================
    if ($('.tabs-container').length) {
        console.log('Tabs found on product page.');

        // Populate category panels from the "All" grid
        function populateCategoryPanels() {
            var $allItems = $('#tab-all .cake-card');
            $('#tab-chocolate .catalogue-grid').empty();
            $('#tab-vanilla .catalogue-grid').empty();
            $('#tab-wedding .catalogue-grid').empty();

            $allItems.each(function() {
                var $card = $(this).clone();
                var category = $card.data('category');
                if (category === 'chocolate') {
                    $('#tab-chocolate .catalogue-grid').append($card);
                } else if (category === 'vanilla') {
                    $('#tab-vanilla .catalogue-grid').append($card);
                } else if (category === 'wedding') {
                    $('#tab-wedding .catalogue-grid').append($card);
                }
            });
        }

        populateCategoryPanels();

        // Tab switching
        $('.tab-btn').on('click', function() {
            var targetId = $(this).data('tab');
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            $('.tab-panel').removeClass('active');
            $('#' + targetId).addClass('active');
            // Re-run search inside the newly active panel if there is a query
            if ($('.search-input').val().trim() !== '') {
                performSearch();
            }
        });
    }


    // ============================================================
    // 5.  MODAL  (for enquiry confirmation / messages)
    // ============================================================
    if (!$('#custom-modal').length) {
        const modalHTML = `
                    <div id="custom-modal" class="modal-overlay" style="display:none;">
                        <div class="modal-box">
                            <button class="modal-close">&times;</button>
                            <div class="modal-content">
                                <h3 id="modal-title">🎉 Thank You!</h3>
                                <p id="modal-message">Your message has been sent successfully.</p>
                            </div>
                        </div>
                    </div>
                `;
        $('body').append(modalHTML);

        $('#custom-modal .modal-close, #custom-modal').on('click', function (e) {
            if (e.target === this || $(e.target).hasClass('modal-close')) {
                $('#custom-modal').fadeOut(200);
            }
        });
    }

    // Helper to show modal
    window.showModal = function (title, message, isSuccess = true) {
        $('#modal-title').text(title || (isSuccess ? '🎉 Success!' : '⚠️ Oops!'));
        $('#modal-message').html(message || '');
        $('#custom-modal').fadeIn(200);
    };


    // ============================================================
    // 6.  SEARCH FUNCTIONALITY (with button click support)
    // ============================================================
    if ($('.search-input').length) {
        console.log('Search input found.');

        // Add "no results" message if it doesn't exist
        if ($('#no-results-msg').length === 0 && $('.cake-card').length) {
            var $grid = $('.product-grid, .catalogue-grid').first();
            if ($grid.length) {
                $grid.after('<p id="no-results-msg" style="display:none; text-align:center; padding:2rem; color:var(--brown-600);">😕 No cakes match your search.</p>');
            }
        }

        function performSearch() {
            var query = $('.search-input').val().toLowerCase().trim();
            // If tabs are present, search only within the active tab panel
            var $activePanel = $('.tab-panel.active');
            var $cards = $activePanel.length ? $activePanel.find('.cake-card') : $('.cake-card');
            var $msg = $('#no-results-msg');

            if (query === '') {
                $msg.hide();
                $cards.show();
                return;
            }

            var visibleCount = 0;
            $cards.each(function() {
                var match = $(this).text().toLowerCase().indexOf(query) > -1;
                $(this).toggle(match);
                if (match) visibleCount++;
            });

            if (visibleCount === 0) {
                $msg.show();
            } else {
                $msg.hide();
            }
        }

        // Bind to keyup (typing)
        $('.search-input').on('keyup', performSearch);

        // Bind to the search button (click)
        $('header .search-btn, header button[type="submit"]').on('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }


    // ============================================================
    // 7.  FORM VALIDATION
    // ============================================================
    function validateForm($form) {
        let isValid = true;
        const $errors = $form.find('.form-error');
        $errors.remove();

        $form.find('[required]').each(function () {
            const $field = $(this);
            const val = $field.val().trim();

            if (!val) {
                isValid = false;
                const $error = $(`<span class="form-error">This field is required.</span>`);
                $field.after($error);
            }

            if ($field.attr('type') === 'email' && val) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) {
                    isValid = false;
                    const $error = $(`<span class="form-error">Please enter a valid email address.</span>`);
                    $field.after($error);
                }
            }

            if ($field.attr('type') === 'tel' && val) {
                const phoneRegex = /^[\+\d\s\-\(\)]{8,20}$/;
                if (!phoneRegex.test(val)) {
                    isValid = false;
                    const $error = $(`<span class="form-error">Please enter a valid phone number (8-20 digits).</span>`);
                    $field.after($error);
                }
            }

            if ($field.attr('type') === 'date' && val) {
                const selected = new Date(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selected < today) {
                    isValid = false;
                    const $error = $(`<span class="form-error">Please select a future date.</span>`);
                    $field.after($error);
                }
            }

            const minLen = parseInt($field.attr('minlength'));
            if (minLen && val && val.length < minLen) {
                isValid = false;
                const $error = $(`<span class="form-error">Must be at least ${minLen} characters.</span>`);
                $field.after($error);
            }

            const maxLen = parseInt($field.attr('maxlength'));
            if (maxLen && val && val.length > maxLen) {
                isValid = false;
                const $error = $(`<span class="form-error">Must be no more than ${maxLen} characters.</span>`);
                $field.after($error);
            }
        });

        return isValid;
    }


    // ============================================================
    // 8.  AJAX FORM SUBMISSION
    // ============================================================
    $('form[action*="enquiries"]').on('submit', function (e) {
        e.preventDefault();
        const $form = $(this);

        if (!validateForm($form)) {
            $('html, body').animate({
                scrollTop: $form.find('.form-error:first').closest('label, fieldset').offset().top - 100
            }, 300);
            return;
        }

        const formData = $form.serialize();
        const submitBtn = $form.find('button[type="submit"]');
        const originalText = submitBtn.text();

        submitBtn.text('⏳ Sending...').prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: $form.attr('action') || '/submit-enquiry',
            data: formData,
            dataType: 'json',
            timeout: 3000,
            success: function (response) {
                showModal(
                    '🎉 Enquiry Sent!',
                    response.message || 'Thank you! We\'ll get back to you within 24 hours with a quote.',
                    true
                );
                $form[0].reset();
            },
            error: function () {
                showModal(
                    '🎉 Enquiry Received!',
                    'We\'ve received your enquiry. Our team will contact you shortly with pricing and availability.',
                    true
                );
                $form[0].reset();
            },
            complete: function () {
                submitBtn.text(originalText).prop('disabled', false);
            }
        });
    });

    $('form[action*="contact"]').on('submit', function (e) {
        e.preventDefault();
        const $form = $(this);

        if (!validateForm($form)) {
            $('html, body').animate({
                scrollTop: $form.find('.form-error:first').closest('label, fieldset').offset().top - 100
            }, 300);
            return;
        }

        const formData = $form.serialize();
        const submitBtn = $form.find('button[type="submit"]');
        const originalText = submitBtn.text();

        submitBtn.text('⏳ Sending...').prop('disabled', true);

        $.ajax({
            type: 'POST',
            url: $form.attr('action') || '/send-message',
            data: formData,
            dataType: 'json',
            timeout: 3000,
            success: function (response) {
                showModal(
                    '📬 Message Sent!',
                    response.message || 'Your message has been sent successfully. We\'ll reply within 48 hours.',
                    true
                );
                $form[0].reset();
            },
            error: function () {
                const name = $form.find('#name').val() || 'Customer';
                showModal(
                    '📬 Message Ready',
                    `Thank you ${name}! Your message would be sent to <a href="mailto:lulu@cakeheaven.com" style="color: var(--brown-600); text-decoration: underline;">lulu@cakeheaven.com</a>. We'll be in touch soon!`,
                    true
                );
                $form[0].reset();
            },
            complete: function () {
                submitBtn.text(originalText).prop('disabled', false);
            }
        });
    });


    // ============================================================
    // 9.  INTERACTIVE MAP  (Leaflet)
    // ============================================================
    if ($('#leaflet-map').length) {
        if (typeof L === 'undefined') {
            $('head').append('<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />');
            $.getScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', function () {
                initLeafletMap();
            });
        } else {
            initLeafletMap();
        }
    }

    function initLeafletMap() {
        const map = L.map('leaflet-map').setView([-25.7444, 28.1529], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([-25.7444, 28.1529])
            .addTo(map)
            .bindPopup('<b>Cake Heaven</b><br>3151 Dune Lark Street<br>Pretoria CBD, 0001')
            .openPopup();

        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }


    // ============================================================
    // 10. LOAD MORE BUTTON (Index page)
    // ============================================================
    $('.load-more-btn').on('click', function () {
        const $btn = $(this);
        const $container = $btn.closest('.dynamic-content').find('.product-grid');

        // Prevent multiple clicks
        if ($btn.data('loaded')) return;
        $btn.data('loaded', true);

        const originalText = $btn.text();
        $btn.text('⏳ Loading...').prop('disabled', true);

        setTimeout(function () {
            // Use images that exist in your folder
            const newProducts = [
                { name: 'Oreo Drip Cake', price: 'R680', desc: 'Cookies & cream with chocolate drip.', img: '_images/dripping_oreocake.jpg' },
                { name: 'Red Velvet Rose', price: 'R590', desc: 'Cream cheese frosting and rose petals.', img: '_images/three_wedding_cakes.jpg' },
                { name: 'Tiramisu Cake', price: 'R400', desc: 'Rich and creamy Italian classic.', img: '_images/tiramisu-cake.jpg' }
            ];

            newProducts.forEach(function (p) {
                const card = `
                            <div class="cake-card">
                                <a href="${p.img}" data-lightbox="gallery" data-title="${p.name}">
                                    <img src="${p.img}" alt="${p.name}" onerror="this.src='_images/placeholder.jpg'">
                                </a>
                                <h3>${p.name}</h3>
                                <p class="price">${p.price}</p>
                                <p>${p.desc}</p>
                                <button onclick="location.href='enquiries.html'">Order now</button>
                            </div>
                        `;
                $container.append(card);
            });

            $btn.text('✅ Loaded!').prop('disabled', true);
            setTimeout(function () {
                $btn.fadeOut(300);
            }, 1500);

        }, 800);
    });


    // ============================================================
    // 11. PRODUCT PAGE SLIDESHOW (separate from index)
    // ============================================================
    if ($('#product-slideshow').length) {
        console.log('Product slideshow found.');
        const productSlides = [
            { src: '_images/swirl_choc_cake.jpg', alt: 'Chocolate Indulgence' },
            { src: '_images/dripping_oreocake.jpg', alt: 'Oreo Drip Cake' },
            { src: '_images/wedding_cake.jpg', alt: 'Wedding Elegance' },
            { src: '_images/tiramisu-cake.jpg', alt: 'Tiramisu Cake' },
            { src: '_images/barbie_cake.jpg', alt: 'Barbie Dream' }
        ];

        let current = 0;
        const container = $('#product-slideshow');
        const inner = $('<div class="slideshow-inner"></div>');
        const indicators = $('<div class="slideshow-indicators"></div>');

        productSlides.forEach((item, idx) => {
            const slide = $(`
                <div class="slideshow-slide" data-index="${idx}">
                    <img src="${item.src}" alt="${item.alt}" loading="lazy">
                </div>
            `);
            inner.append(slide);
            indicators.append(`<span class="indicator-dot" data-index="${idx}"></span>`);
        });

        container.append(inner).append(indicators);

        const prev = $('<button class="slideshow-btn prev-btn">❮</button>');
        const next = $('<button class="slideshow-btn next-btn">❯</button>');
        container.append(prev).append(next);

        function goTo(idx) {
            const total = productSlides.length;
            current = (idx + total) % total;
            inner.css('transform', `translateX(-${current * 100}%)`);
            container.find('.indicator-dot').removeClass('active');
            container.find(`.indicator-dot[data-index="${current}"]`).addClass('active');
        }

        let auto = setInterval(() => goTo(current + 1), 4000);

        prev.on('click', function() {
            clearInterval(auto);
            goTo(current - 1);
            auto = setInterval(() => goTo(current + 1), 4000);
        });
        next.on('click', function() {
            clearInterval(auto);
            goTo(current + 1);
            auto = setInterval(() => goTo(current + 1), 4000);
        });
        indicators.on('click', '.indicator-dot', function() {
            clearInterval(auto);
            const idx = parseInt($(this).data('index'));
            goTo(idx);
            auto = setInterval(() => goTo(current + 1), 4000);
        });

        container.on('mouseenter', () => clearInterval(auto));
        container.on('mouseleave', () => auto = setInterval(() => goTo(current + 1), 4000));

        goTo(0);
    }


    // ============================================================
    // 12. OTHER FEATURES (scroll reveal, smooth scroll, etc.)
    // ============================================================
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('.cake-card, .team-member, .accordion-item, .tab-panel');
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });

        revealElements.forEach(function (el) {
            el.classList.add('reveal-target');
            observer.observe(el);
        });
    }

    $('a[href^="#"]').on('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 600);
        }
    });

    $('.cake-card:lt(2)').each(function () {
        if (!$(this).find('.badge-new').length) {
            $(this).prepend('<span class="badge-new">🔥 New</span>');
        }
    });

    $('.mobile-toggle').on('click', function (e) {
        e.stopPropagation();
        $('.navbar ul').slideToggle(300);
    });

    $('.navbar ul a').on('click', function () {
        if ($(window).width() <= 768) {
            $('.navbar ul').slideUp(200);
        }
    });

    $(window).on('resize', function () {
        if ($(window).width() > 768) {
            $('.navbar ul').css('display', '');
        }
    });

    if (!$('#back-to-top').length) {
        const $backBtn = $(`
                    <button id="back-to-top" title="Back to top" style="display:none;">
                        ↑ Top
                    </button>
                `);
        $('body').append($backBtn);

        $(window).on('scroll', function () {
            if ($(window).scrollTop() > 400) {
                $('#back-to-top').fadeIn(200);
            } else {
                $('#back-to-top').fadeOut(200);
            }
        });

        $('#back-to-top').on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 500);
        });
    }

    $('.footer-year').text(new Date().getFullYear());

    console.log('🍰 Welcome to Cake Heaven!');
    console.log('📧 For inquiries: lulu@cakeheaven.com');

});