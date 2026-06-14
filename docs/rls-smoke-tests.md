# RLS smoke test matrix

Run manually on staging with three test users: **admin**, **agent** (assigned contacts), **read_only**.

## Contacts

| Action | admin | agent (assigned) | agent (other's) | read_only |
|--------|-------|------------------|-----------------|------------|
| View list | pass | pass | pass | pass |
| Create | pass | pass | — | fail |
| Edit assigned | pass | pass | — | fail |
| Edit other's | pass | fail | fail | fail |
| Delete | pass | fail | fail | fail |

## Notes

| Action | admin | agent | read_only |
|--------|-------|-------|-----------|
| Add | pass | pass | fail |
| Edit/delete | pass | fail | fail |

## Pipeline / stage change

| Action | admin | agent (assigned) | agent (other's) |
|--------|-------|------------------|-----------------|
| Move card | pass | pass | fail |

## Audit log

| Action | admin | agent |
|--------|-------|-------|
| View `/admin/audit` | pass | 404 |

## Workstream B (after 0004)

Repeat create/edit rules for `commissions` and `enrollment_activities` tied to contact assignment.
