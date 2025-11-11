## AuthRouter

Post /signup
Post /signin
Post /logout

similarly for profile related apis we can create profileRouter

## profileRouter

Get /profile/view
Patch /profile/edit
Patch /profile/password

similarly for connectionRequest related apis we can create connectionRequestRouter

## connectionRequestRouter

Post /request/send/interested/:userId
Post /request/send/ignored/:userId
Post /request/send/accepted/:userId
Post /request/send/rejected/:userId

similarly for user related apis we can create userRouter

## userRouter

Get /user/connections
Get /user/requests/received
Get /user/feed - gets you profiles of the other users on platform
