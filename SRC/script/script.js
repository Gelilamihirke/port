/* =========================================================
   MENU / NAVBAR TOGGLE
   ========================================================= */

let menu = document.querySelector('#menu-icon-js');
let menuicon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let navtc = document.querySelector('#nav-tc-js');

if (menu && menuicon && navbar && navtc) {
    menu.onclick = () => {
        menuicon.classList.toggle('bx-x');
        navbar.classList.toggle('open');
        navtc.classList.toggle('nav-touch-close-open');
    };

    navtc.onclick = () => {
        menuicon.classList.toggle('bx-x');
        navbar.classList.remove('open');
        navtc.classList.remove('nav-touch-close-open');
        navtc.classList.remove('nav-tc-z');
        navtc.classList.remove('nav-LR-TC');
    };
}


/* =========================================================
   HEADER — STICKY + BLUR ON SCROLL
   (no more hide-on-scroll-down)
   ========================================================= */

const header = document.getElementById('header');

function toggleHeaderBg() {
    if (!header) return;

    const y =
        window.pageYOffset ||
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

    if (y > 30) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Always keep the header at the top — no more sliding away
    header.style.top = '0';
}

window.addEventListener('scroll', toggleHeaderBg, { passive: true });
document.addEventListener('scroll', toggleHeaderBg, { passive: true, capture: true });
toggleHeaderBg(); // run once on load


/* =========================================================
   CONTACT FORM — OLD TEMPLATE (still supported)
   ========================================================= */

const contactSection = document.querySelector('.contact-section');
const formSection = document.querySelector('.form-section');
const contactSubmitAfter = document.querySelector('.contact-submit-after');
const csaOK = document.querySelector('.csa-ok');

const contactForm = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const errorDiv = document.querySelector('.error');
const emailErrorDiv = document.querySelector('.email-error');
const contactButton = document.querySelector('.contact-button');
const contactLoad = document.querySelector('.contact-load');
const submitText = document.querySelector('.submit-text');

if (csaOK) {
    csaOK.onclick = () => {
        contactSubmitAfter.classList.remove('show');
        if (formSection) formSection.classList.remove('hide');
        if (contactSection) contactSection.classList.remove('csa-cs');
        if (contactForm) contactForm.classList.remove('csa-cf');
        if (contactButton) contactButton.classList.remove('loading');
        if (contactLoad) contactLoad.classList.remove('show');
        if (submitText) submitText.classList.remove('hide');
    };
}


/* =========================================================
   FORM VALIDATION (old template version)
   ========================================================= */

function validateForm(event) {
    if (!nameInput || !emailInput || !messageInput) return;
    if (!errorDiv || !emailErrorDiv) return;

    event.preventDefault();

    let isValid = true;
    let emailIsValid = true;
    let nameIsValid = true;
    let messageIsValid = true;

    if (nameInput.value.trim() === '') {
        isValid = false;
        nameIsValid = false;
    }

    if (emailInput.value.trim() === '' || !isValidEmail(emailInput.value)) {
        isValid = false;
        if (emailInput.value.trim() !== '' && !isValidEmail(emailInput.value)) {
            emailIsValid = false;
        }
    }

    if (messageInput.value.trim() === '') {
        isValid = false;
        messageIsValid = false;
    }

    if (!isValid) {
        errorDiv.classList.add('error-show');
        emailErrorDiv.classList.remove('error-show');

        if (nameIsValid && messageIsValid && !emailIsValid) {
            errorDiv.classList.remove('error-show');
            emailErrorDiv.classList.add('error-show');
        }
    } else {
        emailErrorDiv.classList.remove('error-show');
        errorDiv.classList.remove('error-show');

        if (contactButton) contactButton.classList.add('loading');
        if (contactLoad) contactLoad.classList.add('show');
        if (submitText) submitText.classList.add('hide');

        setTimeout(sendMail, 2000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

if (contactForm) {
    contactForm.addEventListener('submit', validateForm);
}


/* =========================================================
   EMAILJS — only runs if the library is loaded
   ========================================================= */

function sendMail() {
    // Guard: EmailJS not loaded (e.g. on the new Tailwind contact page)
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded — skipping sendMail()');
        return;
    }

    const nameEl = document.getElementById('name');
    const messageEl = document.getElementById('message');
    const submitButton = document.getElementById('contact-submit');

    const params = {
        to_name: 'Gelila',
        from_name: nameEl ? nameEl.value : '',
        message: messageEl ? messageEl.value : ''
    };

    const serviceID = 'service_d77z25q';
    const templateID = 'template_6ni9z6x';

    if (submitButton) submitButton.disabled = true;

    emailjs.send(serviceID, templateID, params)
        .then(() => {
            if (nameEl) nameEl.value = '';
            if (emailInput) emailInput.value = '';
            if (messageEl) messageEl.value = '';

            if (contactSubmitAfter) contactSubmitAfter.classList.add('show');
            if (formSection) formSection.classList.add('hide');
            if (contactSection) contactSection.classList.add('csa-cs');
            if (contactForm) contactForm.classList.add('csa-cf');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
        })
        .finally(() => {
            if (submitButton) submitButton.disabled = false;
        });
}