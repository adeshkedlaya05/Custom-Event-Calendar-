# 📅 Custom Event Calendar

A full-featured React calendar application that supports event creation, editing, deletion, recurrence, drag-and-drop scheduling, filtering, and persistent storage. Built with **React**, **Bootstrap**, and **Moment.js**.

---

## 🚀 Features

### 1. Monthly View Calendar
- Traditional monthly grid layout.
- Highlights the current day.
- Buttons to navigate to previous or next months.

---

### 2. Event Management

#### ➕ Add Event
- Click on a specific date to open the event creation form.
- Form includes:
  - **Event Title**
  - **Date & Time** (with native time picker)
  - **Description**
  - **Recurrence Options** (Daily, Weekly, Monthly, Custom)
  - **Event Category** (Personal, Work, Health)

#### ✏️ Edit Event
- Click on any existing event to open the edit form.
- Modify all details and save changes.

#### ❌ Delete Event
- Delete directly from the event card or within the form.
- Deletes single or recurring instance appropriately.

---

### 3. Recurring Events
Supports:
- **Daily**: Repeats every day.
- **Weekly**: Repeats on selected weekdays.
- **Monthly**: Repeats on a specific day each month.
- **Custom**: Repeat every N days.

> Recurring events are expanded and displayed within the current calendar view range only.

---

### 4. Drag-and-Drop Rescheduling
- Events are **draggable** between calendar cells using `interact.js`.
- Automatically updates the event's date upon drop.
- Validates against conflicts when dropping on an occupied date/time slot.

---

### 5. Event Conflict Management
- Detects time conflicts when creating or dragging events.(prevents overlap on drag via single-event-per-day display)
- Displays a modal dialog warning the user about overlapping events.
- Prevents accidental double-booking.

---

### 6. Event Filtering & Search 
- Dynamic search bar :.
  - Instantly updates the calendar view with matching results.
- Filter dropdown for **Personal**, **Work**, and **Health** categories.

---

### 7. Event Persistence
- Events, modified instances, and deleted occurrences are saved to **Local Storage**.
- No backend or login required.
- Data is preserved across refreshes, tab closures, or device restarts.

---

## 🛠️ Tech Stack

- **React** (Frontend UI)
- **Bootstrap 5** (Styling and layout)
- **Moment.js** (Date manipulation)
- **Interact.js** (Drag-and-drop functionality)
- **LocalStorage** (Persistent data)

---

## 💻 Run Locally on Your PC

1. **Clone the Repository**
   ```bash
   git clone https://github.com/adeshkedlaya05/Custom-Event-Calendar-.git
   
   cd custom-event-calendar
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the App**
   ```bash
   npm start
   ```

4. **Open in Browser**
   - Visit: [http://localhost:3000](http://localhost:3000)

> Make sure you have **Node.js** and **npm** installed before running the commands.

---

## 📸 Screenshots

![Screenshot 2025-06-27 123609](https://github.com/user-attachments/assets/8fab46bf-5eca-48f5-96bd-47782e710400)



![Screenshot 2025-06-27 123918](https://github.com/user-attachments/assets/bc9d6e8e-dfdc-4cc9-9fc6-b686662fbc86)


---


