// From https://github.com/othiym23/async-listener/blob/master/index.js (BSD 2-Clause)
// Copyright (c) 2013-2017, Forrest L Norvell

import net from 'net';
import semver from 'semver';

const v7plus = semver.gte(process.version, '7.0.0');

function toNumber(x) {
  return (x = Number(x)) >= 0 ? x : false;
}

function isPipeName(s) {
  return typeof s === 'string' && toNumber(s) === false;
}

let normalizeConnectArgs = v7plus ? net._normalizeArgs : net._normalizeConnectArgs;

// From Node.js v7.0.0, net._normalizeConnectArgs have been renamed net._normalizeArgs
if (v7plus && !normalizeConnectArgs) {
  normalizeConnectArgs = (args) => {
    if (args.length === 0) {
      return [{}, null];
    }

    const arg0 = args[0];
    let options = {};
    if (typeof arg0 === 'object' && arg0 !== null) {
      // (options[...][, cb])
      options = arg0;
    } else if (isPipeName(arg0)) {
      // (path[...][, cb])
      options.path = arg0;
    } else {
      // ([port][, host][...][, cb])
      options.port = arg0;
      if (args.length > 1 && typeof args[1] === 'string') {
        options.host = args[1];
      }
    }

    const cb = args[args.length - 1];
    if (typeof cb !== 'function') {
      return [options, null];
    }
    return [options, cb];
  };
} else if (!v7plus && !normalizeConnectArgs) {
  normalizeConnectArgs = (args) => {
    let options = {};
    if (typeof args[0] === 'object' && args[0] !== null) {
      // connect(options, [cb])
      options = args[0];
    } else if (typeof args[0] === 'string' && toNumber(args[0]) === false) {
      // connect(path, [cb]);
      options.path = args[0];
    } else {
      // connect(port, [host], [cb])
      options.port = args[0];
      if (typeof args[1] === 'string') {
        options.host = args[1];
      }
    }

    const cb = args[args.length - 1];
    return typeof cb === 'function' ? [options, cb] : [options];
  };
}

export default normalizeConnectArgs;
