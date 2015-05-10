all: style/master.css

style/master.css: style/master.less
	lessc $< > $@

clean:
	rm style/master.css
