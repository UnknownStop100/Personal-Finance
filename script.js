import {createHeader} from '/Header/script.js';
import {createFooter} from '/Footer/script.js';
const body = document.querySelector('body');
const header = createHeader();
const footer = createFooter();
body.prepend(header);
body.appendChild(footer);