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


### File / Asset

Represents a file stored in external object storage.

The database stores metadata and a reference to the actual file.

Fields:
- id
- workspaceId
- uploadedById
- name
- storageKey
- mimeType
- size
- url
- createdAt
- updatedAt

Relationships:
- A File / Asset belongs to exactly one Workspace.
- A File / Asset is uploaded by one User.
- A File / Asset can be referenced by Blocks.
- The actual binary file is stored outside PostgreSQL in object storage.

### Version

Represents a saved snapshot of a Page.

Used for basic version history and restoring previous versions.

Fields:
- id
- pageId
- createdById
- snapshot
- createdAt

Relationships:
- A Version belongs to exactly one Page.
- A Version is created by one User.
- A Page can have many Versions.
- A Version stores a snapshot of the Page content.
- Older Versions can be restored to create the current Page state.

### Comment

Represents a comment made by a User on a Page or Block.

Fields:
- id
- workspaceId
- pageId
- blockId
- authorId
- content
- createdAt
- updatedAt

Relationships:
- A Comment belongs to exactly one Workspace.
- A Comment is created by one User.
- A Comment belongs to a Page.
- A Comment can optionally reference a Block.

### Template

Represents a reusable structure for creating Pages or other content.

Fields:
- id
- workspaceId
- createdById
- name
- description
- content
- createdAt
- updatedAt

Relationships:
- A Template belongs to a Workspace.
- A Template is created by one User.
- A Template can be used to create new Pages.


### Permission Grant

Represents explicit access granted to a User for a Page.

Fields:
- id
- workspaceId
- pageId
- userId
- permission
- createdAt
- updatedAt

Permissions:
- view
- edit

Relationships:
- A Permission Grant belongs to exactly one Workspace.
- A Permission Grant belongs to one Page.
- A Permission Grant belongs to one User.
- A Page can have many Permission Grants.

### Notification

Represents an event that requires the attention of a User.

Fields:
- id
- workspaceId
- userId
- type
- data
- readAt
- createdAt

Relationships:
- A Notification belongs to exactly one Workspace.
- A Notification belongs to one User.
- A Notification can contain additional event data.
- A Notification can be marked as read.

## Relationships

### Identity and Workspace

- A User can belong to many Workspaces through Workspace Membership.
- A Workspace can have many Users through Workspace Membership.
- A Workspace Membership belongs to exactly one User and one Workspace.

### Pages and Blocks

- A Workspace can contain many Pages.
- A Page belongs to exactly one Workspace.
- A Page can have one parent Page.
- A Page can have many child Pages.
- A Page can contain many Blocks.
- A Block belongs to exactly one Page.
- A Block can have one parent Block.
- A Block can have many child Blocks.

### Databases

- A Database belongs to exactly one Workspace.
- A Database is associated with one Page.
- A Database contains many Pages acting as database rows.
- A database row is represented by a Page with type `database_row`.

### Relations

- A Relation belongs to exactly one Workspace.
- A Relation connects one source Page to one target Page.
- A Page can have many outgoing Relations.
- A Page can have many incoming Relations.

### Files

- A File / Asset belongs to exactly one Workspace.
- A File / Asset is uploaded by one User.
- A File / Asset can be referenced by Blocks.

### Versions

- A Page can have many Versions.
- A Version belongs to exactly one Page.
- A Version is created by one User.

### Comments

- A Page can have many Comments.
- A Comment belongs to exactly one Page.
- A Comment can optionally reference one Block.
- A Comment is created by one User.

### Permissions

- A Page can have many Permission Grants.
- A Permission Grant belongs to exactly one Page.
- A Permission Grant belongs to one User.
- A User can have Permission Grants for many Pages.

### Templates

- A Template belongs to one Workspace.
- A Template is created by one User.
- A Template can be used to create new Pages.

### Notifications

- A User can have many Notifications.
- A Notification belongs to one User.
- A Notification belongs to one Workspace.


## Decisions

### Workspace Isolation

Every workspace-owned entity must be associated with a Workspace.

Workspace-level data must always be scoped by workspaceId.

### Page Hierarchy

Pages support hierarchical nesting through parentId.

A Page may have one parent Page and multiple child Pages.

### Block Hierarchy

Blocks support nesting through parentId and ordering through position.

### Database Rows

Database rows are represented as Pages with type `database_row` rather than a separate DatabaseRow entity.

This allows database rows to use the same core Page capabilities as other content.

### Relations

Relations connect Pages rather than directly connecting Studio-specific entities.

This allows cross-Studio relationships and backlinks.

### File Storage

Binary files are stored in external object storage.

PostgreSQL stores file metadata and the storage reference.

### Versioning

Version history uses page snapshots rather than full document diffing.

Advanced diffing is postponed.

### Permissions

Workspace roles provide the basic workspace-level access model.

Page-level Permission Grants provide explicit `view` or `edit` access.

Advanced granular permissions are postponed.

### Extensibility

Flexible content such as block content, database schemas, relation metadata, version snapshots, template content, and notification data can use structured JSON where appropriate.

The exact JSON structures will be defined during schema implementation.