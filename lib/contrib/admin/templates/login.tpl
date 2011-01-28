{% extends BASE %}

{% block body %}
	<center>
		<form method="POST">
			<table class="login">
				<tr class="title">
					<td colspan="2">Drty Admin</td>
				</tr>
				{% if error %}
				<tr><td colspan="2" align="center">
					<div class="error">{{ error }}</div>
				</td></tr>
				{% endif %}

				{{ form }}
				<tr>
					<td colspan="2" align="center"><input type="submit" value="Login"></td>
				</tr>
			</table>
		</form>
	</center>
{% endblock %}
