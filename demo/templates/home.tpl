{% extends "base.tpl" %}

{% block title %}Home{% endblock %}

{% block content %}
	<div class="create_blog">
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