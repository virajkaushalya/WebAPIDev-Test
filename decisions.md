# Decisions Log

## Purpose
This document records the important decisions made by project promoters, previous administrators, and the current technical team for the taxi vehicle tracking API project. It is intended to preserve context, rationale, and implementation direction for future contributors.

## 1. Project Scope Decisions

### Decision 1: Build a REST API for vehicle tracking
- Decision made by: Project promoters / project stakeholders
- Date: 2026-07-05
- Decision: The system will be implemented as a REST API for tracking taxi company vehicles.
- Rationale: A REST API is suitable for simple integration with web and mobile clients.
- Impact: The project will focus on endpoints for vehicles, pings, and supporting geographic data.

### Decision 2: Start with a prototype-style implementation
- Decision made by: Project promoters / development team
- Date: 2026-07-05
- Decision: The first version will be a prototype using mock or seed data rather than a full production database.
- Rationale: This keeps the project manageable for learning and early demonstration.
- Impact: Data is initially stored in seed data and can be migrated later.

### Decision 3: Use the existing Express.js structure
- Decision made by: Previous administrators / current development team
- Date: 2026-07-05
- Decision: The API will continue using Express.js with router-based organization.
- Rationale: The current project already follows this structure.
- Impact: New routes and controllers should fit into the existing architecture.

## 2. Technical Decisions

### Decision 4: Use versioned API endpoints
- Decision made by: Previous administrators / development team
- Date: 2026-07-05
- Decision: All routes will use the prefix /v1/api/.
- Rationale: Versioning helps avoid breaking changes in future updates.
- Impact: Clients should use versioned URLs.

### Decision 5: Keep province, district, and station resources as lookup data
- Decision made by: Project team
- Date: 2026-07-05
- Decision: Geographic resources will remain supporting data for vehicles and stations.
- Rationale: These resources provide context for station assignment and location management.
- Impact: The API should expose them as read-only or simple CRUD resources.

### Decision 6: Model vehicle movement using ping events
- Decision made by: Project team
- Date: 2026-07-05
- Decision: Vehicle location updates will be represented as ping records.
- Rationale: Pings provide a historical record of movements and make it easier to retrieve latest position data.
- Impact: A vehicle will have many pings, and each ping stores location details.

### Decision 7: Use numeric IDs for resources
- Decision made by: Previous administrators / current team
- Date: 2026-07-05
- Decision: IDs will be simple numeric values.
- Rationale: This matches the existing project conventions and simplifies early development.
- Impact: Routing and data lookup remain straightforward.

## 3. Logic Decisions

### Decision 8: A vehicle’s latest position will be derived from its most recent ping
- Decision made by: Project team
- Date: 2026-07-05
- Decision: The latest known vehicle position will be determined from the newest ping associated with that vehicle.
- Rationale: This avoids storing duplicate current location values unnecessarily.
- Impact: Endpoints like /vehicles/:id/last-position should return the most recent ping data.

### Decision 9: Vehicle detail responses may embed the latest ping
- Decision made by: Project team
- Date: 2026-07-05
- Decision: The vehicle detail endpoint can return the vehicle object together with its latest ping as a nested object.
- Rationale: This makes the response more useful for clients without requiring extra requests.
- Impact: API consumers can retrieve both vehicle metadata and current location in one response.

### Decision 10: Station assignment will be one-to-many
- Decision made by: Project team
- Date: 2026-07-05
- Decision: Each vehicle can be assigned to one station, and one station can have many vehicles.
- Rationale: This provides a simple dispatch and depot organization model.
- Impact: Vehicle records should include station_id.

## 4. Requirements Decisions

### Decision 11: The API must support basic CRUD for vehicles
- Decision made by: Project promoters / development team
- Date: 2026-07-05
- Decision: The API should support creating, reading, updating, and deleting vehicles.
- Rationale: Fleet management requires basic vehicle lifecycle operations.
- Impact: Vehicle endpoints must be implemented for collection and member resources.

### Decision 12: The API must support reading ping history for a vehicle
- Decision made by: Project team
- Date: 2026-07-05
- Decision: The API should allow retrieval of all pings related to a specific vehicle.
- Rationale: Historical tracking is a core requirement for monitoring movement.
- Impact: A nested route such as /vehicles/:id/pings should be available.

### Decision 13: The API must return clear error responses
- Decision made by: Project team
- Date: 2026-07-05
- Decision: The API should return structured error messages for missing resources and invalid input.
- Rationale: Clear error handling improves usability and debugging.
- Impact: Responses should contain meaningful error details rather than generic failures.

### Decision 14: Validation will be added for essential fields
- Decision made by: Project team
- Date: 2026-07-05
- Decision: Fields such as plate number, status, latitude, longitude, and timestamp will be validated.
- Rationale: Invalid data should not be accepted.
- Impact: Request validation should be enforced before persisting or updating data.

## 5. Future Direction Decisions

### Decision 15: The system may later be upgraded to use a real database
- Decision made by: Project team
- Date: 2026-07-05
- Decision: Seed data is acceptable for the current phase, but the project may later move to MongoDB or PostgreSQL.
- Rationale: This supports future scalability and real-world deployment.
- Impact: Data access logic may need to be refactored later.

### Decision 16: Authentication may be introduced later
- Decision made by: Project promoters / future team
- Date: 2026-07-05
- Decision: Authentication and authorization are not required for the first version.
- Rationale: The initial focus is on core tracking functionality.
- Impact: The API remains open for now and can be secured later.

## 6. Notes for Maintainers
- This file should be updated whenever a significant decision is made.
- Each decision should include the reason and business or technical impact.
- If a decision changes later, add a new entry rather than deleting the old one.
