const core = require('@actions/core');
const semver = require('semver');
const fs = require('fs');

try {
  const onlyKeepLatestPatch = core.getInput('only_keep_latest_patch');
  let docURL = core.getInput('doc_url');

  docURL = docURL.endsWith('/') ? docURL : docURL + '/'

  let directories = fs.readdirSync('./');
  let versions = directories.filter((item) => {
    let isFolder = fs.statSync(item).isDirectory();
    let isValidSemver = semver.valid(item);
    return isFolder && isValidSemver;
  });

  let orderedVersions = semver.sort(versions);
  let formalReleaseVersions = orderedVersions.filter((item) => !semver.prerelease(item));

  console.log("All versions: ", orderedVersions);
  console.log("Formal release versions: ", formalReleaseVersions);

  let stable = semver.maxSatisfying(formalReleaseVersions, '*');
  console.log("Stable version: ", stable);

  let versionMap = {};
  orderedVersions.forEach((item) => {
    let majorMinor = semver.major(item) + '.' + semver.minor(item);
    if (!versionMap[majorMinor]) {
      versionMap[majorMinor] = [];
    }
    versionMap[majorMinor].push(item);
  });

  console.log("Version map: ", versionMap);

  if (onlyKeepLatestPatch === 'true') {

    let toDelete = [];
    Object.keys(versionMap).forEach((item) => {
      let versions = versionMap[item];
      let latest = versions[versions.length - 1];
      let toDeleteVersions = versions.filter((item) => item !== latest);
      toDelete = toDelete.concat(toDeleteVersions);
    });

    console.log("To delete: ", toDelete);

    toDelete.forEach((item) => {
      fs.rmSync(item, { recursive: true });
      console.log("Deleted: ", item);
    });

    orderedVersions = orderedVersions.filter((item) => !toDelete.includes(item));
  }

  orderedVersions.reverse();

  let versionsJSON = orderedVersions.map((item) => {
    let name = item === stable ? item + " (stable)" : item;
    return {
      name: name,
      version: item,
      url: docURL + item
    };
  });

  versionsJSON = [
    {
      name: "Latest",
      version: "latest",
      url: docURL + "latest"
    }
  ] + versionsJSON;

  let json = JSON.stringify(versionsJSON, null, 2);

  console.log("Versions JSON: ", json);
  fs.writeFileSync('versions.json', json);

} catch (error) {
  core.setFailed(error.message);
}
