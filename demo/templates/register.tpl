{% extends "base.tpl" %}

{% block body %}
<form method="POST">
	<center>
	<h2>Register</h2>
	<table cellspacing="5">
	{{ form.toTable }}
	<tr><td colspan="2" align="center">
		<input type="submit" value="Login">
	</td></tr>
	</table>
	Don't have an account? <a href="{% url "register" %}">register</a>!
	</center>
</form>
{% endblock %}