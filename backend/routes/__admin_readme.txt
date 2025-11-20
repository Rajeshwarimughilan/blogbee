This folder contains admin routes for the BlogBee backend.

Endpoints exposed under /api/admin:
- GET /users                - list users (admin only)
- PUT /users/:id/role       - update user's role (admin only)
- DELETE /users/:id         - delete user and their posts (admin only)
- GET /posts                - list all posts (admin only)
- DELETE /posts/:id         - delete post (admin only)

Ensure that requests include a valid Bearer token for an admin user.
