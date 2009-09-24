#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy of
# the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.

from cgi import escape
from email import message_from_file
from itertools import chain
from optparse import OptionParser
import os
import sys
from popen2 import popen2
import time
import md5

BIN_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__)))

def _markdown(text):
    return _pipe(os.path.join(BIN_DIR, 'smartypants.pl'),
                 _pipe(os.path.join(BIN_DIR, 'markdown.pl'),
                       text))

def _pipe(cmd, text):
    pin, pout = popen2(cmd)
    pout.write(text)
    pout.close()
    try:
        return pin.read()
    finally:
        pin.close()


class Page(object):
    children = []
    parent = None
    meta = {}
    site = None
    filename = None
    html_filename = None
    template = None

    def __init__(self, site, filename, template=None):
        self.site = site
        self.template = template or site.template
        self.meta = {}
        self.children = []
        self.parse(filename)

    def __getitem__(self, key):
        if key in self.mimedoc:
            return self.mimedoc[key]
        try:
            dynkey = '_gen_' + key
            if hasattr(self, dynkey):
                return getattr(self, dynkey)()
        except (KeyError, AttributeError):
            pass
        if self.template:
            return self.template[key]
        return ''

    def __repr__(self):
        return '<%s %r>' % (type(self).__name__, self.url())

    def parse(self, filename):
        self.filename = filename
        self.html_filename = filename[:-4] + '.html'

        fileobj = file(self.filename)
        try:
            self.mimedoc = message_from_file(fileobj)
        finally:
            fileobj.close()

    def add_child(self, page):
        self.children.append(page)
        page.parent = self

    def chain(self):
        chain = []
        c = self
        while c:
            chain.append(c)
            c = c.parent
        return chain

    def url(self):
        if self['location']:
            return self['location']
        fname = self.html_filename[len(self.site.docroot):].lstrip(os.sep)
        if os.sep != "/":
            # slash is always the sep for a URL.
            fname = fname.replace(os.sep, "/")
        return fname

    def relative_url(self, page):
        if page['location']:
            return page['location']
        src_parts = filter(None, self.url().split('/'))[:-1]
        dest_parts = filter(None, page.url().split('/'))
        dest_file = dest_parts.pop()
        idx = 0
        for part in src_parts:
            if idx < len(dest_parts) and part == dest_parts[idx]:
                del dest_parts[idx]
            else:
                dest_parts[idx:idx] = ['..']
                idx += 1
        return '/'.join(dest_parts + [dest_file])

    def render(self):
        print 'Rendering %r' % self
        if self.template is not None:
            data = self.template.mimedoc.get_payload().lstrip() % self
        else:
            data = self['content']
        return data

    def render_to_file(self):
        if self['location']:
            return
        f = file(self.html_filename, 'w')
        try:
            f.write(self.render())
        finally:
            f.close()

    def _gen_base(self):
        return '/'.join(['..' for _ in self.url().split('/')[1:]]) or '.'

    def _gen_content(self):
        return _markdown(self.mimedoc.get_payload().lstrip() % self)

    def _gen_url(self):
        return self.url()

    def _gen_timestamp(self):
        return time.strftime('%c')

    def _gen_navigation(self):
        buf = []
        chain = self.chain()
        top = len(chain) > 1 and chain[0] or self
        def _gen(pages):
            buf.append('<ul>\n')
            for page in pages:
                if page['no-navigation-item']:
                    continue
                title = page['navigation-title'] or page['title']
                classes = page['navigation-class'].split()
                if top == page:
                    classes = filter(None, classes) + ['active']
                buf.append('<li><a class="%s" href="%s"><span>%s</span></a>' % (
                    ' '.join(classes), self.relative_url(page), escape(title)
                ))
                if page != self.site.root and page.children:
                    _gen(page.children)
                buf.append('</li>\n')
            buf.append('</ul>\n')
        _gen([self.site.root] + self.site.root.children)
        return ''.join(buf)

    def _gen_breadcrumbs(self):
        crumbs = self.chain()[:-1] + [self.site.root]
        buf = ['<ul>\n']
        for page in chain(reversed(crumbs[1:]), [self]):
            cls = page == self and ' class="active"' or ''
            title = page['breadcrumb-title'] or page['navigation-title'] or \
                    page['title']
            buf.append('<li%s><a href="%s">%s</a></li>\n' % (
                cls, self.relative_url(page), escape(title)
            ))
            if page != self:
                buf.append('<li>»</li>\n')
        buf.append('</ul>\n')
        return ''.join(buf)

    def _gen_children(self):
        buf = []
        if self.children:
            buf.append('<ul>\n')
            for page in self.children:
                buf.append('<li><a href="%s"><span>%s</span></a>' % (
                    self.relative_url(page), escape(page['title'])
                ))
                buf.append('</li>\n')
            buf.append('</ul>\n')
        return ''.join(buf)


class Site(object):
    docroot = None
    template = None
    root = None

    def __init__(self, docroot, template=None):
        self.docroot = os.path.realpath(docroot)
        self.template = Page(self, template)

        def walk_dir(thedir, rel='/'):
            root, dirs, files = os.walk(thedir).next()
            if 'index.txt' not in files:
                return None
            page = Page(self, os.path.join(root, 'index.txt'))
            for fname in files:
                if fname.startswith('.'):
                    continue
                if fname == 'index.txt' or not fname.endswith('.txt'):
                    continue
                page.add_child(Page(self, os.path.join(root, fname)))
            if dirs:
                for dirname in dirs:
                    if dirname.startswith('.'):
                        continue
                    drel = rel + dirname + '/'
                    child = walk_dir(os.path.join(root, dirname), drel)
                    if child is not None:
                        page.add_child(child)
            c = lambda x,y: cmp(x['sort-index'], y['sort-index'])
            page.children.sort(c)
            return page
        self.root = walk_dir(self.docroot)

    def render(self):
        def _render_page(page):
            page.render_to_file()
            for child in page.children:
                _render_page(child)
        _render_page(self.root)


if __name__ == '__main__':
    parser = OptionParser(usage='%prog [options]')
    parser.add_option('-d', '--docroot', help='document root [%default]',
                      dest='docroot', metavar='DIR')
    parser.add_option('-t', '--template', help='site template [%default]',
                      dest='template', metavar='FILE')
    parser.set_defaults(docroot='htdocs',
                        template=os.path.join('templates', 'page.tmpl'))
    options, args = parser.parse_args()

    site = Site(options.docroot, options.template)
    site.render()
