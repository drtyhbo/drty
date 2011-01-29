forms -- drty.forms
====================================

The Form object gives you a super easy way to create and manage HTML forms.

## Creating a form

The first step to creating a new form is to extend `drty.forms.Form`. For example:

    var forms = drty.forms;
    var NewForm = forms.Form.extend({
    	username: new forms.CharField({required: true}),
    	password: new forms.CharField({
    		widget: new forms.widgets.PasswordInput(),
			required: true
    	}),

    	firstName: new forms.CharField(),
    	lastName: new forms.CharField(),
    	age: new forms.IntegerField()
    });

When extending, include all of the fields that you would like in your form. In the above
example, there are 5 fields.

To create a blank instance of your form, you can do the following:

    var form = new NewForm();

`form` is now an instance of NewForm with no initial values set. If you render it,
all fields will be rendered with empty values.

To create an instance of your form with values, pass the values as a hash to
the constructor, as in:

    var form = new NewForm({
    	username: 'user1',
    	password: 'mypassword',
    	firstName: 'james',
    	lastName: 'riley',
    	age: 32
    });

`form` is now an instance of NewForm with values set for all fields. If you render it,
all fields will be rendered with values.

## Rendering

To render a form instance, use the following methods:

`asTable` - Renders the form as a table. The example above would be rendered as:

    <tr><td><label for="username">Username</td><td><input type="text" name="username" id="username" value=""></td></tr>
    <tr><td><label for="password">Password</td><td><input type="password" name="password" id="password" value=""></td></tr>
    <tr><td><label for="firstName">First Name</td><td><input type="text" name="firstName" id="firstName" value=""></td></tr>
    <tr><td><label for="lastName">Last Name</td><td><input type="text" name="lastName" id="lastName" value=""></td></tr>
    <tr><td><label for="age">Age</td><td><input type="text" name="age" id="age" value=""></td></tr>

## Validation

Let's say a user has submitted a form via POST. To load those values into your form, do:

	var form = NewForm(request.POST);

`form` now contains the values the user has entered.

To validate the form, call `form.clean()`. This will return true if everything validated successfully,
or false otherwise. If the validation was unsuccessful, `form.errors` will contain a hash of the error
messages keyed off the field name. For example:

	var form = NewForm({
		password: 'test',
		age: 'abcd
	});

	form.clean();

After this block executes:

 * `form.errors.username` will be set because username is a required field but
is not provided.
 * `form.errors.age` will be set because age is provided but is not an integer. 

To access the cleaned values, access the field name directly:

    form.username

or:

    form['username']

## Fields

The constructor for every field is:

    drty.forms.Field(options)

where `options` is a hash of options. There is a default set of options to choose from,
as well as options specific to each field.

### Default options



### BooleanField

`drty.forms.BooleanField`

*return*: `Boolean`  
*widget*: `drty.forms.widgets.CheckboxInput`

### CharField

`drty.forms.CharField`

*options*:

 * `minLength` - The minimum length allowed by this field. Default: 0.
 * `maxLength` - The maximum length allowed by this field. Default: infinity.

*return*: `String`  
*validation*: `minLengthValidator`, `maxLengthValidator`  
*widget*: `drty.forms.widgets.TextInput`

### ChoiceField

`drty.forms.ChoiceField`

To use the ChoiceField, you must specify a list of items for the user to choose from.
For example:

    fruit: new forms.ChoiceField({
		choices: {
			'apple': 'Apple',
			'pear': 'Pear',
			'peach': 'Peach'
		}
    })

Will render as such:

    <select name="fruit">
	<option value="apple">Apple</option>
	<option value="pear">Pear</option>
	<option value="peach">Peach</option>
    </select>

*options*:

 * `choices` - REQUIRED. A hash of choices that will be rendered as option fields.

*return*: `String`  
*validation*: `inListValidator`  
*widget*: `drty.forms.widgets.Select`

### MultipleChoiceField

`drty.forms.MultipleChoiceField`

The `MultipleChoiceField` takes the same options as `ChoiceField` and renders as 
a select multiple field.

*options*:

 * `choices` - REQUIRED. A hash of choices that will be rendered as option fields.

*return*: `Array`  
*validation*: `inListValidator`  
*widget*: `drty.forms.widgets.SelectMultiple`

### TypedChoiceField

`drty.forms.TypedChoiceField`

The `TypedChoiceField` takes the same options as the `ChoiceField`.

*options*:

 * `choices` - REQUIRED. A hash of choices that will be rendered as option fields.
 * `coerce` - A function that takes the field value as a parameter and returns a coerced
value. Called during `clean()`. Default: `function(value) { return value; }`.
 * `emptyValue` - The value to return if this field is empty. Default: ''.

*return*: `String`  
*validation*: `inListValidator`  
*widget*: `drty.forms.widgets.Select`

### NullBooleanField

`drty.forms.NullBooleanField`

Renders as a select field with three options: Yes, No, or Unknown.

*return*: `Boolean` or `null`  
*validation*: `inListValidator`  
*widget*: `drty.forms.widgets.Select`

### FloatField

`drty.forms.FloatField`

*options*:

 * `minValue` - The minimum value allowed by this field. Default: 0.
 * `maxValue` - The maximum value allowed by this field. Default: infinity.

*return*: `Number`   
*validation*: `minValueValidator`, `maxValueValidator`, `validateFloat`  
*widget*: `drty.forms.widgets.TextInput`

### DecimalField

`drty.forms.DecimalField`

*options*:

 * `minValue` - The minimum value allowed by this field. Default: 0.
 * `maxValue` - The maximum value allowed by this field. Default: infinity.
 * `maxDigits` - The maximum number of digits allowed. Default: infinite.
 * `decimalPlaces` - The maximum number of decimal places allowed. Default: infinite.

*return*: `Number`   
*validation*: `minValueValidator`, `maxValueValidator`, `validateFloat`, `maxDigitsValidator`, `decimalPlacesValidator`   
*widget*: `drty.forms.widgets.TextInput`

### IntegerField

`drty.forms.IntegerField`

*options*:

 * `minValue` - The minimum value allowed by this field. Default: 0.
 * `maxValue` - The maximum value allowed by this field. Default: infinity.

*return*: `Number`   
*validation*: `minValueValidator`, `maxValueValidator`, `validateInteger`   
*widget*: `drty.forms.widgets.TextInput`

### RegexField

`drty.forms.RegexField`

*options*:

 * `regex` - REQUIRED. A regular expression that will be used to validate the field. Can be either a `String`
or a `RegExp`.

*return*: `String`   
*validation*: `regexValidator`   
*widget*: `drty.forms.widgets.TextInput`

### EmailField

`drty.forms.EmailField`

*return*: `String`   
*validation*: `validateEmail`   
*widget*: `drty.forms.widgets.TextInput`

### IPAddressField

`drty.forms.IPAddressField`

*return*: `String`   
*validation*: `validateIpv4Address`   
*widget*: `drty.forms.widgets.TextInput`

### URLField

`drty.forms.URLField`

*return*: `String`   
*validation*: `validateURL`   
*widget*: `drty.forms.widgets.TextInput`

### SlugField

`drty.forms.SlugField`

A slug field can contain letters, numbers, underscores or hyphens.

*return*: `String`   
*validation*: `validateSlug`   
*widget*: `drty.forms.widgets.TextInput`

### DateTimeField

`drty.forms.DateTimeField`

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

*return*: `Date`   
*validation*: Validates against the date/time formats.   
*widget*: `drty.forms.widgets.TextInput`

### DateField

`drty.forms.DateField`

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

 * `inputFormats` - An array of date/time format specifiers used to validate the field. Default: Listed above.
 * `format` - A format specifier used to render the value of the field. Default: `'%Y-%m-%d'`

*return*: `Date`   
*validation*: Validates against the date formats.   
*widget*: `drty.forms.widgets.TextInput`

### TimeField

`drty.forms.TimeField`

The `TimeField` supports the following time formats by default:

    '%H:%M:%S'  // 3:47:00
    '%H:%M'     // 3:47

*options*:

 * `inputFormats` - An array of date/time format specifiers used to validate the field. Default: Listed above.
 * `format` - A format specifier used to render the value of the field. Default: `'%H:%M:%S'`

*return*: `Date`   
*validation*: Validates against the time formats.   
*widget*: `drty.forms.widgets.TextInput`

### TextField

`drty.forms.TextField`

*options*:

 * `minLength` - The minimum length allowed by this field. Default: 0.
 * `maxLength` - The maximum length allowed by this field. Default: infinity.

*return*: `String`  
*validation*: `minLengthValidator`, `maxLengthValidator`  
*widget*: `drty.forms.widgets.Textarea`

### JSONField

`drty.forms.JSONField`

*return*: `Object`  
*validation*: Validates that the field contains proper JSON.  
*widget*: `drty.forms.widgets.Textarea`

### FileField

`drty.forms.FileField`

*return*: `UploadedFile`  
*widget*: `drty.forms.widgets.FileInput`
