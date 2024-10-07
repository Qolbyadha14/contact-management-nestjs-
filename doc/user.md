# USER API

## Register

Endpoint: `POST` `/api/users`

Request Body:

```json
{
  "username": "admin",
  "password": "admin",
  "name": "admin"
}
```

Response Body (200 OK):

```json
{
  "data": {
    "username": "admin",
    "name": "admin"
  }
}
```

Response Body (422 Unprocessable Entity):

```json
{
  "errors": "Username already exist"
}
```

## Login

Endpoint: `POST` `/api/users/login`

Request Body:

```json
{
  "username": "admin",
  "password": "admin"
}
```

Response Body (200 OK):

```json
{
  "data": {
    "username": "admin",
    "name": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjI0NjU5NzQ5LCJleHAiOjE2MjQ2NTk3NDl9.0CnXr0K2D9OjN7UWZ2nM6pVwvQ1Z9h9ZcM5Wn7Q7KU"
  }
}
```

Response Body (401 Unauthorized):

```json
{
  "errors": "Invalid username or password"
}
```

## Get

Endpoint: `GET` `/api/users/current`

Headers:

- Authorization: `{token}`

Response Body (200 OK):

```json
{
  "data": {
    "username": "admin",
    "name": "admin"
  }
}
```

Response Body (401 Unauthorized):

```json
{
  "errors": "Unauthorized"
}
```

## Update

Endpoint: `PATCH` `/api/users/current`

Headers:

- Authorization: `{token}`

Request Body:

```json
{
  "password": "admin", // optional if want to update password
  "name": "admin" // optional if want to update name
}
```

Response Body (200 OK):

```json
{
  "data": {
    "username": "admin",
    "name": "admin"
  }
}
```

Response Body (401 Unauthorized):

```json
{
  "errors": "Unauthorized"
}
```

## Logout

Endpoint: `DELETE` `/api/users/current`

Headers:

- Authorization: `{token}`

Response Body (200 OK):

```json
{
  "message": "Logout success"
}
```

Response Body (401 Unauthorized):

```json
{
  "errors": "Unauthorized"
}
```
