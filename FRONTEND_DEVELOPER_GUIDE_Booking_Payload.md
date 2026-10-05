# Developer Guide — What to Change in the Frontend

**For:** the frontend developer working on booking creation
**Endpoint:** `POST /alice-property-api/create-bookings-api/`
**Companion doc:** `FRONTEND_HANDOFF_Booking_Payload.md` (the full field-by-field spec — this guide is the "how to change your code" version)
**Date:** 13 August 2026

> **Note on scope.** This guide was written from the backend side, so it does not name your components or state variables. It defines exactly what the payload builder must **receive** and **produce**, with working code. Map the property names onto whatever your cart state already calls them.

---

## 1. The change in one sentence

> Today the app sends **one cart item per room**. It must send **one cart item per guest**.

That's the whole change. Everything else in this guide follows from it.

---

## 2. What's broken right now

Book **2 twin rooms for 4 guests**. Here's what the app sends today:

```jsonc
"cart_items": [
  { "room_uid": "roomA", "bed_index": 0, ... },   // ← 1 item for the whole room
  { "room_uid": "roomB", "bed_index": 0, ... }    // ← 1 item for the whole room
],
"traveler_assignments": [
  { "cart_item_index": 0, "traveler_id": "guest1" },
  { "cart_item_index": 0, "traveler_id": "guest2" },   // ← 2nd guest on the SAME index
  { "cart_item_index": 1, "traveler_id": "guest3" },
  { "cart_item_index": 1, "traveler_id": "guest4" }    // ← 2nd guest on the SAME index
]
```

The backend creates **one booking per cart item**. Two cart items → two bookings. Guests 2 and 4 were thrown away, and the API still replied `success: true`.

**The backend now rejects this** with HTTP 400 instead of losing people silently. So this flow currently errors until the frontend is updated. That is intentional — a visible error beats a silent data loss.

### Two guests were never in danger, because that path is already correct

Book **1 twin room for 2 guests** and the app already sends the right shape:

```jsonc
"cart_items": [
  { "room_uid": "roomA", "bed_index": 0, ... },
  { "room_uid": "roomA", "bed_index": 1, ... }    // ← one per BED
],
"traveler_assignments": [
  { "cart_item_index": 0, "traveler_id": "guest1" },
  { "cart_item_index": 1, "traveler_id": "guest2" }
]
```

**So the fix is: make the multi-room path do what the single-room path already does.** You are not inventing a new format — you are applying the existing correct one everywhere.

---

## 3. What it must look like after

Same booking — 2 twin rooms, 4 guests — sent correctly:

```jsonc
"cart_items": [
  { "room_uid": "roomA", "bed_index": 0, ... },   // index 0
  { "room_uid": "roomA", "bed_index": 1, ... },   // index 1
  { "room_uid": "roomB", "bed_index": 0, ... },   // index 2
  { "room_uid": "roomB", "bed_index": 1, ... }    // index 3
],
"traveler_assignments": [
  { "cart_item_index": 0, "traveler_id": "guest1" },
  { "cart_item_index": 1, "traveler_id": "guest2" },
  { "cart_item_index": 2, "traveler_id": "guest3" },
  { "cart_item_index": 3, "traveler_id": "guest4" }
]
```

**4 cart items → 4 assignments → 4 bookings.** Every index used exactly once.

Side by side:

| | Cart items | Assignments | Bookings created |
|---|---|---|---|
| Before | 2 | 4 (indices reused) | 2 ❌ |
| After | 4 | 4 (each index once) | 4 ✅ |

---

## 4. The mental model

Think of it as **two different lists doing two different jobs**:

- `cart_items` = **WHERE** someone sleeps → property, room, bed, dates
- `traveler_assignments` = **WHO** sleeps there → the guest, linked by position

They are joined by `cart_item_index`, which is simply the **array position** in `cart_items`.

The rule that makes everything else fall into place:

> **One bed = one guest = one cart item = one booking.**

A "bed" here means a sleeping slot the guest occupies. For a shared twin room that's a real bed (0 or 1). For a private room or a whole-room exclusive booking, it's the entire room, and `bed_index` is `null`.

### You do NOT need to restructure your cart state

Keep your cart room-centric internally — that's what the UI shows. Do the expansion **only when you build the payload**, in one function. This is the smallest possible change and the easiest to test.

```
Your cart state (room-centric)          →  Payload (guest-centric)
────────────────────────────────           ─────────────────────────
Room A: guest1 (bed 0), guest2 (bed 1)  →  2 cart items + 2 assignments
Room B: guest3 (bed 0), guest4 (bed 1)  →  2 cart items + 2 assignments
                                           = 4 items, 4 assignments
```

---

## 5. The input your builder needs

Your cart state must be able to answer, per room: **which guests, and which bed each one has.**

Minimum shape (rename freely to match your code):

```js
const selection = [
  {
    propertyUid:  'eb554ea6-…',
    roomUid:      '6c6276c4-…',
    roomType:     'Twin-Sharing',      // or 'Private'  ← comes from the search response
    checkIn:      '2026-08-12',
    checkOut:     '2026-08-13',
    mode:         'shared',            // 'shared' | 'exclusive'   (twin rooms only)
    availableBeds: [0, 1],             // from the search response (twin rooms only)
    guests: [
      { travelerUid: '3514155c-…', bedIndex: 0 },
      { travelerUid: '159daffc-…', bedIndex: 1 },
    ],
    adultsCount: null,                 // only for exclusive / private — see §8
  },
  // …one entry per room the user picked
];
```

**The one field you may not have yet is `guests[].bedIndex`.** The single-room flow already tracks beds (it sends 0 and 1 correctly), so the capability exists — it just isn't carried through on the multi-room path. See §7 for the UI side.

---

## 6. The builder function

Drop this in, call it where you currently assemble the request body. It handles all three room types.

```js
/**
 * Turns a room-centric cart selection into the guest-centric payload the API expects.
 * One cart item per guest for shared twin rooms; one per room for private/exclusive.
 */
function buildBookingPayload(selection, companyId, extras = {}) {
  const cart_items = [];
  const traveler_assignments = [];

  selection.forEach((room) => {
    const isTwin      = room.roomType === 'Twin-Sharing';
    const isExclusive = isTwin && room.mode === 'exclusive';

    // ---- Private room, or a twin booked exclusively: ONE booking for the room ----
    if (!isTwin || isExclusive) {
      cart_items.push({
        property_uid:   room.propertyUid,
        room_uid:       room.roomUid,
        bed_index:      null,                                   // always null here
        check_in_date:  room.checkIn,
        check_out_date: room.checkOut,
        adults_count:   room.adultsCount ?? room.guests.length, // real headcount
      });

      traveler_assignments.push({
        cart_item_index:      cart_items.length - 1,            // never hardcode this
        traveler_id:          room.guests[0].travelerUid,       // the registered guest
        is_exclusive_booking: isExclusive,
      });
      return;
    }

    // ---- Shared twin room: ONE booking per guest, each on its own bed ----
    room.guests.forEach((guest, i) => {
      cart_items.push({
        property_uid:   room.propertyUid,
        room_uid:       room.roomUid,
        bed_index:      guest.bedIndex ?? room.availableBeds[i], // fallback, see §7
        check_in_date:  room.checkIn,
        check_out_date: room.checkOut,
        // adults_count omitted → backend defaults to 1
      });

      traveler_assignments.push({
        cart_item_index:      cart_items.length - 1,
        traveler_id:          guest.travelerUid,
        is_exclusive_booking: false,
      });
    });
  });

  return {
    company_id: companyId,
    cart_items,
    traveler_assignments,
    ...extras,   // arrival_details, additional_comments, company_booking_reference,
                 // send_confirmation_email, additional_email_recipients
  };
}
```

### The single most important line

```js
cart_item_index: cart_items.length - 1
```

Always derive the index from the array position **at the moment you push**. Never compute it from a room counter or a loop variable over rooms — that is exactly how two guests ended up sharing index 0.

### Worked check

Feed it 2 twin rooms × 2 guests and you get precisely the payload in §3: 4 cart items, assignments 0/1/2/3, beds 0/1/0/1. Feed it 1 twin room × 2 guests and you get today's already-correct payload, unchanged.

> **This code was executed, not just written.** Both functions were run against all eight scenarios in §12 — 18 assertions, all passing — confirming they emit exactly the payloads in the handoff spec. The receiving end is covered too: the backend test suite proves that shape creates one booking per guest, for 2, 3, 4 and 5 rooms.

---

## 7. UI changes you also need

The builder is the core, but a few screens need to feed it correctly.

| # | Change | Why |
|---|---|---|
| 1 | **Record which bed each guest gets**, on the multi-room path too | The builder needs `guests[].bedIndex`. Without it you fall back to list order, and the bed shown in the UI may not match the bed stored |
| 2 | **Offer only beds from `available_beds`** | A partially-booked room returns e.g. `[1]` — offering bed 0 there guarantees a rejection |
| 3 | **Remove a bed from the picker once assigned** | Two guests on the same bed rejects the whole request |
| 4 | **Cap guests per twin room at `available_beds.length`** | More guests than free beds rejects the whole request |
| 5 | **Gate "book whole room" on `can_book_exclusive`** | It's `true` only when both beds are free |
| 6 | **When "exclusive" is on, disable that room's bed picker** | Booking the whole room *and* a bed in it rejects the whole request |
| 7 | **Filter the traveller picker by `gender_lock.locked_gender`** | Twin rooms cannot be mixed-gender. Optionally pre-check with `POST /alice-property-api/validate-traveler-gender/` |
| 8 | **Block the same traveller twice on overlapping dates** | Rejects the whole request |

All of these fields come straight from the search response (`POST /alice-property-api/basic-room-search-api/`) — `available_beds`, `can_book_exclusive`, `gender_lock` are returned **for twin-sharing rooms only**. Private rooms have no bed fields and `gender_lock: null`.

**About the fallback in the builder.** `guest.bedIndex ?? room.availableBeds[i]` keeps things working if a screen hasn't been updated yet. It is safe only while the UI does not *show* the user a specific bed. Once the user picks a bed, always pass `bedIndex` — otherwise the screen and the booking can disagree.

---

## 8. `adults_count` — the one genuinely new field

Every booking carries exactly **one registered traveller**, so `adults_count` defaults to `1`.

Send it only when a single booking covers **more people than that one traveller**:

| Case | Send |
|---|---|
| Shared twin bed | omit it (backend uses 1) |
| Exclusive twin — one booker takes the room for two | `adults_count: 2` |
| Private room shared with someone who isn't a system user | the real headcount |

❌ **Do not** put the party total on every item. Four guests across four cart items is `adults_count: 1` four times — **not** `4` four times.

There is also a request-level `adults_count`. It still works but is **legacy**: the backend only uses it when the cart has exactly one item. Prefer the per-cart-item field.

---

## 9. Check before you send

Cheap guard that catches the original bug at source:

```js
function assertPayloadIsValid(payload) {
  const { cart_items, traveler_assignments } = payload;

  if (cart_items.length !== traveler_assignments.length) {
    throw new Error(
      `Expected one traveller per cart item — got ${cart_items.length} items ` +
      `and ${traveler_assignments.length} assignments.`
    );
  }

  const indices = traveler_assignments.map(a => a.cart_item_index);
  if (new Set(indices).size !== indices.length) {
    throw new Error('Duplicate cart_item_index — two guests share one cart item.');
  }

  const travellers = traveler_assignments.map(a => a.traveler_id);
  if (new Set(travellers).size !== travellers.length) {
    throw new Error('The same traveller appears twice in this booking.');
  }
}
```

The invariant to remember:

```
cart_items.length === traveler_assignments.length === number of bookings you expect
```

---

## 10. Handling the response

### Success

```jsonc
{
  "status": 200,
  "success": true,
  "response": {
    "bookings_created": 4,
    "bookings": [
      { "cart_item_index": 0, "booking_number": "BKG-20260812-1234",
        "traveler_name": "…", "bed_index": 0, "total_price": 2000.0, … }
    ]
  }
}
```

Each booking carries its `cart_item_index`, so you can map results back to the exact cart row and update per guest.

### Errors — there are **two different 400 bodies**, handle both

**A. Payload-shape error** — a field-keyed object, thrown before processing:

```jsonc
{ "status": 400, "success": false,
  "response": { "traveler_assignments": ["Each cart item must have exactly one traveller assignment …"] } }
```

**B. Business-rule error** — has `validation_errors[]`, each tagged with its cart row:

```jsonc
{ "status": 400, "success": false,
  "response": {
    "message": "Validation failed for 1 item(s). No bookings created.",
    "validation_errors": [
      { "cart_item_index": 1, "error": "Gender mismatch in room 'Twin A' …" }
    ]
  } }
```

Suggested handling:

```js
const body = res.data.response;
if (Array.isArray(body?.validation_errors)) {
  body.validation_errors.forEach(e => showErrorOnCartRow(e.cart_item_index, e.error));
} else if (body && typeof body === 'object') {
  Object.values(body).flat().forEach(showGeneralError);   // field-keyed shape
}
```

**Bookings are all-or-nothing.** If anything fails, **zero** bookings are created — so a failed request never needs partial cleanup.

---

## 11. Common mistakes to avoid

| ❌ Don't | ✅ Do |
|---|---|
| Reuse `cart_item_index` for two guests | One index per guest, derived from array position |
| Hardcode `bed_index: 0` | Use the bed the guest was given, from `available_beds` |
| Send extra cart items for one private room | One item; put the headcount in `adults_count` |
| Send `adults_count: 4` on all four items | `1` each (or omit) |
| Send `bed_index` with `is_exclusive_booking: true` | `null` — it's ignored anyway |
| Build the index from a room loop counter | Use `cart_items.length - 1` |
| Assume every 400 has `validation_errors` | Handle both body shapes |

---

## 12. How to test you're done

| # | Do this | Expect |
|---|---|---|
| 1 | **2 twin rooms, 4 guests** | `bookings_created: 4`, beds 0/1 in each room. *Returns 2 today — this is the acceptance test* |
| 2 | 1 twin room, 2 guests | `bookings_created: 2` — unchanged |
| 3 | 1 private room | `bookings_created: 1`, `bed_index: null` — unchanged |
| 4 | 2 exclusive twin rooms | `bookings_created: 2`, `bed_index: null`, `is_exclusive_booking: true` — unchanged |
| 5 | 3 twin rooms, 6 guests | `bookings_created: 6` (the pattern scales — backend-tested up to 5 rooms) |
| 6 | Mixed cart: 2 shared twins + 1 private | `bookings_created: 5` |
| 7 | Try a male + female in one twin room | HTTP 400, error shown against the right cart row |
| 8 | Try 3 guests in a 2-bed room | HTTP 400, nothing created |

Test 1 is the one that matters. Everything else is a regression check.

---

## 13. Checklist

- [ ] `buildBookingPayload()` added and used wherever the booking request is assembled
- [ ] Multi-room twin path emits one cart item **per guest**, not per room
- [ ] `cart_item_index` always derived from array position
- [ ] Each guest's chosen bed carried through to `bed_index`
- [ ] Bed picker limited to `available_beds`; a bed disappears once taken
- [ ] Guests per twin room capped at `available_beds.length`
- [ ] "Book whole room" gated on `can_book_exclusive`; disables that room's bed picker
- [ ] Traveller picker filtered by `gender_lock.locked_gender`
- [ ] `adults_count` per cart item for exclusive/private; omitted for shared beds
- [ ] `assertPayloadIsValid()` runs before POST
- [ ] Both 400 body shapes handled; errors mapped to rows via `cart_item_index`
- [ ] Test 1 passes: 2 twin rooms + 4 guests → `bookings_created: 4`

---

**Questions on the API contract?** The full field-by-field spec, with complete example payloads for every case and the exact backend error strings, is in `FRONTEND_HANDOFF_Booking_Payload.md`.
