<head>
	<link rel="stylesheet" type="text/css" href="{MEDIA_URL}css/base.css">
</head>

<body>
	<form method="POST">
		<center>
		<h2>Login</h2>
		<table cellpadding="5">
		{{ form.toTable }}
		<tr><td colspan="2" align="center">
			<input type="submit" value="Login">
		</td></tr>
		</table>
		No account? <a href="{.call urlreverse register}">register</a> for free!
		</center>
	</form>
</body>