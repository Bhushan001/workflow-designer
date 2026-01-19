# Proposed Node Types for Workflow Designer

This document proposes additional node types to expand the workflow designer's capabilities. Nodes are organized by categories similar to n8n and other workflow automation tools.

## Current Node Types (5)

### 1. Triggers (1)
- ✅ TRIGGER - Start workflow manually, on schedule, or via webhook

### 2. Actions (2)
- ✅ HTTP_REQUEST - Make HTTP requests to external APIs
- ✅ DO_NOTHING - No-op node for testing or placeholders

### 3. Logic (1)
- ✅ CONDITION - Branch workflow based on conditions

### 4. Code (1)
- ✅ CODE - Execute custom JavaScript code

---

## Proposed New Node Types (25+)

### 1. Triggers Category (Additional 4)

**Webhook Trigger**
- **Type**: `WEBHOOK_TRIGGER`
- **Icon**: Webhook/Network icon
- **Description**: Trigger workflow via incoming HTTP webhook
- **Config**: Method (GET/POST), Path, Authentication

**Schedule Trigger**
- **Type**: `SCHEDULE_TRIGGER`
- **Icon**: Clock/Calendar icon
- **Description**: Trigger workflow on a cron schedule
- **Config**: Cron expression, Timezone

**Email Trigger**
- **Type**: `EMAIL_TRIGGER`
- **Icon**: Envelope icon
- **Description**: Trigger workflow when email is received
- **Config**: IMAP/POP3 settings, Folder, Filters

**File Watcher Trigger**
- **Type**: `FILE_WATCHER_TRIGGER`
- **Icon**: Folder/Eye icon
- **Description**: Trigger workflow when files are created/modified
- **Config**: Directory path, File pattern, Watch mode

---

### 2. Actions Category (Additional 10)

**HTTP Request (Enhanced)**
- Keep existing but consider enhancements:
  - OAuth authentication
  - Request retry logic
  - Response transformation

**Database Query**
- **Type**: `DATABASE_QUERY`
- **Icon**: Database icon
- **Description**: Execute SQL queries on database
- **Config**: Connection string, Query, Parameters

**Email Send**
- **Type**: `EMAIL_SEND`
- **Icon**: Paper plane icon
- **Description**: Send email via SMTP
- **Config**: To, CC, BCC, Subject, Body, Attachments

**File Operations**
- **Type**: `FILE_OPERATION`
- **Icon**: File/Folder icon
- **Description**: Read, write, copy, move, delete files
- **Config**: Operation type, Source path, Destination path

**Transform Data**
- **Type**: `TRANSFORM`
- **Icon**: Transform/Arrow icon
- **Description**: Transform data using JSONPath or expressions
- **Config**: Transformation rules, Input/output mapping

**Wait/Delay**
- **Type**: `WAIT`
- **Icon**: Hourglass/Clock icon
- **Description**: Pause workflow execution for specified duration
- **Config**: Duration (seconds/minutes), or wait until specific time

**Set Variables**
- **Type**: `SET_VARIABLE`
- **Icon**: Variable/Box icon
- **Description**: Set workflow variables for later use
- **Config**: Variable name, Value, Scope (workflow/session)

**Log**
- **Type**: `LOG`
- **Icon**: Document/Log icon
- **Description**: Log messages for debugging
- **Config**: Log level, Message template

**Notification**
- **Type**: `NOTIFICATION`
- **Icon**: Bell icon
- **Description**: Send push notifications or alerts
- **Config**: Notification type, Message, Recipients

**Webhook Call**
- **Type**: `WEBHOOK_CALL`
- **Icon**: Webhook/Network icon
- **Description**: Call external webhook URL
- **Config**: URL, Method, Headers, Body

---

### 3. Logic Category (Additional 3)

**Switch**
- **Type**: `SWITCH`
- **Icon**: Switch/Branch icon
- **Description**: Multi-branch based on value comparison
- **Config**: Expression, Cases (value → branch)

**Loop/Iterator**
- **Type**: `LOOP`
- **Icon**: Loop/Repeat icon
- **Description**: Loop over array items
- **Config**: Array path, Item variable name

**Merge**
- **Type**: `MERGE`
- **Icon**: Merge/Combine icon
- **Description**: Merge outputs from multiple branches
- **Config**: Merge mode (keep-all, merge-by-key)

---

### 4. Data/Transform Category (New - 5)

**JSON Parse**
- **Type**: `JSON_PARSE`
- **Icon**: JSON/Code icon
- **Description**: Parse JSON string to object
- **Config**: JSON string path, Output path

**JSON Stringify**
- **Type**: `JSON_STRINGIFY`
- **Icon**: JSON/String icon
- **Description**: Convert object to JSON string
- **Config**: Input path, Output path

**Array Operations**
- **Type**: `ARRAY_OPERATION`
- **Icon**: Array/List icon
- **Description**: Filter, map, reduce, sort arrays
- **Config**: Operation type, Expression

**String Operations**
- **Type**: `STRING_OPERATION`
- **Icon**: Text/String icon
- **Description**: Concatenate, split, replace, format strings
- **Config**: Operation type, Patterns

**Data Validation**
- **Type**: `VALIDATE`
- **Icon**: Check/Valid icon
- **Description**: Validate data against schema or rules
- **Config**: Validation rules, Schema

---

### 5. Integrations Category (New - 6)

**API Integration (Generic)**
- **Type**: `API_INTEGRATION`
- **Icon**: Plug/API icon
- **Description**: Call predefined API endpoints
- **Config**: API template, Parameters

**Slack**
- **Type**: `SLACK`
- **Icon**: Slack icon
- **Description**: Send Slack messages or interact with Slack
- **Config**: Webhook URL or OAuth, Channel, Message

**GitHub**
- **Type**: `GITHUB`
- **Icon**: GitHub icon
- **Description**: Interact with GitHub API
- **Config**: Repository, Action (create issue, PR, etc.)

**SFTP/FTP**
- **Type**: `SFTP`
- **Icon**: Server/Upload icon
- **Description**: Upload/download files via SFTP/FTP
- **Config**: Connection details, Operation, File paths

**REST API (Enhanced)**
- Consider enhancing HTTP_REQUEST or adding:
  - Pre-configured endpoints
  - OAuth flows
  - Response caching

**Custom Integration**
- **Type**: `CUSTOM_INTEGRATION`
- **Icon**: Puzzle/Plugin icon
- **Description**: Extensible node for custom integrations
- **Config**: Custom configuration based on integration type

---

### 6. Utilities Category (New - 2)

**Error Handler**
- **Type**: `ERROR_HANDLER`
- **Icon**: Shield/Error icon
- **Description**: Catch and handle errors from previous nodes
- **Config**: Error types, Fallback actions

**Function/Expression**
- **Type**: `FUNCTION`
- **Icon**: Function/Math icon
- **Description**: Execute mathematical or custom functions
- **Config**: Function type, Parameters

---

## Summary

### Current: 5 node types across 4 categories
### Proposed: 30 node types across 6 categories

### Proposed Distribution:
- **Triggers**: 1 → 5 nodes (+4)
- **Actions**: 2 → 12 nodes (+10)
- **Logic**: 1 → 4 nodes (+3)
- **Data/Transform**: 0 → 5 nodes (+5) **[New Category]**
- **Integrations**: 0 → 6 nodes (+6) **[New Category]**
- **Utilities**: 0 → 2 nodes (+2) **[New Category]**

---

## Implementation Priority

### Phase 1 - Essential (Recommended for MVP)
1. ✅ All current nodes (already implemented)
2. **Webhook Trigger** - Critical for API integrations
3. **Schedule Trigger** - Essential for scheduled workflows
4. **Email Send** - Common use case
5. **Wait/Delay** - Useful for workflow orchestration
6. **Switch** - Multi-branch logic
7. **Set Variables** - Variable management

### Phase 2 - Common Use Cases
8. **Database Query** - Data operations
9. **File Operations** - File management
10. **Transform** - Data transformation
11. **Loop** - Iteration support
12. **Log** - Debugging support

### Phase 3 - Advanced Features
13. **Email Trigger** - Email-based workflows
14. **Merge** - Complex flow control
15. **JSON Parse/Stringify** - JSON handling
16. **String/Array Operations** - Data manipulation
17. **Notification** - Alert system
18. **Error Handler** - Error management

### Phase 4 - Integrations
19. **Slack** - Team communication
20. **GitHub** - Development workflows
21. **SFTP/FTP** - File transfer
22. **API Integration** - Generic API calls
23. **Custom Integration** - Extensibility

---

## Node Configuration Examples

Each node type will need:
- **Unique ID** (e.g., `WEBHOOK_TRIGGER`)
- **Icon** (FontAwesome icon)
- **Color class** (for visual distinction)
- **Configuration interface** (form fields)
- **Runner implementation** (backend execution logic)
- **Default configuration** (sensible defaults)

---

## Questions for Confirmation

1. Which categories should we prioritize?
2. Are there specific node types from the list you'd like to exclude?
3. Are there additional node types you'd like to add?
4. Should we implement all at once or in phases?
5. Any specific integrations (beyond Slack/GitHub) you'd like to prioritize?
