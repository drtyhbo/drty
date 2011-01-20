{% extends BASE %}

{% block body %}
	<div class="header">
		<span class="title">Drty Administration</span>
		<span class="welcome">Welcome, <b>{{ request.user.username }}</b>. <a href="{% url "__adminLogout" %}">Log out</a></span>
	</div>
	<div class="crumbs">
		<a href="{% url "__adminHome" %}">Home</a> &rsaquo; {{ modelName }}
	</div>

	<div class="content">
		<h3>Select {{ modelName }} to change</h3>
		<div class="items">
		<table cellspacing="0">
		<tr>
			<td class="item_id">Id</td>
			<td class="item_name">Name</td>
		</tr>
		{% for item in items %}
			<tr>
				<td valign="top"><a href="{% url "__adminChange" modelName,item.id %}">{{ item.id }}</a></td>
				<td valign="top">{{ item.toString }}</td>
			</tr>
		{% endfor %}
		</table>
		</div>
	</div>
{% endblock %}