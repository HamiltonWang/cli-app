'use strict';

const chalk = require('chalk');
const config = require('../config');

const setupNodeCommand = (data, iotajs, refreshAccountData, refreshServerInfo, vorpal) => {
  vorpal
    .command('node <address>', 'connects to a new iota node. (ex. 1.2.3.4)')
    .autocomplete({
      data: () => config.get('nodes', ['localhost:12465'])
    })
    .action((args, callback) => {
      if (!args.address) {
        return;
      }

      const pieces = args.address.replace(/\w+:\/\//, '').split(':');
      const host = `http://${pieces[0]}`;
      let port = 14265;
      if (pieces.length > 1) {
        const trialPort = Number(pieces[1]);
        if (Number.isNaN(trialPort)) {
          vorpal.log(chalk.red('Port must be a number.  (ex. 1.2.3.4:12465)'));
          return callback();
        }
        port = trialPort;
      }

      iotajs.changeNode({host, port});
      if (host !== 'http://localhost') {
        vorpal.log('This may take a few seconds for a remote node.  Did you turn on remote access?');
      }

      data.minWeightMagnitude = 18;
      refreshAccountData();
      refreshServerInfo();
      callback();
    });
};

module.exports = setupNodeCommand;
