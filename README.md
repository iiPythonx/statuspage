# iiPythonx/Statuspage

A multi-server status page.  
Simple, fast as hell, efficient on resources, and powered by Cloudflare Workers & Pages.

## Setting up

### Basic setup

- Fork iiPythonx/statuspage to your own profile
- Edit `static/index.html` to remove my branding (or add your own)
- Replace `static/favicon.ico` with the favicon of your choice

### Worker setup

- Edit `fetch_status.js` to match the URLs you want to track
- Install [wrangler]() with `bun i -g wrangler`
- Create a new KV with `wrangler kv namespace create statuspage_data`
    - Replace the ID in `wrangler.toml` with the one wrangler gave you
- Deploy to Cloudflare with `wrangler deploy`

### Pages setup

- Create a new Cloudflare Pages app and link it to your repository
    - Leave the framework box empty (default)
    - Set the build command to `nova build`
    - Set the output folder to `.build`
    - Hit build for the first version of the app
- Go to the app settings
    - Go to the bindings section and add your KV to the page
    - Add an environment variable called `UNSTABLE_PRE_BUILD` with the value `bun i`
- (optional) retry the last deployment to get minification working
- Wait for the start of the next hour for data to flow in

Problems? [Make an issue.](https://github.com/iiPythonx/statuspage/issues/new)

## Internal workings

Most of the hard work for this repository is done via [`fetch_status.js`](https://github.com/iiPythonx/statuspage/blob/main/fetch_status.js), which handles pinging the sites and recording their status. All site data is then thrown together into [Cloudflare KV](https://developers.cloudflare.com/kv/).  

The client (in reality), only fetches this data and loads the status information into the UI. Additionally, it uses [PopperJS](https://popper.js.org/) for the detailed snapshot info when hovering over a timestamp.

## Development

Not sure at the moment.

## Copyright

MIT license, [more details here](https://github.com/iiPythonx/statuspage/blob/main/LICENSE.txt).
