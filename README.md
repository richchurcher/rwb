# rwb: 'real-world' blog

## A technology demonstration for students

This project is designed to simply and explicitly demonstrate how to approach common developer tasks that might not be covered in a JavaScript web development curriculum (bootcamps, Udemy, etc) but are common requirements in the workplace.

Usually these techniques are assimilated from blog posts, Stack Overflow, etc but it can be tricky to track down well-documented code that isn't out of date to use as examples. Plus, sometimes there's really no substitute for reading code. The following is an attempt to centralise some of this information in an easily-digestible format. Where possible, I've tried to document each new addition to the project both inline and using this README.

There are some caveats. For one thing, there may be no such thing as 'best practice', and I do not pretend that this code represents anything like it. I have tried to be careful and methodical, and I hope that users of the repo will continue to point out errors, omissions, and updates with PRs. There is certainly no guarantee that the code is of a high standard from a security or performance standpoint, although I hope the basics are covered.

What works at a basic level may not necessarily scale. Managing implementation of the subjects covered here in high-traffic sites can be complex (and expensive).

This was not developed using strict TDD, although each step had tests written for it, and sometimes these were written beforehand.

Where possible, effort has been given to responsible use of bandwidth and CPU cycles. Download sizes are checked, and production dependencies minimised if a suitable built-in alternative exists.

Finally, developers are opinionated. Don't agree with the way I've done things? Take it up in the issues! If you make a good case, I'll absolutely accept a PR.

## License

Everything is released under the Apache 2 license. As always, please be cautious when copy/pasting segments of code from here into production. The idea is to demonstrate, not act as a library.

## Scaffolding

This project was bootstrapped with [create-react-app](https://github.com/facebookincubator/create-react-app), and then immediately [ejected](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject). It's an easy way to set up simple clientside basics without giving up flexibility. I've modified a few things:
* `src` directory renamed to `client` (see `config/paths`)
* `public` directory moved to `server/public` (see `config/paths`)

This is a *monorepo*, which means everything is in one. There's probably no right answer to the monorepo vs separate repos question: it depends on your team's preference. You'll probably see both in practice.

## Requirements

Node v10.0 and later.

The server runs in a Docker container and requires the installation of [docker-compose](https://docs.docker.com/compose/) if you don't already have it. Getting used to running virtual servers of various kinds is really good practice, because you'll encounter them all the time in the workplace. Of course, you could always set this up using a system install of postgres, but then you'll need to maintain a specific version on your development PC, and (probably) have postgres running in the background even when you're not using it.

There's a Docker gotcha when you're working with packages that have native code, as most password hashing libraries do (like `bcrypt` and `node-sodium`). It's important to have the container compile its own native code, otherwise you may suffer weird crashes when you go to hash a password. The volumes section of `docker-compose.yml` does this for us:

```yml
volumes:
  - ".:/node"
  - "/node/node_modules"
```

The second line creates a volume just for `node_modules`, which will supercede the one in the current directory. The downside? When you start the container, it needs to build `node_modules` from scratch. By the looks of things, Yarn caches pretty aggressively so the second start is quite quick.

## Install

```bash
yarn install
```

## Launch

### Backend (server)

```bash
# Use docker-compose to start the backend
yarn back
```
If your user isn't in the `docker` group, you'll need to enter a sudo password (no idea what the situation is on Windows). Adding yourself to the `docker` group essentially means becoming root anyway, so I tend not to.

I usually do this in a separate terminal window so I can refer to the running server log as required. It's worth noting that if you have a system-wide postgres installed and listening on port 5432 there'll be a conflict. You can either kill the running process, or use a different port (see `docker-compose.yml` and `server/knexfile.js`). The dockerised backend will watch for changes in `server/index.mjs` and reload itself via nodemon.

The weird-looking `back:inspect` and `back:serve` scripts in `package.json` deserves some explanation. Here they are in all their glory:

```bash
"back:inspect": "kill-port --port 9229 && node --experimental-modules --inspect=0.0.0.0:9229 server/index.mjs",
"back:serve": "nodemon --delay 80ms --exec 'yarn back:inspect'",
```

* Listen for changes to `server/index.mjs` (and all of the files it uses, so the entire backend project).
* Use a brief delay prior to restarting.
* Before running node, kill any process hogging port 9229. This is to prevent debugger hangs, see the [Nodemon FAQ](https://github.com/remy/nodemon/blob/master/faq.md#port-in-use-with---inspect-flag-and-docker) for more details. Note that this port is being killed inside the docker container, not in your host computer.
  * There's also a way to do it with `fuser` and avoid the `kill-port` dependency, but the standard Node Docker image doesn't provide `fuser`.
* Pass node the `--experimental-modules` flag, required at time of writing to use `.mjs` and `import`.
* Enable debugging on the default port (which is exposed to the host in `docker-compose.yml`). It seems the IP (0.0.0.0) is required.

You might also be wondering about this in `docker-compose.yml`:

```yml
  command: [sh, -c, "yarn install && yarn back:migrate && yarn back:seed && yarn back:serve"]
```
This is to get around the fact that you can only issue one command on starting a Docker container, and that data is not normally persisted outside the postgres container so we need to re-migrate and re-seed each time we start it.

### Frontend (client)

```bash
# Start the client via webpack-dev-server
yarn start
```

Note the `proxy` field in `package.json`:

```json
  "proxy": "http://localhost:3001",
```

This setting is respected by `create-react-app` (well, `react-scripts` to be precise) which will proxy API requests to this URL instead of the default 3000 port.


## Debugging

The solution I usually use is to fire up [VS Code](https://code.visualstudio.com/) as a dedicated debugger, and there's a `launch.json` included with this project for the purpose. Although [ndb](https://github.com/GoogleChromeLabs/ndb) exists, at the time of writing it's got [some issues](https://github.com/GoogleChromeLabs/ndb/issues/48) with connecting to Node processes running in Docker containers. VS Code, on the other hand, can just connect to a nominated port (9229) and doesn't much care where the debugger is exposed from.

## Subject areas

The goal here is to demonstrate simple approaches to common developer tasks. To navigate your way around the project, here's a bit of a guide:

### SSL by default

The server enforces HTTPS in production.

### Routing

### Persisting data

Auto-update, snake to camelcase.

### AuthenticatioN (signup and login)

Hashing, JWT, HttpOnly cookie, federated logins. Two-factor auth.

### AuthoriZation (permissions and role management)

### CSS

PostCSS and LESS.

### CSRF

### CSP

### Unit testing

### Integration testing

### E2E testing

### JSON format

Not a strict OpenAPI project (to avoid adding more tooling and dependencies) but you should probably know about:

https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md
https://github.com/OAI/OpenAPI-Specification/tree/master/examples/v3.0

### Linting

### Continuous integration

### Paging and infinite scroll

### Search (and incremental search)

### Advertising

### Analytics

### Logging

### Email

### Input validation/sanitisation

### Editor

### Cookie warnings and other notices
