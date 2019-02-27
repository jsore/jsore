/**
 * html/node/app/index.ts
 *
 * main view
 */
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';
import * as templates from './templates.ts';

const renderPage = async () => {
    const topElem = document.body.querySelector('.jsore-main');
    const [view, ...params] = window.location.hash.split('/');
    switch (view) {
        case '#welcome':
            topElem.innerHTML = templates.testBody();
            break;
        default:
            throw Error(`unrecognized view ${view}`);
    }
};

(async () => {
    document.body.innerHTML = templates.main();
    window.addEventListener('hashchange', renderPage);
    renderPage().catch(err => window.location.hash = '#welcome');
})();