{% extends "base.tpl" %}

{% block title %}Register{% endblock %}

{% block body %}
<form method="POST">
	<center>
		<table>
		{{ form.asTable }}
		<tr colspan="2">
			<td><input type="submit" value="Login"></td>
		</tr>
		</table>
		Already have an account? <a href="{% url "login" %}">login</a>!
	</center>
</form>
{% endblock %}