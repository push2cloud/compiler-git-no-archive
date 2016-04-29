const exec = require('shelljs').exec;
const fs = require('fs');
const debug = require('debug')('push2cloud-compiler-git-no-archive:gitClone');


const debugCb = (debugFn, cb) => {
  return (err, result) => {
    if (err) {
      debugFn('error', err, null);
    } else {
      debugFn('success', result);
    }
    return cb(err, result);
  };
};


const cmd = (
  repo
, target
, reference
) => `git clone ${repo} ${target} && cd ${target} && git checkout ${reference}`;


const gitClone = (
  ctx
, cb
) => {
  try {
    const stats = fs.lstatSync(ctx.target);
    if (stats.isDirectory()) {
      return debugCb(debug, cb)(null);
    }
  } catch (e) {}

  const command = cmd(ctx.repo, ctx.target, ctx.reference);
  debug('starting command', command);
  exec(command, {silent: true, async:true}, debugCb(debug, cb));
};

module.exports = gitClone;
