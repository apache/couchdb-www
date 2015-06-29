all: style/master.css fauxton-visual-guide

style/master.css: style/master.less
	lessc $< > $@

fauxton-visual-guide:
	harp compile _src-fauxton-visual-guide fauxton-visual-guide

clean:
	rm style/master.css
	rm -rf fauxton-visual-guide
