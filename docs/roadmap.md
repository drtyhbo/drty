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
    * BigIntegerField
    * CommaSeperatedIntegerField
    * FileField
    * FilePathField
    * ImageField
    * IPAddressField
    * SlugField
    * TimeField
    * URLField
    * XMLField
    * JSONField
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
    * dbTablespace
    * errorMessages
    * uniqueForDate
    * uniqueForMonth
    * uniqueForYear
    * validators

* All form fields implemented (goal 1/30):
    * ✓ IntegerField
    * ✓ CharField
    * ✓ TextField
    * ✓ BooleanField
    * ✓ ChoiceField
    * ✓ EmailField
    * TypedChoiceField
    * DateField
    * DateTimeField
    * DecimalField
    * FileField
    * FilePathField
    * FloatField
    * ImageField
    * IPAddressField
    * MultipleChoiceField
    * NullBooleanField
    * RegexField
    * SlugField
    * TimeField
    * URLField
    * ComboField
    * MultiValueField
    * SplitDateTimeField
    * ModelChoiceField
    * ModelMultipleChoiceField

* All form field options implemented (goal 1/30):
    * ✓ required
    * ✓ label
    * ✓ initial
    * ✓ widget
    * ✓ helpText
    * errorMessages
    * validators
    * localize

* Template syntax should be the same as Django
* Everything should have unit tests
* Simplify view code -- come up with a simplified structure
* Implement fixtures
* Implement custom commands for apps
* Finish admin contrib
* Allow for named apps