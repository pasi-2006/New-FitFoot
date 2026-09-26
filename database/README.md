# FitFoot Database Setup

This project is designed to work with MySQL for local development.

## Use in HeidiSQL or MySQL Workbench

1. Open MySQL Workbench or HeidiSQL.
2. Connect to your local MySQL server.
3. Open a query tab.
4. Run the contents of `fitfoot_schema.sql`.
5. Optionally run `seed.sql` to insert sample products and users.

## Create database manually

```sql
CREATE DATABASE fitfoot_store;
USE fitfoot_store;
```

Then run the SQL file contents.

## Default admin

- Email: admin@fitfoot.com
- Password: admin123

> The seed password is an example hash. If you want to use a real login flow later, replace it with a proper bcrypt or argon2 hash and update your backend auth logic.
