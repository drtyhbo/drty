{% extends "base.tpl" %}

{% block title %}Home{% endblock %}

{% block content %}
{% ifequal blogs.length 0 %}
	<center>
		<h2>No blogs</h2>
		Create one below!
	</center>
{% else %}
	{% for blog in blogs %}
		<p><a href="{% url "blog" blog.id %}">{{ blog.title }}</a>
	{% endfor %}
{% endifequal %}
	<div class="new_blog">
		<h3>Create a new blog</h3>
		<form method="POST">
			<table>
			{{ createBlogForm.asTable }}
			<tr>
				<td colspan="2"><input type="submit" value="Create"></td>
			</tr>
			</table>
		</form>
	</div>
{% endblock %}