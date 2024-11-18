# T9-F24-COMP231

.env file sample (message Dimitri or Rothchild for actual for db creds)
We can't put the actual creds here as it's a security issue

```

GMAIL_USERNAME='someEmail@gmail.com'
GMAIL_PASSWORD='appp pass word here'

# Recommended for most uses
DATABASE_URL=postgres://neondb_owner:Gej2hgiu@ep-flat-tooth-a5tapr3z-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:tGej2hgiu@ep@ep-flat-tooth-a5tapr3z.us-east-2.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-flat-tooth-a5tapr3z-pooler.us-east-2.aws.neon.tech
PGHOST_UNPOOLED=ep-flat-tooth-a5tapr3z.us-east-2.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=Ger2eyhF
```


To setup the app, make sure you cd into the server and ```npm install``` and then cd into the client and ```npm install``` also, then from the root dir, in one terminal you can run ```npm run client```, and in the other ```npm run server```, it should look like this:

![image](https://github.com/user-attachments/assets/b7d25367-0696-40c9-a034-d2bf04c24b6c)
