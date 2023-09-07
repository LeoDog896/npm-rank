# npm-rank

Automated top 10000 npm packages collector using Deno & GitHub actions. Inspired
by
[anvaka's npm rank gist](https://gist.github.com/anvaka/8e8fa57c7ee1350e3491).

Check out the packages (mdBook):
https://leodog896.github.io/npm-rank/PACKAGES.html

The raw data is available in
[releases](https://github.com/LeoDog896/npm-rank/releases) as
[json](https://github.com/LeoDog896/npm-rank/releases/download/latest/raw.json).


> **Note**: In order to not break existing workflows, the file name `raw.json` will stay stable, and will remain as `Package[]`, ordered by popularity.
> For more information, see the [npm registry API docs](https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md).
> (however, the `Package` isn't guaranteed to be stable and is suspect to change by the NPM team as appropiate).
