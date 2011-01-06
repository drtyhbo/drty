<head>
	<link rel="stylesheet" type="text/css" href="{{ MEDIA_URL }}css/main.css">
	<title>{% block title %}{% endblock %}</title>
</head>

<body>
{% block body %}{% endblock %}
<div class="footer">
	<a href="{% url "about" %}">about</a>
</div>
</body>