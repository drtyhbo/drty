var drty = require('drty'),
	models = require('drty').db.models;

/* All models must be exported from this file in order for them to be
   recognized by drty. They must also be extended from models.Model. */

/* Blog model. */
var Blog = exports.Blog = models.Model.extend({
	/* Gets added to the database as blogs */
	tableName: 'blogs',

	/* owner points to a User in the db. Actually, it's stored as
	   owner_id and points to a user id. */
	owner: new models.ForeignKey(drty.contrib.auth.models.User),
	/* Date this blog was created. autoNowAdd tells drty to set
	   createDate to the current time when a new entry is inserted
	   into the db. */
	createDate: new models.DateTimeField({autoNowAdd: true}),
    /* Boolean specifying whether this blog is public. */
	isPublic: new models.BooleanField(),
	/* String specifying the title of the blog. maxLength tells drty
	   to only allocate 128 characters for the title. */
	title: new models.CharField({maxLength: 128})
});

/* Entry model. */
var Entry = exports.Entry = models.Model.extend({
	tableName: 'entries',

	/* Points to the blog that contains this entry. */
	blog: new models.ForeignKey(Blog),
	/* Title of this entry */
	title: new models.CharField({maxLength: 128}),
	/* Body of this entry. TextFields can store much more data than
	   CharFields. */
	body: new models.TextField(),
	/* Date this entry was posted. */
	postDate: new models.DateTimeField({autoNowAdd: true})
});