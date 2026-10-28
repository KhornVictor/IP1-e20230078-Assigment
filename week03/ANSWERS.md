# Week 3 Practice Answers: Vue Components and Reactivity

### 1. In EventList, what goes wrong if you use the array index as :key and the list gets filtered while a card has local state (for example an open details panel)?

When an array index is used as :key, Vue's virtual DOM reconciliation relies on the element's position in the list rather than its unique identity. If the list is filtered, the element previously at index 1 may shift to index 0, causing Vue to patch and reuse the existing DOM element and component instance at index 0 rather than recreating or correctly moving it. As a result, any internal component state (such as an expanded details panel, toggle state, or form inputs) remains attached to the position rather than the underlying event, displaying the state on the wrong card.

### 2. Why is visible a computed and not a function called from the template? What is the difference when you type in the search box?

A computed property caches its return value and only re-evaluates when one of its reactive dependencies (events, search, or category) changes. If visible() were a method called directly inside the template, Vue would execute the entire filtering logic on every component re-render, even when unrelated reactive state changes. When typing in the search box, a computed property recalculates only because the reactive search ref changed, ensuring optimal performance and avoiding unnecessary work on every render cycle.

### 3. EventCard emits book instead of changing event.booked. Give two reasons.

First, Vue follows a strict unidirectional data flow architecture ("props down, events up"), where child components must treat props as read-only and emit events rather than directly mutating data passed from a parent. Second, App.vue owns the canonical events dataset and must orchestrate multiple side effects when a booking happens, including incrementing the booking count, managing the user's myBookings list, and synchronizing state to localStorage.

### 4. You write const { booked } = reactive(event); booked++. The page does not change. Why?

Destructuring a property from a reactive object extracts its primitive value (a number) into a local variable, completely breaking its connection to the reactive proxy. When you increment booked++, you are only modifying that independent local primitive variable in JavaScript memory. Because the proxy setter on the reactive event object is never triggered, Vue has no way to track the mutation, and no DOM re-render is scheduled.

### 5. Where does myBookings live, and why not in EventCard or EventList?

myBookings lives in the top-level App.vue component because it represents global application state that is needed outside of the event cards, such as in the header counter ("You have booked N seats") and for application-wide persistence. It cannot live in EventCard because each card only represents an individual event and cannot track bookings across other events. It should not live in EventList because EventList is only responsible for filtering and displaying cards, and booking records must persist and remain accessible even when events are filtered out or when other views/components need access to booking history.
