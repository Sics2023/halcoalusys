// Download Brochure: floating tab + lead form (name, phone).
// The details are emailed to the sales inbox via FormSubmit, then the PDF downloads.
(function () {
    var BROCHURE_URL = 'downloads/ALUSYS-Exterior-Brochure.pdf';
    var BROCHURE_NAME = 'ALUSYS-Exterior-Brochure.pdf';
    var FORM_ENDPOINT = 'https://formsubmit.co/ajax/alusys@halcoaluminium.com';
    var FORM_CC = 'antonywilson@halcoaluminium.com';
    var STORAGE_KEY = 'alusysBrochureLead';

    function store(get, value) {
        try {
            if (get) return window.localStorage.getItem(STORAGE_KEY);
            window.localStorage.setItem(STORAGE_KEY, value);
        } catch (e) { /* storage unavailable: just ask again next time */ }
        return null;
    }

    function download() {
        var a = document.createElement('a');
        a.href = BROCHURE_URL;
        a.setAttribute('download', BROCHURE_NAME);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    // essential tab styles inline, so the tab shows even if an old style.css is cached
    if (!document.getElementById('brochure-tab-style')) {
        var st = document.createElement('style');
        st.id = 'brochure-tab-style';
        st.textContent =
            '.brochure-tab{position:fixed!important;top:50%!important;right:0!important;left:auto!important;bottom:auto!important;' +
            'z-index:2147483000!important;display:flex!important;align-items:center;gap:10px;margin:0;padding:18px 12px;border:0;' +
            'border-radius:6px 0 0 6px;background:#4A5F6F;color:#fff;font-size:15px;font-weight:500;letter-spacing:1px;' +
            'writing-mode:vertical-rl;transform:translateY(-50%) rotate(180deg);box-shadow:0 6px 18px rgba(0,0,0,.2);cursor:pointer}' +
            '.brochure-tab i{transform:rotate(90deg)}' +
            // phones: a small pill in the bottom-left corner instead of a tall tab over the content
            '@media (max-width:767px){.brochure-tab{top:auto!important;bottom:16px!important;left:12px!important;right:auto!important;' +
            'writing-mode:horizontal-tb;transform:none!important;padding:10px 16px;gap:8px;border-radius:22px;font-size:13px;letter-spacing:.3px}' +
            '.brochure-tab i{transform:none}}' +
            '.brochure-modal{position:fixed;inset:0;z-index:2147483001;display:flex;align-items:center;justify-content:center;padding:16px}' +
            '.brochure-modal[hidden]{display:none}' +
            '.brochure-modal-backdrop{position:absolute;inset:0;background:rgba(18,25,31,.7)}' +
            '.brochure-modal-box{position:relative;width:100%;max-width:440px;background:#fff;border-radius:8px}';
        document.head.appendChild(st);
    }

    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'brochure-tab';
    tab.setAttribute('data-brochure-open', '');
    tab.innerHTML = '<i class="fa fa-download" aria-hidden="true"></i><span>Download Brochure</span>';

    var modal = document.createElement('div');
    modal.className = 'brochure-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'brochure-modal-title');
    modal.hidden = true;
    modal.innerHTML =
        '<div class="brochure-modal-backdrop" data-brochure-close></div>' +
        '<div class="brochure-modal-box">' +
            '<button type="button" class="brochure-modal-close" data-brochure-close aria-label="Close">&times;</button>' +
            '<div class="brochure-modal-head">' +
                '<h3 id="brochure-modal-title">Download Our Brochure</h3>' +
                '<p class="brochure-modal-intro">Share your details and the ALUSYS brochure will download straight away.</p>' +
            '</div>' +
            '<form class="brochure-form" novalidate>' +
                '<label for="brochure-name">Name</label>' +
                '<input id="brochure-name" name="name" type="text" autocomplete="name" required placeholder="Your full name">' +
                '<label for="brochure-phone">Phone number</label>' +
                '<input id="brochure-phone" name="phone" type="tel" autocomplete="tel" required placeholder="10-digit mobile number">' +
                '<p class="brochure-form-error" aria-live="polite"></p>' +
                '<button type="submit" class="btn-one">Download Brochure<span class="flaticon-next"></span></button>' +
                '<p class="brochure-form-note">By submitting, you agree to our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
            '</form>' +
            '<div class="brochure-thanks" hidden>' +
                '<h3>Thank you!</h3>' +
                '<p>Your download has started. If it didn’t, <a href="' + BROCHURE_URL + '" download="' + BROCHURE_NAME + '">click here to download the brochure</a>.</p>' +
            '</div>' +
        '</div>';

    document.body.appendChild(tab);
    document.body.appendChild(modal);

    var head = modal.querySelector('.brochure-modal-head');
    var form = modal.querySelector('.brochure-form');
    var thanks = modal.querySelector('.brochure-thanks');
    var errorBox = modal.querySelector('.brochure-form-error');
    var nameInput = modal.querySelector('#brochure-name');
    var phoneInput = modal.querySelector('#brochure-phone');
    var lastFocus = null;

    function openModal() {
        lastFocus = document.activeElement;
        head.hidden = false;
        form.hidden = false;
        thanks.hidden = true;
        errorBox.textContent = '';
        modal.hidden = false;
        document.body.classList.add('brochure-modal-open');
        nameInput.focus();
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('brochure-modal-open');
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener('click', function (e) {
        var opener = e.target.closest && e.target.closest('[data-brochure-open]');
        if (opener) {
            e.preventDefault();
            // returning visitors who already shared their details download directly
            if (store(true)) { download(); return; }
            openModal();
            return;
        }
        if (e.target.closest && e.target.closest('[data-brochure-close]')) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = nameInput.value.trim();
        var phone = phoneInput.value.trim();
        var digits = phone.replace(/\D/g, '');
        if (name.length < 2) {
            errorBox.textContent = 'Please enter your name.';
            nameInput.focus();
            return;
        }
        if (digits.length < 10 || digits.length > 13) {
            errorBox.textContent = 'Please enter a valid phone number.';
            phoneInput.focus();
            return;
        }
        errorBox.textContent = '';

        // download first, while the click is still a user gesture
        download();
        store(false, '1');
        head.hidden = true;
        form.hidden = true;
        thanks.hidden = false;

        if (window.fetch) {
            fetch(FORM_ENDPOINT, {
                method: 'POST',
                keepalive: true,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: 'Brochure download: ' + name,
                    _template: 'table',
                    _captcha: 'false',
                    _cc: FORM_CC,
                    Name: name,
                    Phone: phone,
                    Brochure: 'ALUSYS Exterior Brochure',
                    Page: window.location.href
                })
            }).catch(function () { /* the download already happened; nothing to show */ });
        }
    });
})();
