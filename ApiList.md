

authRouter
- POST - /signUp
- POST - /login
- POST - /logout

profileRouter
- GET  - /profile/view
- PATCH - /profile/edit
- PATCH - /profile/password

connectionRequest
- POST - /connection/send/interested/:userId
- POST - /connection/send/ignored/:userId
- POST - /connection/review/accepted/:requestId
- POST - /connection/review/rejected/:requestId

userRouter
- GET - /user/feed
- GET - /user/connections
- GET - /user/requests