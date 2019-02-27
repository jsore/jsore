/**
 * html/node/app/templates.ts
 *
 * main layout
 */

//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap';
import './styles.css';

import * as Handlebars from '../node_modules/handlebars/dist/handlebars.js';

export const main = Handlebars.compile(`
<div class="container">
    <div class="jsore-main"></div>
</div>
`);

export const testBody = Handlebars.compile(`
<div class="parent">
    <div class="bio">
        <div class="bio-name">
            <p class="bio-text">Justin Sorensen</p>
        </div>
        <div class="bio-background">
            <p class="bio-text">Abuse Analyst at IBM Cloud and Full Stack Developer</p>
        </div>
        <div class="construction">
            <p class="construction-text">
                This site is still under construction.
            </p>
            <!-- <p class="github"> -->
                <a href="https://github.com/jsore">Find me on GitHub for now!</a>
            <!-- </p> -->
        </div>
    </div>
</div>

`);