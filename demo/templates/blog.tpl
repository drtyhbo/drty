{% extends "base.tpl" %}

{% block title %}{{ blog.owner.username }}'s Blog{% endblock %}

{% block content %}
{% ifequal entries.length 0 %}
	<center>
		<h2>No blog entries</h2>
		Post one below!
	</center>
{% else %}
	{% for entry in entries %}
		{{ entry }}
	{% endfor %}
{% endifequal %}
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
{% endblock %}