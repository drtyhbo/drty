{% extends "base.tpl" %}

{% block title %}Login{% endblock %}

{% block body %}
<form method="POST">
	<center>
		<table>
		{{ form.asTable }}
		<tr colspan="2">
			<td><input type="submit" value="Login"></td>
		</tr>
		</table>
		No account? <a href="{% url "register" %}">register</a>!
	</center>
</form>
{% endblock %}