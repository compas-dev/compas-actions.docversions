
# compas-actions.docversions

## Introduction
`compas-actions.docversions` is a GitHub action designed to update the documentation versions list for COMPAS repositories. It automates the process of maintaining a current list of documentation versions, ensuring users have access to the latest and relevant documentation. This action is designed to be used internally inside the `compas-actions.docs` action. Please refer to the [compas-actions.docs](https://github.com/compas-dev/compas-actions.docs) documentation for more information.

## Usage
To use this action in your workflow, include it in your `.yml` file with the required inputs. 

```yaml
steps:
- uses: your-repo/compas-actions.docversions@v3
  with:
    doc_url: <URL of your documentation site>
    only_keep_latest_patch: 'true' # or 'false' to keep each patch version.
```

This action will update the `versions.json` file repository with the latest versions list. It will also remove older `patch` and `pre-release` versions of each `minor` version if `only_keep_latest_patch` is set to `true`.

## Development
To develop this action, you will need to have `node` and `npm` installed. You can install them by following the instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

<!-- ncc -->

### Install dependencies
```bash
npm install
```


### Build
To build the action you need ncc to compile `index.js`.
```bash
npm install -g @vercel/ncc
```

Then remember to build the action before committing.
```bash
npm run build
```