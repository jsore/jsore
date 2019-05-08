/**
 * html/node/app/index.ts
 *
 * main view
 */
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';
import * as templates from './templates.ts';

//const renderPage = async () => {
//    const topElem = document.body.querySelector('.jsore-main');
//    const [view, ...params] = window.location.hash.split('/');
//    switch (view) {
//        case '#welcome':
//            topElem.innerHTML = templates.testBody();
//            break;
//        default:
//            throw Error(`unrecognized view ${view}`);
//    }
//};
//
//(async () => {
//    document.body.innerHTML = templates.main();
//    window.addEventListener('hashchange', renderPage);
//    renderPage().catch(err => window.location.hash = '#welcome');
//})();


// just use hash, don't care that much about SEO and hashes
// saves page state (no page reload on link change)
const renderPage = async () => {
  const topElm = document.body.querySelector('.jsore-main');
  const [view, ...params] = window.location.hash.split('/');
  switch(view) {
    case '#bio':
      topElm.innerHTML = templates.testBody();
      break;
    default:
      throw Error(`unrecognized view ${view}`);
  }
};
(async () => {
  document.body.innerHTML = templates.main();
  window.addEventListener('hashchange', renderPage);
  renderPage().catch(err => window.location.hash = '#bio');
})();



// const renderPage = async () => {
//   const topElm = document.body.querySelector('.jsore-main');
//   //const [view, ...params] = window.location.pathname.split('/');
//   const view = window.location.pathname;
//   //alert(view);
//   console.log(view);
//   //topElm.innerHTML = `<p>${view}</p>`;

//   switch (view) {
//     case '/':
//       topElm.innerHTML = templates.testBody();
//       break;
//     //case '/resume':
//     //  topElm.innerHTML = `<p>you got here</p>`;
//     //  break;
//     default:
//       throw Error(`unrecognized view: ${view}`);
//   }
// };
// (async () => {
//   document.body.innerHTML = templates.main();
//   //renderPage().catch(err => console.log(err));
//   renderPage().catch(err => window.location.pathname = '/');
// })();