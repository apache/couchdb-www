CouchDB Web Site
================

This directory contains the CouchDB website, the source files it is generated
from, and the scripts to regenerate the site.

The main site generation script is `bin/build.py`. It reads all the text
files in the `htdocs` directory and builds a hierarchical site structure based
on the directory structure. The content of the text files is processed by
the `bin/Markdown.pl` and `bin/SmartyPants.pl` scripts and then merged with
the markup skeleton defined by `templates/page.tmpl`.

Document Structure
------------------

The text files are basically MIME documents with a number of headers at the
top, and the actual Markdown text as the payload. The headers define meta data
such as the page title, its position in the navigation, and so on. The names
of the headers are not case-sensitive. Header values can be interpolated into
the payload using Python string formatting syntax, for example `%(title)s`.

Regenerating the Site
---------------------

To regenerate all the HTML files, change into the site directory and run:

    ./bin/build.py

Then, after reviewing the generated pages, check in the results. To update the
online version of the site, you need to ssh into people.apache.org and svn up /www/incubator.apache.org/couchdb
