noop:
	echo "Usage: make tests"

test:
	find lib -name "test.*.js" -exec nodeunit {} \;
