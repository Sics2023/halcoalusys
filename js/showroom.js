// Virtual Showroom: "coming soon" popup for the header button until the 3D tour launches.
(function () {
    var buttons = Array.prototype.filter.call(document.querySelectorAll('a.btn-one'), function (a) {
        return /virtual showroom/i.test(a.textContent);
    });
    if (!buttons.length) return;

    var modal = document.createElement('div');
    modal.className = 'brochure-modal showroom-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'showroom-modal-title');
    modal.hidden = true;
    modal.innerHTML =
        '<div class="brochure-modal-backdrop" data-showroom-close></div>' +
        '<div class="brochure-modal-box showroom-modal-box">' +
            '<button type="button" class="brochure-modal-close" data-showroom-close aria-label="Close">&times;</button>' +
            '<div class="showroom-badge"><i class="fa fa-cube" aria-hidden="true"></i> Coming Soon</div>' +
            '<h3 id="showroom-modal-title">Our Virtual Showroom is on its way</h3>' +
            '<p class="showroom-intro">Soon you’ll be able to step inside the ALUSYS showroom from anywhere. ' +
                'An immersive 3D experience will let you walk through the space and explore every system up close.</p>' +
            '<ul class="showroom-features">' +
                '<li><i class="fa fa-street-view" aria-hidden="true"></i><span><strong>360° virtual tour</strong> of our showroom, at your own pace</span></li>' +
                '<li><i class="fa fa-cubes" aria-hidden="true"></i><span><strong>Interactive 3D products</strong>: open, slide and fold our doors, windows and partitions</span></li>' +
                '<li><i class="fa fa-paint-brush" aria-hidden="true"></i><span><strong>Shades &amp; finishes</strong>: see powder-coat, anodized and wood finishes in context</span></li>' +
            '</ul>' +
            '<p class="showroom-meanwhile">In the meantime, visit us in person or browse our brochure.</p>' +
            '<div class="showroom-actions">' +
                '<a class="btn-one" href="contact.html">Book a Showroom Visit<span class="flaticon-next"></span></a>' +
                '<button type="button" class="showroom-secondary" data-showroom-brochure>Download Brochure</button>' +
            '</div>' +
        '</div>';
    document.body.appendChild(modal);

    var lastFocus = null;

    function open(e) {
        e.preventDefault();
        lastFocus = document.activeElement;
        modal.hidden = false;
        document.body.classList.add('brochure-modal-open');
        modal.querySelector('.brochure-modal-close').focus();
    }

    function close() {
        modal.hidden = true;
        document.body.classList.remove('brochure-modal-open');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    buttons.forEach(function (a) {
        a.setAttribute('href', '#virtual-showroom');
        a.setAttribute('aria-haspopup', 'dialog');
        a.addEventListener('click', open);
    });

    modal.addEventListener('click', function (e) {
        if (e.target.closest('[data-showroom-close]')) { close(); return; }
        if (e.target.closest('[data-showroom-brochure]')) {
            close();
            // hand over to the brochure form (js/brochure.js)
            var tab = document.querySelector('.brochure-tab');
            if (tab) tab.click();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) close();
    });
})();
