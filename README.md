# Rewards manager with AWS lambda .Net 8

The backend code is in the folder `rewards-backend`, the frontend code is in `client` folder. Each one have its own README.md file.

To run this project locally you will need:
- To have installed 
  - SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
  - .NET Core - [Install .NET Core](https://www.microsoft.com/net/download)
  - Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)
  - nodejs v20.19.5
  - npm v11.6.1
- A MongoDB database named `rewards` with privileges to read and write collections
Need to have docker desktop installed

## environment variables
To run this project you need to set up two environment variables in the [template.yaml](./rewards-backend/template.yaml) file.
Avoid committing them to git.
```yaml
Globals:
  Function:
    Timeout: 10
    MemorySize: 512
    Environment:
      Variables:
        MAX_REWARDS_PAGE_SIZE: 100
        JWT_SECRET: # Put here the JWT secret to be use
        DATABASE_URL: # your mongodb+srv:// database uri

```

For the client side, create a .env file inside of [client](./client/)

```.env
# put here the url of the api of this project
VITE_API_BASE_URL=http://127.0.0.1:3000/
```

## data for the database
create a database named `rewards` 
create a collection named `rewards`
create a collection named `users`

### account setup
You need to setup a user in the database to be able to login and manage the rewards list.

Create a collection `users` and insert a document with the following structure
```json
{
  "_id": {
    "$oid": "68e4511b02632f32779ba0e0"
  },
  "Email": "rewards.admin@homework.com",
  "HashedPassword": "$2a$11$6iXY.7E622gMoF1E80kAOO9qZ0r1hvwByIXojV91ok0sO5Ly/TAky"
}
```
The hashed password is created using the `JWT_SECRET`. The one used to generate the hash above is
```Some JWT Secret TEju99W=Vfd{$`REZA-+;vz01V!SH),Oz1v;HjV2``` (including spaces)

If you want ot deploy this, please use a different JWT Secret and a different password.

You can login with the following credentials:

- email: `rewards.admin@homework.com`
- password: `A very good password!`

> [!NOTE]  
> This project does not have endpoints to manage users, so they need to be created manually.

### demo rewards data
In the directory [/rewards-backend/demo-data/rewards.demo-data.json](/rewards-backend/demo-data/rewards.demo-data.json) there are some rewards that can be imported into your `rewards` collection of the database, to better test the pagination features

## running the project locally

### backend

Open docker desktop.

Open a terminal and run:
```
cd .\rewards-backend\
sam build
sam local start-api
```
> [!WARNING]
> There are moments when after some restarts, a few Docker containers remain up, and this leads to issues while testing your changes to the project. You need to stop them and then delete them before the next `sam build` or `sam local start-api`.
> If you made changes and see they are not being reflected in after building and starting the api, try `sam build --no-cached` and also check the containers and images in docker, you may need to stop or remove them.

> [!NOTE]
> Sometimes when building starting the api it fails, but running it a second time usually fixes it

#### endpoints 
This project has a the following endpoints:

- AuthMeFunction at http://127.0.0.1:3000/auth/me [GET, OPTIONS]
- AuthLogoutFunction at http://127.0.0.1:3000/auth/logout [POST, OPTIONS]
- LoginFunction at http://127.0.0.1:3000/login [POST, OPTIONS]
- RewardCreatorFunction at http://127.0.0.1:3000/reward [POST, OPTIONS]
- RewardUpdaterFunction at http://127.0.0.1:3000/reward [PUT, OPTIONS]
- RewardsReaderFunction at http://127.0.0.1:3000/rewards [GET, OPTIONS]
- RewardDeleterFunction at http://127.0.0.1:3000/reward/{id} [DELETE, OPTIONS]

It also uses an Authorizer that prevents the execution of some functions if the user is not authenticated.

> [!WARNING]
> AWS SAM CLI does not guarantee 100% fidelity between authorizers locally and authorizers deployed on AWS. Any application critical behavior should be validated thoroughly before deploying to production.
> Also, I guess because of this in some scenarios the Authorizer function returns a 504 error instead of a 401 even if the function returned a Forbidden. It is always followed by python errors so I suspect its something related to the tool

### frontend
Run client

```
cd client
npm install
npm run dev
```

