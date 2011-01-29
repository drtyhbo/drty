forms
====================================

The Form object gives you a super easy way to create and manage HTML forms.

## Creating a form

The first step to creating a new form is to extend `drty.forms.Form`. For example:

    var forms = drty.forms;
    var NewForm = forms.Form.extend({
    	username: new forms.CharField(),
    	password: new forms.CharField({
    		widget: new forms.widgets.PasswordInput()
    	}),

    	firstName: new forms.CharField({required: false}),
    	lastName: new forms.CharField({required: false}),
    	age: new forms.IntegerField({required: false})
    });

In the above example `NewForm` contains 5 fields.

To create a blank instance of `NewForm`, do the following:

    var form = new NewForm();

`form` is now an instance of `NewForm` with no field values. If you were to render it,
all fields would be blank.

To create an instance of `NewForm` with values, pass the values as a hash to
the constructor, as in:

    var form = new NewForm({
    	username: 'user1',
    	password: 'mypassword',
    	firstName: 'james',
    	lastName: 'riley',
    	age: 32
    });

`form` is now an instance of `NewForm` with values set for all fields. If you were to render it,
all fields would have values.

## Rendering

To render a form instance, use the following methods:

`asTable` - Renders the form as a table. `NewForm` would be rendered as:

    <tr><td><label for="username">Username</td><td><input type="text" name="username" id="username" value=""></td></tr>
    <tr><td><label for="password">Password</td><td><input type="password" name="password" id="password" value=""></td></tr>
    <tr><td><label for="firstName">First Name</td><td><input type="text" name="firstName" id="firstName" value=""></td></tr>
    <tr><td><label for="lastName">Last Name</td><td><input type="text" name="lastName" id="lastName" value=""></td></tr>
    <tr><td><label for="age">Age</td><td><input type="text" name="age" id="age" value=""></td></tr>

## Validation

Let's say a user has submitted a form via POST. To load the POST values into your form, do:

	var form = NewForm(request.POST);

`form` now contains the submitted values.

To validate the form, call `form.clean()`. This will return true if everything validated successfully,
or false otherwise. If the validation was unsuccessful, `form.errors` will contain a hash of the error
messages keyed off the field name. For example:

	var form = NewForm({
		password: 'test',
		age: 'abcd
	});

	form.clean();

After the above block executes:

 * `form.errors.username` will be set because username is a required field but
is not provided.
 * `form.errors.age` will be set because age is not an integer. 

To access the cleaned values, you can access the field directly:

    form.username

or:

    form['username']

## Fields

Every field has the same constructor signature:

    drty.forms.Field(options)

where `options` is a hash of field options. There is a default set of options to choose from,
as well as options specific to each field.

### Default options

`required` - Specify whether the field is required. Default: `true`.   

`validators` - A list of validator functions that will be executed when the field is validated.
A validator function should have the following signature:

    function(value) {
    	...
    }

If `value` is invalid, the function should throw a `drty.core.exceptions.ValidationError` exception.
Here's an example validator for floats:

    function validateFloat(value) {
    	if (isNaN(parseFloat(value))) {
    		throw new drty.core.exceptions.ValidationError('A float is expected', 'invalid');
    	}
    }

Default: `[]`

`errorMessages` - A hash of error messages to use instead in place of the default error messages.
For example, to override the error messages for a `CharField`, use the following code:

    new forms.CharField({
    	errorMessages: {
    		required: 'This field is required',
    		minLength: 'Your entry is too short!',
    		maxLength: 'Your entry is too long!'
    	},
    	minLength: 10,
    	maxLength: 100
    });

Default: `{}`

### BooleanField

`drty.forms.BooleanField`

*field value*: `Boolean`  
*widget*: `drty.forms.widgets.CheckboxInput`

### CharField

`drty.forms.CharField(options)`

*options*:

 * `minLength` - The minimum length allowed. Default: 0.
 * `maxLength` - The maximum length allowed. Default: infinity.

*field value*: `String`  
*validation*: `minLengthValidator`, `maxLengthValidator`  
*errors*: `required`, `minLength`, `maxLength`   
*widget*: `drty.forms.widgets.TextInput`

### ChoiceField

`drty.forms.ChoiceField(options)`

To use the `ChoiceField`, you must specify a list of items for the user to choose from.
For example:

    fruit: new forms.ChoiceField({
		choices: {
			'apple': 'Apple',
			'pear': 'Pear',
			'peach': 'Peach'
		}
    })

Will render as:

    <select name="fruit">
	<option value="apple">Apple</option>
	<option value="pear">Pear</option>
	<option value="peach">Peach</option>
    </select>

*options*:

 * `choices` - REQUIRED. A hash of choices for the user to select from.

*field value*: `String`  
*validation*: `inListValidator`  
*errors*: `required`, `invalidChoice`   
*widget*: `drty.forms.widgets.Select`

### MultipleChoiceField

`drty.forms.MultipleChoiceField(options)`

The `MultipleChoiceField` takes the same options as `ChoiceField` and renders as 
a select multiple field.

*options*:

 * `choices` - REQUIRED. A hash of choices for the user to select from.

*field value*: `Array`  
*validation*: `inListValidator`  
*errors*: `required`, `invalidChoice`   
*widget*: `drty.forms.widgets.SelectMultiple`

### TypedChoiceField

`drty.forms.TypedChoiceField(options)`

The `TypedChoiceField` takes the same options as the `ChoiceField`.

*options*:

 * `choices` - REQUIRED. A hash of choices for the user to select from.
 * `coerce` - A function that takes the field value as a parameter and returns a coerced
value. Called during `clean()`. Default: `function(value) { return value; }`.
 * `emptyValue` - The value to return if this field is empty. Default: ''.

*field value*: `String`  
*validation*: `inListValidator`  
*errors*: `required`, `invalidChoice`   
*widget*: `drty.forms.widgets.Select`

### NullBooleanField

`drty.forms.NullBooleanField(options)`

Renders as a select field with three options: Yes, No, and Unknown.

*field value*: `Boolean` or `null`  
*validation*: `inListValidator`  
*errors*: `required`, `invalidChoice`   
*widget*: `drty.forms.widgets.Select`

### FloatField

`drty.forms.FloatField(options)`

*options*:

 * `minValue` - The minimum value allowed. Default: 0.
 * `maxValue` - The maximum value allowed. Default: infinity.

*field value*: `Number`   
*validation*: `minValueValidator`, `maxValueValidator`, `validateFloat`  
*errors*: `required`, `invalid`, `minValue`, `maxValue`   
*widget*: `drty.forms.widgets.TextInput`

### DecimalField

`drty.forms.DecimalField(options)`

*options*:

 * `minValue` - The minimum value allowed. Default: 0.
 * `maxValue` - The maximum value allowed. Default: infinity.
 * `maxDigits` - The maximum number of digits allowed. Default: infinite.
 * `decimalPlaces` - The maximum number of decimal places allowed. Default: infinite.

*field value*: `Number`   
*validation*: `minValueValidator`, `maxValueValidator`, `validateFloat`, `maxDigitsValidator`, `decimalPlacesValidator`   
*errors*: `required`, `invalid`, `minValue`, `maxValue`, `maxDigits`, `maxDecimalPlaces`   
*widget*: `drty.forms.widgets.TextInput`

### IntegerField

`drty.forms.IntegerField(options)`

*options*:

 * `minValue` - The minimum value allowed. Default: 0.
 * `maxValue` - The maximum value allowed. Default: infinity.

*field value*: `Number`   
*validation*: `minValueValidator`, `maxValueValidator`, `validateInteger`   
*errors*: `required`, `invalid`, `minValue`, `maxValue`   
*widget*: `drty.forms.widgets.TextInput`

### RegexField

`drty.forms.RegexField(options)`

*options*:

 * `regex` - REQUIRED. A regular expression that will be used to validate the field. Can be either a `String`
or a `RegExp`.

*field value*: `String`   
*validation*: `regexValidator`   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### EmailField

`drty.forms.EmailField(options)`

*field value*: `String`   
*validation*: `validateEmail`   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### IPAddressField

`drty.forms.IPAddressField(options)`

*field value*: `String`   
*validation*: `validateIpv4Address`   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### URLField

`drty.forms.URLField(options)`

*field value*: `String`   
*validation*: `validateURL`   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### SlugField

`drty.forms.SlugField(options)`

A slug field can contain letters, numbers, underscores or hyphens.

*field value*: `String`   
*validation*: `validateSlug`   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### DateTimeField

`drty.forms.DateTimeField(options)`

The `DateTimeField` supports the following date/time formats by default:

    '%Y-%m-%d %H:%M:%S' // 2011-1-28 3:47:00
    '%Y-%m-%d %H:%M'    // 2011-1-28 3:47
    '%Y-%m-%d'          // 2011-1-28
    '%m/%d/%Y %H:%M:%S' // 1/28/2011 3:47:00
    '%m/%d/%Y %H:%M'    // 1/28/2011 3:47
    '%m/%d/%Y'          // 1/28/2011

*options*:

 * `inputFormats` - An array of date/time format specifiers used to validate the field. Default: Listed above.
 * `format` - A format specifier used to render the value of the field. Default: `'%Y-%m-%d %H:%M:%S'`

*field value*: `Date`   
*validation*: Validates against the date/time formats.   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### DateField

`drty.forms.DateField(options)`

The `DateField` supports the following date formats by default:

    '%Y-%m-%d'  // 2011-1-28
    '%m/%d/%Y'  // 1/28/2011
    '%b %d %Y'  // Jan 28 2011
    '%b %d, %Y' // Jan 28, 2011
    '%d %b %Y'  // 28 Jan 2011
    '%d %b, %Y' // 28 Jan, 2011
    '%B %d %Y'  // January 28 2011
    '%B %d, %Y' // January 28, 2011
    '%d %B %Y'  // 28 January 2011
    '%d %B, %Y' // 28 January, 2011

*options*:

 * `inputFormats` - An array of date format specifiers used to validate the field. Default: Listed above.
 * `format` - A format specifier used to render the value of the field. Default: `'%Y-%m-%d'`

*field value*: `Date`   
*validation*: Validates against the date formats.   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### TimeField

`drty.forms.TimeField(options)`

The `TimeField` supports the following time formats by default:

    '%H:%M:%S'  // 3:47:00
    '%H:%M'     // 3:47

*options*:

 * `inputFormats` - An array of time format specifiers used to validate the field. Default: Listed above.
 * `format` - A format specifier used to render the value of the field. Default: `'%H:%M:%S'`

*field value*: `Date`   
*validation*: Validates against the time formats.   
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.TextInput`

### TextField

`drty.forms.TextField(options)`

*options*:

 * `minLength` - The minimum length allowed. Default: 0.
 * `maxLength` - The maximum length allowed. Default: infinity.

*field value*: `String`  
*validation*: `minLengthValidator`, `maxLengthValidator`  
*errors*: `required`, `minLength`, `maxLength`   
*widget*: `drty.forms.widgets.Textarea`

### JSONField

`drty.forms.JSONField(options)`

*field value*: `Object`  
*validation*: Validates that the field contains proper JSON.  
*errors*: `required`, `invalid`   
*widget*: `drty.forms.widgets.Textarea`

### FileField

`drty.forms.FileField(options)`

*field value*: `UploadedFile`  
*errors*: `required`   
*widget*: `drty.forms.widgets.FileInput`
