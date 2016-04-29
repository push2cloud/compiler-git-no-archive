const _ = require('lodash');
const exec = require('shelljs').exec;
const debug = require('debug')('push2cloud-compiler-git-no-archive:gitFile');

const debugCb = (debugFn, cb) => {
  return (err, result) => {
    if (err) {
      debugFn('error', `Errorcode: ${err}`, result);
    } else {
      debugFn('success', result);
    }
    return cb(err, result);
  };
};


const cmd = (
  repo
, reference
, file
, targetDir
, targetFile
) => (
  `if [ ! -d ${targetDir}/__tmp/${reference} ];
    then
    mkdir -p ${targetDir}/__tmp;
    cd ${targetDir}/__tmp;
    git clone ${repo} ${reference};
    cd ../..;
  fi;
  cd ${targetDir}/__tmp/${reference} && git checkout ${reference} && cp ${file} ${targetFile}`
);

const gitFile = _.curry((
  ctx
, cb
) => {
  ctx.targetFile = ctx.targetFile || ctx.file;
  const command = cmd(ctx.repo, ctx.reference, ctx.file, ctx.targetDir, ctx.targetFile);
  debug('starting command', command);
  exec(command, {silent: false, async:true}, debugCb(debug, cb));
});

module.exports = gitFile;
