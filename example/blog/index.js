/* This is the root file for an app. When drty loads this app, it looks for the following exports from apps:

   models - Contains a list of models. Any model in the models dict will be registered with drty. */

exports.models = require('./models');