{% extends "base.tpl" %}

{% block title %}{{ blog.owner.username }}'s Blog{% endblock %}

{% block content %}
{% if request.user %}
<div class="crumbs">
	<a href="{% url "home" %}">Home</a> &rarr; {{ blog.title }}
</div>
{% endif %}
{% ifequal entries.length 0 %}
	<center>
		<h2>No blog entries</h2>
{% ifequal blog.owner.id request.user.id %}
		Post one below!
{% endifequal %}
	</center>
{% else %}
	<div class="entries">
	{% for entry in entries %}
		<div class="entry">
			<div class="title">{{ entry.title }}</div>
			<div class="body">{{ entry.body }}</div>
		</div>
	{% endfor %}
	</div>
{% endifequal %}
{% ifequal blog.owner.id request.user.id %}
	<div class="new_entry">
		<h3>New post</h3>
		<form method="POST">
			<table>
			<tr>
				<col class="label">
				<col class="input">
			</tr>
			{{ createEntryForm.asTable }}
			<tr>
				<td colspan="2" align="right"><input type="submit" value="Post"></td>
			</tr>
			</table>
		</form>
	</div>
{% endifequal %}
{% endblock %}