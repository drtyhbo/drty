<html>

<head>
	<link rel="stylesheet" type="text/css" href="{% url "__adminMedia" "css/admin.css" %}">
</head>

<body>
	<center>
		<form method="POST">
			<table class="login">
				<tr class="title">
					<td colspan="2">Drty Admin</td>
				</tr>
				{% if error %}
				<tr>
					<td colspan="2" align="center" class="error">{{error}}</td>
				</tr>
				{% endif %}
				<tr>
					<td>Username</td><td><input type="text" name="username" value="{{username}}"></td>
				</tr><tr>
					<td>Password</td><td><input type="password" name="password"></td>
				</tr><tr>
					<td colspan="2" align="center"><input type="submit" value="Login"></td>
				</tr>
			</table>
		</form>
	</center>
</body>

</html>