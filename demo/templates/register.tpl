<head>
	<link rel="stylesheet" type="text/css" href="{MEDIA_URL}css/base.css">
</head>

<body>
	<form method="POST">
		<center>
		<h2>Register</h2>
		<table cellspacing="5">
		{{ form.toTable }}
		<tr><td colspan="2" align="center">
			<input type="submit" value="Login">
		</td></tr>
		</table>
		Already have an account? <a href="{.call urlreverse login}">login</a>!
		</center>
	</form>
</body>