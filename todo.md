# ft_matcha

- Setting
    - [X] env: docker
    - [X] backend: golang
    - [X] frontend: ReactJs

- **User Login**
    - [ ] Registration: email, username, last name, first name, password(somehow protected)
    - [ ] Email Verification: send a unique link to user's email address
    - [ ] Log In: using username + password
    - [ ] Password recovery: send an email to user to reset password
    - [ ] Log Out: one click from any page

- **User Profile**
    - [X] fill out gender, sexual perference, biography
    - [X] modify basic info (name, email)
    - [X] view all the info
    - [X] upload at least one pictures, up to 5
    - [X] delete the image after uploaded
    - [X] Set one of the image as profile photo
    - [X] connection record (been viewed / liked)
    - [Backend] add / delete interestes (hashtags)
    - [ ] request for GPS positioning
    - [ ] modify their GPS position

- **Others' Profile**
    - [ ] display all available, except email and password
    - [ ] display online status (online / last online time)
    - [ ] display if the user liked / view them
    - [ ] like / unlike
    - [ ] must have profile photo to like others
    - [ ] report as a fake account
    - [ ] block the user

**Browsing**
**Search**

- **Chat**
    - [X] websocket
    - [ ] Database (who/whom/message/read)
    - [ ] [Frontend] chatbox
    - [ ] only chat after matched
    - [ ] delete after got unmatched

- **Notification**
    - [X] websocket
    - [ ] Database (who/whom/message/read)
    - [ ] [Frontend] alert
    - [ ] recieves a like
    - [ ] has been viewed
    - [ ] recieves a message 
    - [ ] got matched
    - [ ] got unmatch


---
---
## API routes
### 
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
	- POST		/users/interests			// add interest to user
	- DELETE	/users/interests			// remove interest from user
	- GET 		/users/views				// get user's own views
	- GET 		/users/likes				// get user's own likes 
	
	