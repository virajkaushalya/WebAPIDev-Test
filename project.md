# Taxi Vehicle Tracking REST API Plan

## 1. Purpose

This project will implement a REST API for a taxi company to track its vehicles, monitor their latest location, and review historical movement events. The API should be simple enough for a learning project, but structured in a way that can grow into a production-ready service later.

The current workspace already includes a basic Express application with routes for provinces, districts, stations, vehicles, and pings. This plan extends that structure and defines a clear data model, route design, and JSON representations for the taxi tracking business case.

## 2. Business Context

A taxi company needs to:

- register and manage fleet vehicles,
- know the current status of each vehicle,
- receive periodic location updates from vehicles,
- view the latest known position of each vehicle,
- inspect the movement history of a vehicle,
- associate vehicles with stations or dispatch locations.

## 3. Assumptions

The following assumptions are made to keep the first version practical and aligned with the current project:

1. This is a prototype or learning-focused API, not a full production system.
2. Data will initially be stored in memory using the existing seed.json pattern rather than a database.
3. No authentication or authorization is included in the first version.
4. The API will follow the existing versioned prefix style: /v1/api/.
5. The current province/district/station resources will be reused as geographic lookup data.
6. A vehicle can be assigned to one station (such as a depot or dispatch location).
7. Location updates are represented as ping events that record the vehicle’s position at a point in time.
8. IDs will be numeric and simple for now.

If you want a different direction later, such as adding drivers, bookings, trips, or real-time socket updates, the structure can be extended without major redesign.

## 4. Proposed Domain Model

### 4.1 Core Resources

#### Vehicle
A vehicle is the main business entity.

Suggested fields:

- id: integer
- plate_number: string
- vehicle_number: string
- make: string
- model: string
- year: integer
- capacity: integer
- status: string
- station_id: integer
- driver_name: string
- current_latitude: number
- current_longitude: number
- last_ping_at: string (ISO 8601 timestamp)
- created_at: string
- updated_at: string

Suggested status values:

- available
- in_service
- maintenance
- offline
- out_of_service

#### Ping
A ping represents a single GPS/location update sent by a vehicle.

Suggested fields:

- id: integer
- vehicle_id: integer
- latitude: number
- longitude: number
- speed_kmh: number
- heading_deg: number
- battery_percent: number
- source: string
- recorded_at: string (ISO 8601 timestamp)

Suggested source values:

- gps
- mobile_app
- manual
- device

#### Station
A station is a dispatch or depot location that can be used to group vehicles.

Suggested fields:

- id: integer
- name: string
- district_id: integer

This resource already exists in the current project and should be retained as a lookup resource.

#### District
A district is part of the station’s geographic context.

Suggested fields:

- id: integer
- name: string
- province_id: integer

#### Province
A province is the top-level geographic lookup resource.

Suggested fields:

- id: integer
- name: string

## 5. Relationships

The proposed relationships are:

- A province has many districts.
- A district has many stations.
- A station has many vehicles.
- A vehicle has many pings.

This creates a clear hierarchy for location-aware tracking.

## 6. RESTful Route Design

The API will follow REST conventions and keep the existing route structure.

### 6.1 Vehicle Routes

Base path: /v1/api/vehicles

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /v1/api/vehicles | List all vehicles |
| GET | /v1/api/vehicles/:vehicleId | Get one vehicle by ID |
| POST | /v1/api/vehicles | Create a new vehicle |
| PUT | /v1/api/vehicles/:vehicleId | Replace a vehicle |
| PATCH | /v1/api/vehicles/:vehicleId | Update partial vehicle fields |
| DELETE | /v1/api/vehicles/:vehicleId | Remove a vehicle |
| GET | /v1/api/vehicles/:vehicleId/pings | Get all pings for a vehicle |
| GET | /v1/api/vehicles/:vehicleId/last-position | Get the latest known position |

### 6.2 Ping Routes

Base path: /v1/api/pings

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /v1/api/pings | List all pings |
| GET | /v1/api/pings/:pingId | Get a single ping |
| POST | /v1/api/pings | Create a new ping event |
| GET | /v1/api/pings?vehicleId=1 | Filter pings by vehicle |

### 6.3 Station Routes

Base path: /v1/api/stations

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /v1/api/stations | List stations |
| GET | /v1/api/stations/:stationId | Get one station |
| GET | /v1/api/stations/:stationId/vehicles | List vehicles assigned to a station |

### 6.4 Existing Lookup Routes

These routes can remain as-is and continue to support geographic lookup data:

- /v1/api/provinces
- /v1/api/districts
- /v1/api/stations

## 7. JSON Representations

### 7.1 Vehicle Representation

Example response for a single vehicle:

```json
{
  "id": 101,
  "plate_number": "ABC-1234",
  "vehicle_number": "TX-001",
  "make": "Toyota",
  "model": "Prius",
  "year": 2022,
  "capacity": 4,
  "status": "in_service",
  "station_id": 1,
  "driver_name": "Saman Perera",
  "current_latitude": 6.9271,
  "current_longitude": 79.8612,
  "last_ping_at": "2026-07-05T10:30:00Z",
  "created_at": "2026-07-01T08:00:00Z",
  "updated_at": "2026-07-05T10:30:00Z"
}
```

### 7.2 Vehicle With Embedded Last Ping

For a convenient detail response, the vehicle detail endpoint can embed the latest ping:

```json
{
  "id": 101,
  "plate_number": "ABC-1234",
  "vehicle_number": "TX-001",
  "make": "Toyota",
  "model": "Prius",
  "status": "in_service",
  "station_id": 1,
  "current_latitude": 6.9271,
  "current_longitude": 79.8612,
  "last_ping_at": "2026-07-05T10:30:00Z",
  "last_ping": {
    "id": 5001,
    "vehicle_id": 101,
    "latitude": 6.9271,
    "longitude": 79.8612,
    "speed_kmh": 42,
    "heading_deg": 125,
    "recorded_at": "2026-07-05T10:30:00Z"
  }
}
```

### 7.3 Ping Representation

```json
{
  "id": 5001,
  "vehicle_id": 101,
  "latitude": 6.9271,
  "longitude": 79.8612,
  "speed_kmh": 42,
  "heading_deg": 125,
  "battery_percent": 80,
  "source": "gps",
  "recorded_at": "2026-07-05T10:30:00Z"
}
```

### 7.4 Error Representation

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Vehicle not found"
  }
}
```

## 8. Validation Rules

The API should validate incoming data before saving or updating:

- plate_number must be present and unique.
- vehicle_number must be present and unique.
- status must be one of the allowed values.
- latitude must be between -90 and 90.
- longitude must be between -180 and 180.
- station_id must reference an existing station.
- recorded_at must be a valid ISO 8601 date-time string.
- speed_kmh should be non-negative.

## 9. Suggested Response Conventions

For consistency, the API should return:

- 200 for successful reads and updates,
- 201 for successful creation,
- 404 for missing resources,
- 400 for invalid input,
- 500 for unexpected server errors.

For list endpoints, the response can optionally include pagination metadata later, such as:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

## 10. Implementation Plan

### Phase 1: Foundation

- Review the existing Express router structure.
- Keep the current route prefix pattern: /v1/api/.
- Prepare the seed data format for vehicles and pings.
- Add route files or extend the existing ones.

### Phase 2: Core Resources

- Implement vehicle CRUD routes.
- Implement ping collection and detail routes.
- Implement station-to-vehicle nested route.

### Phase 3: Enrichment

- Add last-position logic for each vehicle.
- Add vehicle detail responses that embed the latest ping.
- Add filtering by vehicle ID for ping queries.

### Phase 4: Validation and Reliability

- Add validation for request bodies.
- Add consistent error handling.
- Improve response formatting.

### Phase 5: Future Upgrade Path

- Replace the current mock data store with a real database such as MongoDB or PostgreSQL.
- Add authentication and user roles.
- Add real-time tracking and WebSocket support.
- Add trip, driver, and booking modules.

## 11. Suggested File Structure for Later Implementation

A future version of the project could evolve into this structure:

- index.js
- db.js
- seed.json
- router/
  - provinces.js
  - districts.js
  - stations.js
  - vehicles.js
  - pings.js
- controllers/
  - vehicleController.js
  - pingController.js
- services/
  - vehicleService.js
  - pingService.js
- validators/
  - vehicleValidator.js
  - pingValidator.js

## 12. Notes on Fit With the Current Project

This project already has a good base for a simple REST API. The current route names and versioning approach fit the plan well, and the existing data model for provinces, districts, and stations can be reused as lookup and geographic support for the taxi tracking domain.

The only major shift is that vehicles and pings will become the main business resources, while the geographic resources remain supporting data.

## 13. Open Questions

The following questions can be answered later if needed:

1. Should vehicles be managed by a driver or by a station only?
2. Should the API support real-time updates in addition to standard REST calls?
3. Should trip history and ride booking be included in the first version?
4. Should the data be moved from seed.json to a database soon after the basic routes are ready?

## 14. Summary

The planned API will center on two main resource types:

- vehicles for fleet management,
- pings for location tracking history.

The project will use the existing Express structure, follow RESTful conventions, and keep the initial version simple while remaining extensible for future business features.
