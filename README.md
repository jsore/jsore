# Website on Node.js With NGINX Reverse Proxy, Elasticsearch & Docker

These are my general notes on launching, maintaining and refactoring a website for publishing technical/How-To articles.

Currently undergoing a complete refactoring of the entire structure - starting fresh with a new server to clean up services and packages that aren't being used by the application but are still installed, also with a clearer separation of concerns for the entire project, moving DNS/MX/personal file DB across isolated servers.

<br><br>



--------------------------------------------------------------------------------
### What It Should Accomplish

- [ ] Serve a technical portfolio, resume and wiki articles to interested parties
    - [ ] ...with a good UX and intuitive UI
    - [ ] ...


<br><br>



--------------------------------------------------------------------------------
### Goals & Milestones

- [ ]


<br><br>
<details>

<summary>v1 Notes & Environment</summary>

<br><br>
<hr>



## Development Flow
( & some other things I've come across )

<br>

#### HTTPS in development environments
One of the first things I ran into was getting HTTPS set up correctly in production (running on
a Linode VM) <b>AND</b> in development (locally, on my macbook).

Let's Encrypt got my production environment and domain set up easy-peasy, but my local development
space...not so much.

Problem?

Getting HTTPS recognized on `localhost` because I wanted development and production mirrored as
much as possible, to help mitigate any future issues I might come across deploying my code from
an HTTP based environment to one secured with HTTPS.

Finally, instead of self-signing a cert and forcing my browser to accept it, I found this:<br>
https://github.com/FiloSottile/mkcert

Again, my development environment is on a macOS.

<br>

Install:

`$ brew install mkcert`

<br>

I wanted this working in Firefox too, not just Chrome:

`$ brew install nss`

<br>

Create the psuedo/local CA:
```
$ mkcert -install
> Using the local CA at "/Users/jsorensen/Library/Application Support/mkcert"
> Password: (for sudo)
> The local CA is now installed in the system trust store!
> The local CA is now installed in the Firefox trust store (requires browser restart)!
```

<br>

Sign some certs, optionally adding additional domains or aliases if you have any configured:
```
$ mkcert somedomain.com localhost 127.0.0.1 ::1
> Using the local CA at "/Users/jsorensen/Library/Application Support/mkcert"
>
> Created a new certificate valid for the following names
>  - "somedomain.com"
>  - "localhost"
>  - "127.0.0.1"
>  - "::1"
>
> The certificate is at "./somedomain.com+3.pem" and the key at "./somedomain.com+3-key.pem"
```

<br>

Since I'm using a Node.js architecture, I also had to tell Node where to look for the new CA by
setting a specific Node environment variable...

`$ export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"    # <-- from your project's root`

<br>

...and because I prefer not to tack on a port number at the end of the URL where my Node server can
be reached, it's required that the Node server is started with `sudo` permissions to get around a pesky
`EACCES` error message, where Node isn't able to access port 443

`$ sudo npm start`

<br>

Now, set the path to your newly created certificate and key files when you call `createServer()`
```javascript
// bring in modules
const fs = require('fs');
const https = require('https');
const express = require('express');
// start an express instance
const app = express();
const httpsOptions = {
    // by default, these files are found at your
    // user's root directory ( ~/ )
    key: fs.readFileSync('path/to/the-key.pem'),
    cert: fs.readFileSync('path/to/the-cert.pem'),
};
// tell the server to start listening
https.createServer(httpsOptions, app).listen(443, () => console.log('https ready'));
```

<br>

Kind of dirty, since Chrome still throws a warning that the sight is untrusted, but my goal has
essentially been acheived - get traffic flowing through HTTPS in dev.

<br>

<b>Note:</b><br>
Be <i>abunduntly</i> aware that the key this tool generates needs to be
absolutely secured. At this time, I'm gonna be paranoid and not publicly detail the steps I took.



<br><br>

#### Moving from Apache to Node.js/Express

<br><br>
<hr>

## Site Architecture

- It will not process a lot of data
- Mostly middleware, other services do heavy lifting
- Async nature for handling multiple requests from different sources

```
.-------------------. .--------------------.
|    web browser    | |   mobile browser   |    <-- what needs to be visually pleasing & accessible
'-------------------' '--------------------'
.------------------------------------------.
|             REST API service             |    <-- what needs to be developed
'------------------------------------------'
.-----------------. .----------------------.
|       DB        | |    REST middleware   |    <-- what needs to be secured
|  Postgre SQL    | |       & services     |
'-----------------' '----------------------'
```

<br>

### Prerequisites

<b>Key Node Modules</b>

<i>items with --> * <-- are maybes</i>

Express
> - expose app data
> - manage HTTP requests
> - handle HTTPS security
> - routing API endpoints

Passport *
> - user authentication
> - session management
>     (possible replacement: Axios)

Webpack *
> - production vs development environment management
> - config options handler
>     (possible replacement: PM2)

Mocha
> - unit testing

<br>

<b>Keeping the Node application running after server restarts or SSH session exits</b>

Webpack is handling restarting ( rebuilding ) the app when a file is updated or
an error is thrown. It does not, however, handle a ( SSH ) session ending; if the
session is killed all the child processes stemmed from that session are killed as well.

This can be handled two ways:

1) Running the Node process in the background and manaully handling `STDOUT` and
`STDERR` so that Node won't receive broken pipe errors ( and then crash ) when the
Node server tries to `console.log` or `error` something to the terminal:

    ```
                                      |     pipes new log      |
                                      |---- messages here -----|
    |------ the process to run -----| |        instead         |
    $ node /path/to/project/server.js > stdout.txt 2> stderr.txt &
                                                                  `-- "run in background"
    ```

2) Use PM2: https://github.com/Unitech/pm2

    Benefits: works nicely with Webpack, Express and Morgan!

    Install it globally and it's ready to run out of the box
    ```
    $ npm install pm2 -g
    $ pm2 start server.js
    ```

    You do need to manually set the service to restart across machine across
    reboots and startups though:
    ```
    ( after starting the process )
    $ pm2 startup
    ```

    I decided to hook up to a PM2+ account for online dashboards
    ```
    $ pm2 monitor    # oops, command only available if linked to an account
    > [PM2 I/O] Using non-browser authentication.
    > [PM2 I/O] Do you have a pm2.io account? (y/n) n
    > [PM2 I/O] No problem ! We just need few informations to create your account
    > [PM2 I/O] Please choose an username :
    > [PM2 I/O] Please choose an email :
    > [PM2 I/O] Please choose a password :
    > ( validation email is sent )
    > [PM2 I/O] Waiting for validation ....
    > [PM2 I/O] Successfully validated

    # after validating, link https://app.pm2.io account to machine
    pm2 link <private_api_key> <public_api_key> MACHINE_NAME
    ```

    Review list of running processes
    ```
    $ pm2 ls
    > ┌──────────┬────┬─────────┬──────┬───────...
    > │ App name │ id │ version │ mode │ pid
    > ├──────────┼────┼─────────┼──────┼───────...
    > │ server   │ 0  │ 1.0.0   │ fork │ XXXX
    > └──────────┴────┴─────────┴──────┴───────...
    ```

    Review details of a process
    ```
    $ pm2 show <app name>
    ```

    Review any logs a running Node application has generated
    ```
    $ pm2 logs <app name>
    > ( my app's Webpack logs )
    > ...
    > ( logs generated by Morgan )

    logs are saved in ~/.pm2/logs
    ```


<br>

#### DB Schema

<br><br>
<hr>

## Project Structure

> Organize files around features, not roles

```
.
|-- .git
|   `-- ...
|-- .gitignore
|-- breakroomramen
|   |-- utils               // 2nd leve Postgre access, etc
|   |   `-- ...
|   |-- auth
|   |   `-- ...             // user management
|   |-- index.js
|   |-- common.js
|   `-- templates.js
|-- jsore
|   |-- welcome
|   |   `-- welcome.js
|   |-- resume
|   |   `-- resume.js
|   |-- ramblings
|   |   |-- utils           // 2nd leve Postgre access, etc
|   |   |   `-- ...
|   |   `-- ramblings.js
|   `-- templates.js
|-- config
|   |-- webpack.config.js
|   |-- development.config.js
|   `-- ...
|-- db                      // top-level Postgres management
|   `-- ...
|-- scripts                 // deployment automation (npm scripts)
|   `-- deploy.js
|-- tests                   // unit testing
|   |-- jsore.welcome.js
|   |-- jsore.resume.js
|   |-- jsore.ramblings.js
|   `-- breakroomramen.js
|-- server.js               // main entry
|-- package.json
|-- README.md
```

<br><br>
<hr>

## Key Modules

<i>items with --> * <-- are maybes</i>

#### Express
- expose app data
- manage HTTP requests
- handle HTTPS security
- routing API endpoints

#### Passport *
- user authentication
- session management
    (possible replacement: Axios)

#### Webpack *
- production vs development environment management
- config options handler
    (possible replacement: PM2)

#### Mocha
- unit testing

<br><br>
<hr>

## Reasons why I've decided to...

<br><br>
<hr>

## Things I want to look into

#### Passport authentication
https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/


<br><br>
<hr>

## Snippets

#### Simple async/await

```javascript
const main = async (paramsA, paramsB, paramsC) => {
    const resA = await funcA(paramsA);
    // need to uniquely handle an error?
    const resB = await funcB(paramsB).catch(e => { /* things unique to this error */ });
    const resC = await funcC(paramsC);

    return { resA, resB, resC };
};

main()
    .then(d => { // do things with the result })
    // handle the rest of the catch clauses for each await
    .catch(e => { // handle all other errors!! });
```

<br>

### https.createServer
https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener

https://nodejs.org/api/https.html#https_https_request_options_callback

http: https://nodejs.org/api/http.html#http_http_request_options_callback

<br><br>
<hr>

</details>

