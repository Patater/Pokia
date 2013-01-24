source = init.js bitmaps.js ui.js synthesizer.js
libs = w3c_audio.js

all: pokia-min.js

pokia-min.js: closure-compiler/compiler.jar $(source) $(libs)
	gjslint --strict --nojsdoc $(source)
	java -jar closure-compiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js $(source) $(libs) --js_output_file pokia-min.js

clean:
	rm pokia-min.js
