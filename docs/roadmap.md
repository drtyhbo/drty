Roadmap/Changelist
====================================


By 0.2.0:

* All model fields implemented (goal 1/25):
    * ✓ AutoField
    * ✓ IntegerField
    * ✓ PositiveIntegerField
    * ✓ SmallIntegerField
    * ✓ PositiveSmallIntegerField
    * ✓ FloatField
    * ✓ DecimalField
    * ✓ CharField
    * ✓ EmailField
    * ✓ TextField
    * ✓ BooleanField
    * ✓ NullBooleanField
    * ✓ DateTimeField
    * ✓ DateField
    * ✓ ForeignKey
    * ✓ IPAddressField
    * ✓ SlugField
    * ✓ TimeField
    * ✓ URLField
    * ✓ JSONField
    * FileField
    * FilePathField
    * ImageField
    * ManyToManyField
    * OneToOneField
 
* All model field options implemented (goal 1/25):
    * ✓ null
    * ✓ choices
    * ✓ dbColumn
    * ✓ dbIndex
    * ✓ editable
    * ✓ helpText
    * ✓ unique
    * ✓ verboseName
    * ✓ errorMessages
    * ✓ validators
    * dbTablespace
    * uniqueForDate
    * uniqueForMonth
    * uniqueForYear

* All form fields implemented (goal 1/30):
    * ✓ IntegerField
    * ✓ CharField
    * ✓ TextField
    * ✓ BooleanField
    * ✓ ChoiceField
    * ✓ EmailField
    * ✓ TypedChoiceField
    * ✓ DateField
    * ✓ DateTimeField
    * ✓ DecimalField
    * ✓ FloatField
    * ✓ IPAddressField
    * ✓ MultipleChoiceField
    * ✓ NullBooleanField
    * ✓ RegexField
    * ✓ SlugField
    * ✓ TimeField
    * ✓ URLField
	* ✓ JSONField
    * FileField
    * FilePathField
    * ImageField

* All form field options implemented (goal 1/30):
    * ✓ required
    * ✓ label
    * ✓ initial
    * ✓ widget
    * ✓ helpText
    * ✓ errorMessages
    * ✓ validators
    * localize

* Template syntax be identical to Django
* Unit tests for everything except contrib
* Fixtures
* Custom commands for apps
* drty.contrib.admin