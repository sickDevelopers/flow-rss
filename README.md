# Flow RSS

### Start the project
S
Start local mongodb

```
$ mongod --dbpath <your local data folder>
```

To start the project, first npm install, then create a file named .env with the following content

```
DATABASE_URL='mongodb://<local db url>:<local db port>'
DATABASE_NAME='test'
SMTP_USER='<your email address>'
SMTP_PSW='<your password>'
SMTP_HOST='<your smtp host>'

GITHUB_AUTH_BACK='github-authback'
DOMAIN='localhost'
PROTOCOL='http'

```

Start the project with

```
npm start
```

this will start foreman with local env parameters red from .env
