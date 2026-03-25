# Backend API Spec

## Purpose

This document lists the API endpoints the frontend needs to replace the current mock Redux state with real server data.

Current frontend scope:

- auth
- profile
- public quest board
- public service board
- post details
- my posts
- active tasks
- applicants / performer selection
- reviews summary and list

## General Notes

- All responses should be JSON.
- Use UTC ISO datetime strings, for example `2026-03-15T12:30:00Z`.
- IDs can be strings or numbers, but must be stable.
- `type` must be either `quest` or `service`.
- `status` values used by frontend:
  - `Open`
  - `In Progress`
  - `Completed`
  - `Cancelled`
- Rewards:
  - `primaryReward` is required
  - `alternativeReward` is optional
- `contactInfo` is plain text, not structured fields.
- `aboutMe` is plain text.

## Auth

### `POST /auth/register`

Creates a new user account.

Request:

```json
{
  "username": "alexm",
  "email": "alex.martinez@university.edu",
  "password": "password123!",
  "studyProgram": "Computer Science",
  "yearOfStudy": "2"
}
```

Response:

```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "u_1",
    "username": "alexm",
    "email": "alex.martinez@university.edu",
    "studyProgram": "Computer Science",
    "yearOfStudy": "2"
  }
}
```

### `POST /auth/login`

Request:

```json
{
  "email": "alex.martinez@university.edu",
  "password": "password123!"
}
```

Response:

```json
{
  "token": "jwt-or-session-token",
  "user": {
    "id": "u_1",
    "username": "alexm",
    "email": "alex.martinez@university.edu",
    "studyProgram": "Computer Science",
    "yearOfStudy": "2"
  }
}
```

### `POST /auth/logout`

Optional if token-based logout is needed.

## Profile

### `GET /me`

Returns current user profile used in profile page and post author sync.

Response:

```json
{
  "id": "u_1",
  "username": "alexm",
  "email": "alex.martinez@university.edu",
  "university": "Technical University",
  "studyProgram": "Computer Science",
  "yearOfStudy": "2",
  "contactInfo": "Telegram: @alexm, email: alex.martinez@university.edu",
  "aboutMe": "Passionate about coding...",
  "joinedAt": "2024-09-01T00:00:00Z",
  "ratings": {
    "asRequester": 4.8,
    "asProvider": 4.6
  },
  "stats": {
    "completedAsRequester": 7,
    "completedAsProvider": 5,
    "openPosts": 3,
    "inProgress": 2,
    "totalEarned": 185
  },
  "badges": [
    "Quick Responder",
    "Top Helper",
    "Verified Student"
  ]
}
```

### `PATCH /me`

Updates editable profile fields.

Request:

```json
{
  "username": "alexm",
  "email": "alex.martinez@university.edu",
  "university": "Technical University",
  "studyProgram": "Computer Science",
  "yearOfStudy": "2",
  "contactInfo": "Telegram: @alexm",
  "aboutMe": "Frontend and coding focused."
}
```

Response:

- updated profile object, same shape as `GET /me`

### `GET /me/reviews`

Returns reviews for current user profile page.

Response:

```json
[
  {
    "id": "r_1",
    "author": {
      "id": "u_2",
      "username": "miket"
    },
    "role": "Provider",
    "rating": 5,
    "text": "Super helpful.",
    "createdAt": "2026-03-13T10:00:00Z"
  }
]
```

### `GET /me/activity`

Optional if backend wants dedicated profile activity feed.

## Public Posts

Frontend currently treats quests and services similarly. Backend can either expose separate endpoints or one combined endpoint with `type`.

### Option A: separate endpoints

### `GET /quests`

Query params:

- `search`
- `tag`
- `sort`
- `status`
- `page`
- `limit`

### `GET /services`

Query params:

- `search`
- `tag`
- `sort`
- `status`
- `page`
- `limit`

### Option B: combined endpoint

### `GET /posts`

Query params:

- `type=quest|service`
- `search`
- `tag`
- `sort`
- `status`
- `page`
- `limit`

### Public list item response shape

```json
[
  {
    "id": "p_1",
    "type": "quest",
    "title": "Fix my Java Application",
    "description": "I have a project due tomorrow...",
    "status": "Open",
    "postedAt": "2026-03-15T10:00:00Z",
    "deadline": "2026-03-16T18:00:00Z",
    "tags": ["Coding", "Homework", "Urgent"],
    "applicantsCount": 3,
    "primaryReward": "5.00€",
    "alternativeReward": "Coffee and handwritten notes",
    "author": {
      "id": "u_1",
      "username": "alexm",
      "studyProgram": "Computer Science",
      "yearOfStudy": "2",
      "ratings": {
        "asRequester": 4.8,
        "asProvider": 4.6
      },
      "reviewsCount": 12
    }
  }
]
```

## Post Details

### `GET /posts/:id`

Used by both quest detail and service detail view.

Response:

```json
{
  "id": "p_1",
  "type": "quest",
  "title": "Fix my Java Application",
  "description": "Full description...",
  "status": "Open",
  "postedAt": "2026-03-15T10:00:00Z",
  "updatedAt": "2026-03-15T12:00:00Z",
  "deadline": "2026-03-16T18:00:00Z",
  "tags": ["Coding", "Homework", "Urgent"],
  "images": [
    "https://cdn.example.com/post-1-a.png"
  ],
  "primaryReward": {
    "label": "Primary Reward",
    "value": "5.00€",
    "images": [
      "https://cdn.example.com/reward-a.png"
    ]
  },
  "alternativeReward": {
    "label": "Alternative Reward",
    "value": "Coffee and handwritten notes",
    "images": []
  },
  "author": {
    "id": "u_1",
    "username": "alexm",
    "studyProgram": "Computer Science",
    "yearOfStudy": "2",
    "aboutMe": "I usually post coding and study-related quests.",
    "contactInfo": "Telegram: @alexm",
    "ratings": {
      "asRequester": 4.8,
      "asProvider": 4.6
    },
    "reviewsCount": 12,
    "recentPosts": [
      {
        "id": "p_2",
        "title": "Need UI feedback for portfolio landing page",
        "status": "Open",
        "postedAt": "2026-03-15T09:00:00Z"
      }
    ]
  }
}
```

## Create Posts

### `POST /quests`

Request:

```json
{
  "title": "Fix my Java Application",
  "description": "Full text",
  "deadline": "2026-03-16T18:00:00Z",
  "tags": ["Coding", "Homework"],
  "primaryReward": "5.00€",
  "alternativeReward": "Coffee and notes",
  "images": [],
  "primaryRewardImages": [],
  "alternativeRewardImages": []
}
```

Response:

- created full post object

### `POST /services`

Request:

```json
{
  "title": "Frontend UI Polish Sessions",
  "description": "I review student pages...",
  "tags": ["Coding", "Design"],
  "primaryReward": "€12.00 / session",
  "alternativeReward": "Code review exchange",
  "images": [],
  "primaryRewardImages": [],
  "alternativeRewardImages": []
}
```

Response:

- created full post object

## Update / Delete Own Posts

### `PATCH /posts/:id`

Updates own quest or service post.

### `DELETE /posts/:id`

Deletes own quest or service post.

## My Posts

### `GET /me/posts`

Returns both quests and services created by current user.

Query params:

- `status`
- `type`
- `page`
- `limit`

Response:

```json
[
  {
    "id": "p_1",
    "type": "quest",
    "title": "Fix my Java Application",
    "status": "Open",
    "postedAt": "2026-03-15T10:00:00Z",
    "deadline": "2026-03-16T18:00:00Z",
    "applicantsCount": 3,
    "primaryReward": "5.00€",
    "alternativeReward": "Coffee and notes",
    "tags": ["Coding", "Homework"],
    "selectedPerformer": null
  }
]
```

## Applicants

### `GET /posts/:id/applicants`

Returns applicants for a post created by the current user.

Response:

```json
[
  {
    "id": "a_1",
    "user": {
      "id": "u_5",
      "username": "sarahj",
      "studyProgram": "Computer Science",
      "yearOfStudy": "2",
      "aboutMe": "I like debugging messy homework tasks...",
      "contactInfo": "Telegram: @sarahj",
      "ratings": {
        "asRequester": 4.8,
        "asProvider": 4.8
      },
      "reviewsCount": 8
    },
    "message": "I can fix this tonight.",
    "createdAt": "2026-03-15T11:30:00Z"
  }
]
```

### `POST /posts/:id/applicants`

Apply to a quest or service.

Request:

```json
{
  "message": "I can fix this tonight."
}
```

### `POST /posts/:id/select-performer`

Used when post owner chooses one applicant.

Request:

```json
{
  "applicantId": "a_1"
}
```

Response:

- updated post or lightweight success payload

## Active Tasks

### `GET /me/active-tasks`

Returns both:

- tasks I accepted / booked
- tasks where I am requester and already selected performer

Response:

```json
{
  "accepted": [
    {
      "id": "at_1",
      "postId": "p_10",
      "title": "Debug React useEffect hook",
      "counterparty": {
        "id": "u_9",
        "username": "miket",
        "rating": 4.6
      },
      "status": "In Progress",
      "amount": "15.00€",
      "startedAt": "2026-03-13T09:00:00Z"
    }
  ],
  "requested": [
    {
      "id": "at_2",
      "postId": "p_1",
      "title": "Fix my Java Application",
      "counterparty": {
        "id": "u_5",
        "username": "sarahj",
        "rating": 4.8
      },
      "status": "In Progress",
      "amount": "5.00€",
      "startedAt": "2026-03-15T12:00:00Z"
    }
  ]
}
```

## Claim / Book Post

### `POST /posts/:id/claim`

Frontend currently uses this for:

- claiming a quest
- booking a service

Request:

```json
{}
```

Response:

- created active task object

## Reviews

### `GET /users/:id/reviews`

Optional if frontend later opens full reviews modal for any author/applicant.

### `POST /active-tasks/:id/reviews`

Leave review after task is finished.

Request:

```json
{
  "rating": 5,
  "text": "Super helpful and easy to coordinate with.",
  "role": "Provider"
}
```

## Recommended Domain Models

### User

```json
{
  "id": "u_1",
  "username": "alexm",
  "email": "alex.martinez@university.edu",
  "university": "Technical University",
  "studyProgram": "Computer Science",
  "yearOfStudy": "2",
  "aboutMe": "text",
  "contactInfo": "plain text",
  "ratings": {
    "asRequester": 4.8,
    "asProvider": 4.6
  },
  "reviewsCount": 12
}
```

### Post

```json
{
  "id": "p_1",
  "type": "quest",
  "title": "Fix my Java Application",
  "description": "text",
  "status": "Open",
  "postedAt": "2026-03-15T10:00:00Z",
  "updatedAt": "2026-03-15T12:00:00Z",
  "deadline": "2026-03-16T18:00:00Z",
  "tags": ["Coding"],
  "images": [],
  "primaryReward": {
    "value": "5.00€",
    "images": []
  },
  "alternativeReward": {
    "value": "Coffee",
    "images": []
  },
  "applicantsCount": 3,
  "author": {}
}
```

## Minimum Backend Delivery Order

If backend wants to implement in phases, this order is enough for frontend integration:

1. `POST /auth/register`
2. `POST /auth/login`
3. `GET /me`
4. `PATCH /me`
5. `GET /quests`
6. `GET /services`
7. `GET /posts/:id`
8. `POST /quests`
9. `POST /services`
10. `GET /me/posts`
11. `GET /posts/:id/applicants`
12. `POST /posts/:id/select-performer`
13. `GET /me/active-tasks`
14. `POST /posts/:id/claim`
15. `PATCH /posts/:id`
16. `DELETE /posts/:id`

## Frontend Mapping Notes

- Quest Board uses public quest list.
- Provider Board uses public service list.
- Detail page uses one universal post details response.
- My Posts needs both own quests and own services in one list.
- Active Tasks needs accepted and requested grouped separately.
- Profile page needs current user profile, stats, and reviews.
- Applicants list needs user summary plus application message.

