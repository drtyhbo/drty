<html>

<head>
	<link rel="stylesheet" type="text/css" href="{MEDIA_URL}css/admin.css">
</head>

<body>
	<div class="header">
		<span class="title">Drty Administration</span>
		<span class="welcome">Welcome, <b>{user.username}</b>. <a href="{.call urlreverse __adminLogout}">Log out</a></span>
	</div>
	<div class="crumbs">
		<a href="{.call urlreverse __adminHome}">Home</a> &rsaquo; <a href="{.call urlreverse __adminModel tableName}">{tableName}</a> &rsaquo; {.section model}{model}{.or}Add new {tableName}{.end}
	</div>

	<div class="content">
		<h3>Change {tableName}</h3>
		<form method="POST">
		<table class="fields" border="1" cellspacing="0">
			<col class="name"></col>
			<col class="value"></col>
		{html}
			<tr>
				<td class="actions" align="right" valign="middle" colspan="2">
					<input type="submit" value="Save">
				</td>
			</tr>
		</form>
	</div>
</body>

</html>