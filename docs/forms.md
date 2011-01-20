forms -- drty.forms
====================================

The Form object gives you a super easy way to create and manage HTML forms.

To use forms, extend drty.forms.Form with the desired fields as members. For example:

    var forms = drty.forms;
    var NewForm = forms.Form.extend({
    	username: new forms.CharField(),
    	password: new forms.CharField({
    		widget: new forms.widgets.PasswordInput()
    	}),

    	firstName: new forms.CharField({required: false}),
    	lastName: new forms.CharField({required: false}),
    	age: new forms.IntegerField()
    });

To create a blank instance of your form, do:

    var form = new NewForm();

In this instance, form in an unbound instance with no values. If you render it
(form.toString(), form.asTable()), you will be rendering a blank form.

To create an instance of your form, with values, pass the values as a hash to
the constructor, as in:

    var form = new NewForm({
    	username: 'user1',
    	password: 'mypassword',
    	firstName: 'james',
    	lastName: 'riley',
    	age: 32
    });

This sets the dirty values for those fields in the form. Now, when rendering the
form, it will contain the provided values.

To validate a form, call the form.clean() function. If all of the fields validate
successfully, clean() will return true. If there are any validation errors, clean()
will return false, and the validation errors will be placed in the form.errors hash.

To access the cleaned values, use:

    form.username

or:

    form['username']

In this example, if the cleaned value does not exist for username, it will return the dirty
value. If the dirty value does not exist, it will return the initial value for the field.
If the initial value does not exist, it will return an empty string.

Implemented Fields:

* IntegerField
* CharField
* TextField
* BooleanField
* ChoiceField
* EmailField

Implemented Widgets:

* TextInput
* HiddenInput
* PasswordInput
* Textarea
* CheckboxInput
* Select