drty -- A django port for node.js
====================================

## DESCRIPTION

drty is a port of the most excellent [Django](http://www.djangoproject.com) web framework to node.js.

drty currently includes the following:

  * Urls/Routing
  * Middleware
  * Views
  * Basic forms
  * Basic models using MySQL backend
  * Sessions and Auth contrib
  * Django templating support (thanks to Anders Hellerup Madsen and Simon Willisons of djangode!)

It's a work in progress, so there is much yet to be done!

## INSTALLATION

Installation is easy

    $ npm install drty

## EXAMPLE

Included in the source tree is an example/ folder that contains a simple blogging platform written using
drty. To run the example, open up mysql as administrator (root), and type the following:

    create database demo;
    grant all on demo.* to 'demo'@'localhost' identified by 'demo';

Then, go to the examples/ directory and run.

    $ node manage.js syncdb
    $ node manage.js runserver

Now open a browser to http://localhost:8080/login/.