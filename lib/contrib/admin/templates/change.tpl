{% extends BASE %}

{% block head %}
<script type="text/javascript">
	function onDelete() {
		if (confirm("Are you sure you want to delete {{ model }}?")) {
			return true;
		}
		return false;
	}
</script>
{% endblock %}

{% block body %}
	<div class="header">
		<span class="title">Drty Administration</span>
		<span class="welcome">Welcome, <b>{{ request.user.username }}</b>. <a href="{% url "__adminLogout" %}">Log out</a></span>
	</div>
	<div class="crumbs">
		<a href="{% url "__adminHome" %}">Home</a> &rsaquo; <a href="{% url "__adminModel" modelName %}">{{ modelName }}</a> &rsaquo; {% if model %}{{ model }}{% else %}New {{ modelName }}{% endif %}
	</div>

	<div class="content">
		<h3>Change {{ modelName }}</h3>
		<form method="POST" enctype="multipart/form-data">
		<table class="fields" border="1" cellspacing="0">
			<col class="name"></col>
			<col class="value"></col>
			{{ form }}
			<tr>
				<td class="actions" align="right" valign="middle" colspan="2">
					{% if model %}
					<input type="submit" value="Delete" name="submit" class="delete" onclick="return onDelete();">
					{% endif %}
					<input type="submit" name="submit" value="Save">
				</td>
			</tr>
		</form>
	</div>
	
	<script type="text/javascript">
		document.getElementsByTagName('input')[0].focus();
	</script>
{% endblock body %}