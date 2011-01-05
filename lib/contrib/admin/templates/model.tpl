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
		<a href="{.call urlreverse __adminHome}">Home</a> &rsaquo; {model}
	</div>

	<div class="content">
		<h3>Select {model} to change</h3>
		<div class="items">
		<table cellspacing="0">
		<tr>
			<td class="item_id">Id</td>
			<td class="item_name">Name</td>
		</tr>
		{.repeated section items}
			<tr>
				<td valign="top"><a href="{.call urlreverse __adminChange model id }">{id}</a></td>
				<td valign="top">{@|ellipsize 256}</td>
			</tr>
		{.end}
		</table>
		</div>
	</div>
</body>

</html>