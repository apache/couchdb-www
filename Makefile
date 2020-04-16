all: style/ui.css fauxton-visual-guide

style/ui.css: style/ui.less
	lessc $< > $@

fauxton-visual-guide:
	harp compile _src-fauxton-visual-guide fauxton-visual-guide

clean:
	rm style/ui.css
	rm -rf fauxton-visual-guide
