

authRouter
- POST - /signUp
- POST - /login
- POST - /logout

profileRouter
- GET  - /profile/view
- PATCH - /profile/edit
- PATCH - /profile/password

connectionRequest
- POST - /connection/send/:status/:userId
- POST - /connection/review/:status/:requestId


userRouter
- GET - /user/feed
- GET - /user/connections
- GET - /user/requests