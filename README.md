# esa-api

ESA Api Node 

The api is deployed on => heroku

The database used is a firebase

The file storage used is AWS

Packages used :
- **express** : for the node server
- **jsonwebtoken** : for authenticated access to endpoints
- **aws-sdk** : to call aws services for uploading/getting files from s3 bucket
- **multiparty** : used to handle `multipart/form-data` related to file uploads to the server
- **fs**: to interact with the file system
- **Firebase admin and Firestore** : to interact with the firebase database
- **moment JS**: to facilitate date and time formatting
- **dotenv** : to access and use environment variables 
