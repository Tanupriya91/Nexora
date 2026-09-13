# Nexora Data Model

## Core Entities

- User
- Workspace
- Workspace Membership
- Page
- Block
- Database
- Relation
- File / Asset
- Comment
- Version
- Template
- Permission Grant
- Notification

### User

Represents a person using Nexora.

Fields:

- id
- email
- name
- avatarUrl
- createdAt
- updatedAt

### Workspace

Represents an isolated Nexora workspace.

Fields:

- id
- name
- slug
- createdAt
- updatedAt

### Workspace Membership

Connects a User to a Workspace and defines their role.

Fields:

- id
- userId
- workspaceId
- role
- createdAt
- updatedAt

Roles:

- owner
- admin
- member
- guest

Relationships:

- A User can belong to multiple Workspaces.
- A Workspace can have multiple Users.
- A Membership belongs to exactly one User and one Workspace.
- A Workspace has exactly one owner at creation time.

### Page

Represents a piece of content inside a Workspace.

Fields:
- id
- workspaceId
- parentId
- title
- type
- createdById
- createdAt
- updatedAt

Types:
- document
- database
- database_row

Relationships:
- A Page belongs to exactly one Workspace.
- A Page can have one parent Page.
- A Page can have many child Pages.
- A Page can contain many Blocks.
- A Page can be created by a User.

### Block

Represents an individual piece of content inside a Page.

Fields:
- id
- pageId
- parentId
- type
- content
- position
- createdAt
- updatedAt

Relationships:
- A Block belongs to exactly one Page.
- A Block can have one parent Block.
- A Block can have many child Blocks.
- Blocks are ordered within a Page.



### Database

Represents a structured collection of Pages (rows).

A Database is a specialized Page with database configuration.

Fields:
- id
- pageId
- workspaceId
- name
- schema
- createdAt
- updatedAt

Relationships:
- A Database belongs to exactly one Workspace.
- A Database is associated with one Page.
- A Database contains many Pages acting as rows.
- Database configuration defines the available properties/columns.

### Relation

Represents a connection between two Pages.

Fields:
- id
- workspaceId
- sourcePageId
- targetPageId
- type
- metadata
- createdAt
- updatedAt

Relationships:
- A Relation belongs to exactly one Workspace.
- A Relation connects one source Page to one target Page.
- A Page can have many outgoing Relations.
- A Page can have many incoming Relations.
- Relations can connect Pages across different Studios.

## Relationships

To be designed.

## Decisions

To be documented.