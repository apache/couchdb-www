Apache CouchDB Site
===================

This directory contains the CouchDB website, the source files it is generated
from, and the scripts to regenerate the site.

Dependencies
------------

- LessCSS

Updating the Site
-----------------

Run:

    make

The site should now be updated.

Publishing the Site
-------------------

Then, after reviewing the generated pages, check in the changed files.

Log on to people.apache.org.

Run:

   svn up /www/couchdb.apache.org

This will take up to an hour to become public.