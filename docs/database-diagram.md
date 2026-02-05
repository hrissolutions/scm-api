# Database Schema Diagram (SCM API)

This Mermaid diagram represents the **current** database schema for the `scm-api` service.

```mermaid
erDiagram
    %% Categories and Items
    Category ||--o{ Category : "parent-child"
    Category ||--o{ Item : "contains"
    Category {
        ObjectId id PK
        ObjectId organizationId
        String name
        String slug
        String description
        ObjectId parentId FK
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Supplier ||--o{ Item : "supplies"
    Supplier {
        ObjectId id PK
        ObjectId organizationId
        String name
        String code
        String description
        String contactName
        String email
        String phone
        String website
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Item {
        ObjectId id PK
        ObjectId organizationId
        String sku
        String name
        String description
        ObjectId categoryId FK
        ObjectId supplierId FK
        ItemType itemType
        Float retailPrice
        Float sellingPrice
        Float costPrice
        Int stockQuantity
        Int lowStockThreshold
        String imageUrl
        Json images
        Json specifications
        Boolean isActive
        Boolean isFeatured
        Boolean isAvailable
        ItemStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    %% Templates and Notifications
    Template {
        ObjectId id PK
        ObjectId organizationId
        String name
        String subject
        String content
        String type
        Boolean isDeleted
        DateTime createdAt
        DateTime updatedAt
    }

    Notification {
        ObjectId id PK
        ObjectId organizationId
        ObjectId source
        String category
        String title
        String description
        Json recipients
        Json metadata
        Boolean isDeleted
        DateTime createdAt
        DateTime updatedAt
    }

    %% People and audit logs (userId references external identity)
    Person {
        ObjectId id PK
        ObjectId organizationId
        Json personalInfo
        Json contactInfo
        Json identification
        Json metadata
        DateTime createdAt
        DateTime updatedAt
        Boolean isDeleted
    }

    AuditLogging {
        ObjectId id PK
        ObjectId organizationId
        ObjectId userId
        String type
        String severity
        Json entity
        Json changes
        Json metadata
        String description
        Boolean archiveStatus
        DateTime archiveDate
        Boolean isDeleted
        DateTime timestamp
        DateTime createdAt
        DateTime updatedAt
    }
```

---

## Key Relationships Summary

### Product Catalog

- **Category** → **Category** (Self-referential): hierarchical category structure
- **Category** → **Item** (One-to-Many): categories contain items
- **Supplier** → **Item** (One-to-Many): suppliers supply items
