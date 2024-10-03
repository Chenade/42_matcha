# ft_matcha

---
### API routes
	- POST		/sign-up					// create a new user
	- POST		/login						// login
	- GET		/users						// get all users
	- GET		/interests					// get all interests
---
### Autorized routes

	- GET		/users/profile				// get user's own profile
	- PUT		/users/profile				// update user's own profile
	- GET		/users/profile/:usrId		// get user's profile by id
	- POST		/users/image				// upload image
	- DELETE	/users/image?imgId=1		// delete image
	- POST		/users/image/profile		// update user profile photo
	- POST		/users/interests			// add interest to user
	- DELETE	/users/interests			// remove interest from user
	- GET 		/users/views				// get user's own views
	- GET 		/users/likes				// get user's own likes 
	- POST		/users/likes:usrId			// like other user with id
	- DELETE	/users/likes:usrId			// unlike other user with id
	
	