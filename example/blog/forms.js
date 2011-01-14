var drty = require('drty'),
	forms = drty.forms;

exports.LoginForm = forms.Form.extend({
	/* When rendered on the page, the username field gets rendered as an <input>
	   with a 'Username' label. */
	username: new forms.CharField(),
	/* When rendered on the page, the password field gets rendered as an input box
	   with a 'Password' label. Since we specify the PasswordInput as the widget, 
	   the <input> element will have type="password". */
	password: new forms.CharField({
			widget: new forms.widgets.PasswordInput()
		})
});

exports.RegisterForm = forms.Form.extend({
	username: new forms.CharField(),
	/* When rendered on the page, the email field gets rendered as an <input>
	   with a 'Email' label. When validated, drty will mark this field with an
	   error if the user supplied value is not a valid email. */
	email: new forms.EmailField(),
	password: new forms.CharField({
			widget: new forms.widgets.PasswordInput()
		})
});

exports.CreateBlogForm = forms.Form.extend({
	title: new forms.CharField(),
	/* The EmailField gets rendered as an <input> with a type="checkbox".
	   Since we've supplied a label parameter, the field will have a Public? label */
	isPublic: new forms.BooleanField({label: 'Public?'})
});

exports.CreateEntryForm = forms.Form.extend({
	title: new forms.CharField(),
	/* The TextField gets rendered as a <textbox> element. */
	body: new forms.TextField()
});