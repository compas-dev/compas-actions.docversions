const core = require('@actions/core');
const semver = require('semver');
const fs = require('fs');

try {
  const currentVersion = core.getInput('current_version');
  const onlyKeepLatestPatch = core.getInput('only_keep_latest_patch');

  console.log("Current version: ", currentVersion);
  console.log("Only keep latest patch: ", onlyKeepLatestPatch);

  let directories = fs.readdirSync('./');
  let versions = directories.filter((item) => {
    let isFolder = fs.statSync(item).isDirectory();
    let isValidSemver = semver.valid(item);
    return isFolder && isValidSemver;
  });

  console.log("Found versions: ", versions);

} catch (error) {
  core.setFailed(error.message);
}
