all: style/master.css

style/master.css: style/master.less
	lessc $< > $@
