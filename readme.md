## creating routes

post /signup
post /signin
post /signout  

# user can edit pofile
patch /profile/edit
patch /profile/resetpassword
get /profile/view


- post /request/send/like/:id
- post /request/send/pass/:id

# connection
GET user/connections
GET user/request 
GET user/feed  


# user send request and stored in other collection
POST /connection/:status/:toUserId    status ==> pass,like

# user can accept the request
PATCH /connection/:status/documentId    status ==> accepted,rejected 

# user can GET all the request
GET /user/requestlist



