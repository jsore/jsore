/**
 * html/node/app/templates.ts
 */

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';

import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
<div class="container">
    <div class="jsore-main"></div>
</div>
`);

export const testBody = Handlebars.compile(`
<div class="panel panel-default">
    <div class="panel-heading">A Heading</div>
    <div class="panel-body">
        <p>A Body</p>
    </div>
</div>
`);