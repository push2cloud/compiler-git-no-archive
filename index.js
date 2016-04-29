const _ = require('lodash');
const gitClone = _.curry(require('./gitClone'), 2);
const gitFile = _.curry(require('./gitFile'), 2);
const gitFileAs = _.curry(require('./gitFileAs'), 2);

const gitPlugin = {
  scriptHashes: [],

  getFile(ctx) {
    return gitFile(ctx);
  },

  getFileAs(ctx) {
    return gitFileAs(ctx);
  },

  getSource(app, target) {
    return gitClone(
      { repo: app.source.url
      , reference: app.source.referenceValue
      , target: target
      }
    );
  },

  postAction(source, rootDir, repoHash, deployConfig, tools) {
    if (!source.postClone) return tools.executeScript(null);

    const script = `cd ${rootDir}; ${_.template(source.postClone)({ rootDir: rootDir })}`;

    if (_.includes(gitPlugin.scriptHashes, script.toString())) return (next) => next();

    gitPlugin.scriptHashes.push(script.toString());
    return tools.executeScript(script);
  }
};

module.exports = gitPlugin;
