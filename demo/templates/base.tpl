<head>
	<link rel="stylesheet" type="text/css" href="{{ MEDIA_URL }}css/main.css">
	<title>{% block title %}{% endblock %}</title>
</head>

<body>
	<div class="body">
		{% if request.user %}
			<div class="header">Logged in as {{ request.user.username }}, <a href="{% url "logout" %}">logout</a></div>
		{% endif %}
		<div class="content">
{% block content %}{% endblock %}
		</div>
	</div>
</body>