# Rewards manager with AWS lambda .Net 8

The backend code is in the folder `rewards-backend`, the frontend code is in `client` folder. Each one have its own README.md file.

Need to have docker desktop installed

```
cd .\rewards-backend\
sam build
sam local start-api
```
Warning: There are moments when after some restarts some Docker containers remain up, and this leads to issues while testing your changes to the project. You need to stop them and then delete them before the next `sam build` or `sam local start-api`


Run client
```
cd client
npm i
npm run dev
```

