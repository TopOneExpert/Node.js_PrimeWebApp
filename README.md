# ProjectPrime
An online exchange

# Configuration
Requires a matching backend API to be deployed in AWS. Each new deployment of the backend will create new API endpoints. These urls must be configured in [`config.js`](app/config.js) prior to building/deployment.

# Development server
- Clone this repo.
- From the root dir run `yarn && yarn start`.
- Open [localhost:3000](http://localhost:3000).

# Deployments
- Run `yarn build`.
- Upload contents of the `build/` dir to the root of your webserver.
