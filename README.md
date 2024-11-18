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
