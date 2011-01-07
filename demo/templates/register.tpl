{% extends "base.tpl" %}

{% block title %}Register{% endblock %}

{% block content %}
<form method="POST">
	<center>
		<h2>drty demo</h2>

		<div class="error">{{ error }}</div>
		<table class="register">
		{{ form.asTable }}
		<tr>
			<td colspan="2" align="center"><input type="submit" value="Register"></td>
		</tr>
		</table>
		Already have an account? <a href="{% url "login" %}">login</a>!

		<div class="footer">
			<a href="{% url "about" %}">about</a>
		</div>
	</center>
</form>
{% endblock %}