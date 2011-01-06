{% extends "base.tpl" %}

{% block title %}Login{% endblock %}

{% block body %}
<form method="POST">
	<center>
		<h2>drty demo</h2>
		<table cellspacing="3" class="login">
		{{ form.asTable }}
		<tr>
			<td colspan="2" align="center"><input type="submit" value="Login"></td>
		</tr>
		</table>
		No account? <a href="{% url "register" %}">register</a>!

		<div class="footer">
			<a href="{% url "about" %}">about</a>
		</div>
	</center>
</form>
{% endblock %}