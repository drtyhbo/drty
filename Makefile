noop:
	echo "Usage: make tests"

tests:
	find lib -name "*.test.js" -exec node {} \;