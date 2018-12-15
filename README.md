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

# S3 bucket setup
- Create a new bucket.
- Go to the Permissions tab and apply a public bucket policy from [the sample json](website_bucket_policy.json).
- Upload contents of `build/` to the root of the new bucket.
- Go to the Properties tab and enable Static Website Hosting.
- Note the endpoint url on top, save it somewhere.
- For index document type `index.html` and save.
- Create a new CloudFront distribution (Web).
- Under Origin Domain Name type the url from the static hosting, without the `http://`.
- Click Redirect HTTP to HTTPS.
- Click Create Distribution.
- Under the new distribution go to the Error Pages tab.
- Create entries for 403 and 404 codes, both will be the same, Response Page Path is `/index.html` and HTTP Response Code is `200: OK`.
- Go to the General tab and find the Domain Name, this is the url where your app is running.