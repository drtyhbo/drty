{% extends BASE %}

{% block body %}
	<div class="header">
		<span class="title">Drty Administration</span>
		<span class="welcome">Welcome, <b>{{ request.user.username }}</b>. <a href="{.call urlreverse __adminLogout}">Log out</a></span>
	</div>

	<div class="content">
		<h3>Site Administration</h3>
		<div class="models">
		<table cellspacing="0">
		{% for model in models %}
			<tr>
				<td class="model_name">
					<b><a href="{% url "__adminModel" model %}">{{ model }}</a></b>
				</td>
				<td class="model_add"><a href="{% url "__adminAdd" model %}">Add</a></td>
				<td class="model_change"><a href="{% url "__adminModel" model %}">Change</a></td>
			</tr>
		{% endfor %}
		</table>
		</div>
	</div>
{% endblock %}