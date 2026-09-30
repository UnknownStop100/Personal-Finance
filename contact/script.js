import { createHeader } from '/Header/script.js';
import { createFooter } from '/Footer/script.js';

const body = document.querySelector('body');
body.prepend(createHeader());
body.appendChild(createFooter());

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Please fill out every field before sending.';
      return;
    }

    // NOTE: placeholder only — nothing is actually sent anywhere yet.
    // Point this at a real endpoint (a serverless function, Formspree, etc.)
    // when you're ready to receive messages.
    status.textContent = "Thanks! Your message has been noted (form isn't wired to a backend yet).";
    form.reset();
  });
}