// Sends the site's forms (contact, appointment, newsletter) to the sales inboxes via FormSubmit.
(function () {
    var ENDPOINT = 'https://formsubmit.co/ajax/alusys@halcoaluminium.com';
    var CC = 'antonywilson@halcoaluminium.com';

    function field(form, names) {
        for (var i = 0; i < names.length; i++) {
            var el = form.querySelector('[name="' + names[i] + '"]');
            if (el) return el;
        }
        return null;
    }

    function status(form, text, ok) {
        var box = form.querySelector('.form-status');
        if (!box) {
            box = document.createElement('p');
            box.className = 'form-status';
            box.setAttribute('aria-live', 'polite');
            form.appendChild(box);
        }
        box.textContent = text;
        box.className = 'form-status ' + (ok ? 'is-ok' : 'is-error');
    }

    function send(form, subject, data, button) {
        var payload = { _subject: subject, _template: 'table', _captcha: 'false', _cc: CC, Page: window.location.href };
        Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
        if (button) button.disabled = true;
        return fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        }).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            form.reset();
            status(form, 'Thank you! We have received your details and will get back to you shortly.', true);
        }).catch(function () {
            status(form, 'Sorry, something went wrong. Please call us on +91 70990 72190 or email alusys@halcoaluminium.com.', false);
        }).then(function () {
            if (button) button.disabled = false;
        });
    }

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validPhone(v) {
        var d = v.replace(/\D/g, '');
        return d.length >= 10 && d.length <= 13;
    }

    // Contact page enquiry form
    document.querySelectorAll('form.contact-enquiry-form').forEach(function (form) {
        form.setAttribute('novalidate', '');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = field(form, ['name']).value.trim();
            var phone = field(form, ['phone']).value.trim();
            var email = field(form, ['email']).value.trim();
            var message = field(form, ['message']).value.trim();
            if (name.length < 2) return status(form, 'Please enter your name.', false);
            if (!validPhone(phone)) return status(form, 'Please enter a valid phone number.', false);
            if (!EMAIL_RE.test(email)) return status(form, 'Please enter a valid email address.', false);
            send(form, 'Website enquiry: ' + name,
                { Name: name, Phone: phone, Email: email, Message: message || '-' },
                form.querySelector('button[type="submit"]'));
        });
    });

    // "Make Appointment" form (home and Why Aluminium)
    document.querySelectorAll('form.appointment-form').forEach(function (form) {
        form.setAttribute('novalidate', '');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = field(form, ['form_name', 'name']).value.trim();
            var email = field(form, ['form_email', 'email']).value.trim();
            var select = form.querySelector('select');
            var interest = select && select.selectedIndex > 0 ? select.value : '-';
            if (name.length < 2) return status(form, 'Please enter your name.', false);
            if (!EMAIL_RE.test(email)) return status(form, 'Please enter a valid email address.', false);
            send(form, 'Appointment request: ' + name,
                { Name: name, Email: email, 'Interested in': interest },
                form.querySelector('button[type="submit"]'));
        });
    });

    // Footer newsletter
    document.querySelectorAll('form.subscribe-form').forEach(function (form) {
        form.setAttribute('novalidate', '');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = field(form, ['email']).value.trim();
            if (!EMAIL_RE.test(email)) return status(form, 'Please enter a valid email address.', false);
            send(form, 'Newsletter subscription', { Email: email }, form.querySelector('button[type="submit"]'));
        });
    });
})();
