<html>

<head>
	<link rel="stylesheet" type="text/css" href="{MEDIA_URL}css/admin.css">
</head>

<body>
	<div class="header">
		<span class="title">Drty Administration</span>
		<span class="welcome">Welcome, <b>{user.username}</b>. <a href="{.call urlreverse __adminLogout}">Log out</a></span>
	</div>

	<div class="content">
		<h3>Site Administration</h3>
		<div class="models">
		<table cellspacing="0">
		{.repeated section models}
			<tr>
				<td class="model_name">
					<b><a href="{.call urlreverse __adminModel id}">{name}</a></b>
				</td>
				<td class="model_add"><a href="{.call urlreverse __adminAdd id}">Add</a></td>
				<td class="model_change"><a href="{.call urlreverse __adminModel id}">Change</a></td>
			</tr>
		{.end}
		</table>
		</div>
	</div>
</body>

</html>