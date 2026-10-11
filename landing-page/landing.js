$(document).ready(function () {
    const $navLinks = $('.navbar-nav .nav-link');
    const $sections = $('section[id], #catalog, #services, #about');

    function updateActiveNav() {
        let currentId = '';
        const scrollPosition = $(window).scrollTop() + 140;

        $sections.each(function () {
            const $section = $(this);
            const sectionTop = $section.offset().top;
            const sectionBottom = sectionTop + $section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentId = $section.attr('id');
                return false;
            }
        });

        $navLinks.each(function () {
            const $link = $(this);
            const href = $link.attr('href');
            const isActive = href === '#' ? currentId === '' : href === `#${currentId}`;

            $link.toggleClass('active', isActive);

            if (isActive) {
                $link.attr('aria-current', 'page');
            } else {
                $link.removeAttr('aria-current');
            }
        });
    }

    // Click nav link behavior
    $('.navbar-nav .nav-link').on('click', function () {
        const $navbarCollapse = $('#main-navigation');

        if ($navbarCollapse.hasClass('show')) {
            $navbarCollapse.collapse('hide');
        }
    });

    // Smooth scroll for section links
    $('a[href^="#"]').on('click', function (event) {
        const targetId = $(this).attr('href');

        if (!targetId || targetId === '#' || !$(targetId).length) {
            return;
        }

        event.preventDefault();

        $('html, body').animate({
            scrollTop: $(targetId).offset().top
        }, 400, function () {
            updateActiveNav();
        });
    });

    // Keep nav in sync while scrolling
    $(window).on('scroll', updateActiveNav);
    updateActiveNav();
});