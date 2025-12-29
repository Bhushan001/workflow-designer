# Liquibase Database Migrations

This directory contains Liquibase changelog files for database schema management.

## Structure

```
db/changelog/
├── db.changelog-master.xml    # Master changelog file (includes all changes)
└── changes/                    # Individual changelog files
    ├── 001-initial-schema.xml  # Initial database schema
    └── ...                     # Future migration files
```

## Adding New Migrations

1. **Create a new changelog file** in `changes/` directory:
   - Name format: `XXX-description.xml` (e.g., `002-add-user-table.xml`)
   - Use sequential numbering

2. **Add the include statement** to `db.changelog-master.xml`:
   ```xml
   <include file="db/changelog/changes/002-add-user-table.xml"/>
   ```

3. **Write your changeset**:
   ```xml
   <changeSet id="002-add-user-table" author="your-name">
       <createTable tableName="users">
           <!-- table definition -->
       </createTable>
   </changeSet>
   ```

## Best Practices

1. **One changeset per logical change**: Keep changesets focused and atomic
2. **Use meaningful IDs**: Include sequence number and description
3. **Always set author**: Helps track who made the change
4. **Test migrations**: Test on development database before production
5. **Rollback support**: Consider adding rollback instructions for complex changes

## Liquibase Commands

### Check Status
```bash
./mvnw liquibase:status
```

### Generate SQL (preview)
```bash
./mvnw liquibase:updateSQL
```

### Apply Changes
```bash
./mvnw liquibase:update
```

### Rollback
```bash
./mvnw liquibase:rollback -Dliquibase.rollbackCount=1
```

## Current Schema

The initial schema includes:
- `workflows` - Workflow definitions
- `workflow_nodes` - Nodes in workflows
- `workflow_edges` - Connections between nodes
- `workflow_executions` - Execution history
- `workflow_execution_results` - Individual node execution results

