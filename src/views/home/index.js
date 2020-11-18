/**
 * jsore/src/views/home/index.js
 */

// add temp comment 1

const generatePartials = require('../view-template.js');

// content scripts


// const somefunction = (chevronMenuChild) => {
//   do something that resets display:hidden on hover
// }


// const someFunctionThatDoesAnAnimationOnLoad = () => {
//   slap a bandaid over fontawesome load lag
// }


// remove email signature footer from page

const resumeView = (req, res, dom, window, document) => {
  const resumeScript = document.createElement('script');
  resumeScript.innerHTML = `
    document.getElementById("resume-link").addEventListener("click", () => {
      const replaceArticle = document.getElementById("resume-placeholder");
      //console.log('clickity');
      window.open("${process.env.HOST}/assets/justin-sorensen-general-resume.pdf");
      //replaceArticle.innerHTML = '<iframe src="assets/justin-sorensen-general-resume.pdf" style="width:100%;"></iframe>';
    });
  `;
  document.body.appendChild(resumeScript);
  // document.getElementById("resume-link").addEventListener("click", () => {
  //   const replaceArticle = document.getElementById("resume-placeholder");
  //   window.open = "https://jsore.com/assets/justin-sorensen-general-resume.pdf";
  // });
};

const contactScroller = (req, res, dom, window, document) => {
  const scrollerScript = document.createElement('script');
  scrollerScript.innerHTML = `
    document.getElementById("contact-link").addEventListener("click", () => {
      // console.log('new click');
      window.scrollBy(0, 2000);
  });
  `;
  document.body.appendChild(scrollerScript);
};


module.exports = (req, res) => {
  const dir = __dirname;
  const view = generatePartials.buildDom(dir);
  // console.log('notfoundview.exports()');

  // generatePartials.scriptAPI(req, res, view, contentScript);
  generatePartials.scriptAPI(req, res, view, contactScroller, resumeView);
  return view.serialize();
};
