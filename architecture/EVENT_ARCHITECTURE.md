# Event Architecture

**Project:** EMA Bakery Distribution Management System

**Version:** 1.0

**Status:** Enterprise Architecture Standard

---

## 1. Purpose

The Event Architecture defines how independent business domains communicate with each other without becoming tightly coupled.

Events represent facts that have already occurred.

They are immutable records of business activity.

Unlike commands, events never request work to be performed. Instead, they notify interested domains that something has happened.

This architecture enables scalability, extensibility, auditability, and future integration with external systems.

---

## 2. Event-Driven Philosophy

The system follows an **Event-Driven Architecture (EDA)**.

Each domain owns its business logic but communicates through published events.

Benefits include:

* Loose coupling
* Independent domain evolution
* Easier feature expansion
* Simplified testing
* Better auditability
* Real-time processing
* Future microservice readiness

No domain should directly invoke another domain's internal business logic unless explicitly required.

---

## 3. Event Lifecycle

Every event follows the same lifecycle:

```text
Business Action

↓

Business Transaction

↓

Database Commit

↓

Publish Event

↓

Event Bus

↓

Subscribers Execute

↓

Audit Log

↓

Notifications

↓

Completion
```

Events are published **only after** the database transaction has been successfully committed.

---

## 4. Event Structure

Every event must contain the following metadata:

* Event ID (UUID)
* Event Name
* Event Version
* Timestamp (UTC)
* Correlation ID
* User ID
* Source Module
* Entity Type
* Entity ID
* Payload
* Metadata

Example:

```json
{
  "eventId": "uuid",
  "eventName": "DispatchCreated",
  "version": 1,
  "timestamp": "2026-06-29T08:15:00Z",
  "correlationId": "uuid",
  "userId": "uuid",
  "entityType": "dispatch",
  "entityId": "uuid",
  "payload": {},
  "metadata": {}
}
```

---

## 5. Event Naming Standards

Events use the **Past Tense** because they describe completed facts.

Correct examples:

* UserCreated
* UserUpdated
* UserLoggedIn
* DispatchCreated
* DispatchCancelled
* PaymentReceived
* LedgerEntryCreated
* PriceUpdated

Incorrect examples:

* CreateDispatch
* UpdatePrice
* DeleteUser

Those are commands, not events.

---

## 6. Domain Event Catalogue

### Authentication Events

* UserLoggedIn
* UserLoggedOut
* SessionExpired
* PasswordChanged
* PasswordResetRequested
* PasswordResetCompleted

---

### User Administration Events

* UserCreated
* UserUpdated
* UserActivated
* UserDeactivated
* RoleAssigned
* RoleRemoved
* PermissionUpdated

---

### Salesperson Events

* SalespersonCreated
* SalespersonUpdated
* SalespersonActivated
* SalespersonFrozen
* CreditLimitUpdated

---

### Product Events

* ProductCreated
* ProductUpdated
* ProductArchived
* ProductRestored
* ProductCategoryChanged

---

### Pricing Events

* PriceCreated
* PriceUpdated
* PriceActivated
* PriceExpired
* BulkPriceUpdated

---

### Dispatch Events

* DispatchCreated
* DispatchUpdated
* DispatchPosted
* DispatchPrinted
* DispatchCancelled
* DispatchReprinted

---

### Ledger Events

* LedgerEntryCreated
* LedgerEntryReversed
* LedgerRecalculated

---

### Payment Events

* PaymentReceived
* PaymentAllocated
* PaymentReversed
* ReceiptGenerated

---

### Notification Events

* NotificationQueued
* NotificationDelivered
* NotificationFailed

---

### Reporting Events

* ReportGenerated
* ReportExported
* ReportScheduled

---

### Audit Events

* AuditEntryCreated

---

## 7. Event Subscribers

Each event may have one or more subscribers.

Example:

### DispatchCreated

Subscribers:

* Ledger Domain
* Notification Domain
* Reporting Domain
* Audit Domain
* Analytics Domain

---

### PaymentReceived

Subscribers:

* Ledger Domain
* Reporting Domain
* Audit Domain
* Notification Domain

---

### PriceUpdated

Subscribers:

* Dispatch Domain
* Reporting Domain
* Audit Domain

---

### UserLoggedIn

Subscribers:

* Audit Domain
* Monitoring Domain

---

## 8. Event Processing Rules

Every subscriber must:

* Be idempotent.
* Handle duplicate delivery.
* Never assume execution order unless guaranteed.
* Never modify the published event.
* Fail independently.
* Log execution status.

One failing subscriber must never prevent other subscribers from processing the same event.

---

## 9. Retry Strategy

Retryable events include:

* WhatsApp delivery
* Email delivery
* Report generation
* External API integrations

Retries use exponential backoff.

Retry attempts and intervals are configurable.

Failed retries generate a `NotificationFailed` or equivalent failure event.

---

## 10. Event Versioning

Events are immutable.

If an event payload changes incompatibly:

* Increment the event version.
* Preserve previous versions for backward compatibility.
* Consumers must explicitly support the version they process.

Example:

* DispatchCreated v1
* DispatchCreated v2

---

## 11. Event Ordering

Within a single business transaction:

1. Commit database transaction.
2. Publish events.
3. Execute subscribers.

Cross-domain ordering must not be assumed unless explicitly documented.

---

## 12. Error Handling

Subscriber failures are classified as:

* Validation Error
* Business Rule Error
* Infrastructure Error
* External Integration Error
* Unknown Error

Failures are logged with the originating Correlation ID.

Retryable failures are queued.

Non-retryable failures are recorded and surfaced to monitoring.

---

## 13. Observability

Every event publication records:

* Event Name
* Event ID
* Correlation ID
* Publisher
* Subscriber
* Execution Start
* Execution End
* Duration
* Status
* Retry Count

These metrics enable complete tracing of business operations.

---

## 14. Governance

New events require:

* Architecture review
* Documentation update
* Subscriber review
* Version assessment
* Test coverage

Events may never be deleted.

Deprecated events remain documented until all consumers have been migrated.

---

## Conclusion

The Event Architecture enables the EMA Bakery Distribution Management System to remain modular, scalable, and maintainable.

By communicating through immutable business events, domains remain independent while collaborating through a standardized, observable, and auditable event bus.

Every future business capability—whether internal or integrated with external services—must publish and consume events according to the standards defined in this document.
