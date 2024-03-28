

# table column

- users
    - uuid
    - account
    - name
    - email
    - isEmailVerify
    - password
    - location (city,country)
    - fames
    - status // online, offline, blocked
    - last_time_online
    - 2fa_method // default: null
    - 2fa_code

- user_media
    - uuid
    - path
    - name
- user_interests
    - uuid
    - interest_id

- Block
    - uuid
    - target
    - timestamp

- Report
    - uuid
    - target
    - timestamp

- Interests
    - id
    - name

- likes
    - who
    - whom
    - timestamps
- matches
    - user_1
    - user_2
    - timestamps
- views
    - who
    - whom
    - timestamps
- chat
    - sender
    - receiver
    - content
    - timestamps
