import { createHeader } from '/Header/script.js';
import { createFooter } from '/Footer/script.js';
 
const body = document.querySelector('body');
body.prepend(createHeader());
body.appendChild(createFooter());