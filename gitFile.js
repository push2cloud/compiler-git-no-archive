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
, target
) => (
  `if [ ! -d ${target}/__tmp/${reference} ];
    then
    mkdir -p ${target}/__tmp;
    cd ${target}/__tmp;
    git clone ${repo} ${reference};
    cd ../..;
  fi;
  cd ${target}/__tmp/${reference} && git checkout ${reference} && mkdir -p ${target}/$( dirname ${file} ) && cp ${file} ${target}/$( dirname ${file} )`
);

const gitFile = _.curry((
  ctx
, cb
) => {
  const command = cmd(ctx.repo, ctx.reference, ctx.file, ctx.target);
  debug('starting command', command);
  exec(command, {silent: false, async:true}, debugCb(debug, cb));
});

module.exports = gitFile;
