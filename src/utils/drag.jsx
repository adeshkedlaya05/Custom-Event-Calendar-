import interact from "interactjs";
import moment from "moment";

export function enableDrag(setEvents, events, CurrentMonth) {
  // Clear previous bindings
  interact(".draggable-event").unset();
  interact("[data-date]").unset();

  // Make draggable
  interact(".draggable-event").draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.dataset.x) || 0) + event.dx;
        const y = (parseFloat(target.dataset.y) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.dataset.x = x;
        target.dataset.y = y;
      },
      end(event) {
        resetPosition(event.target);
      }
    }
  });

  // Dropzone logic for calendar cells
  interact("[data-date]").dropzone({
    accept: ".draggable-event",
    overlap: 0.5,
    ondragenter(event) {
      event.target.classList.add("drop-target");
    },
    ondragleave(event) {
      event.target.classList.remove("drop-target");
    },
    ondropdeactivate(event) {
      event.target.classList.remove("drop-target");
    },
    ondrop(event) {
      const dragged = event.relatedTarget;
      const dropCell = event.target;
      const newDate = dropCell.dataset.date;
      const eventId = dragged.dataset.id;

      if (!eventId || !newDate) return resetPosition(dragged);

      // Find the event by id in events only (no modifiedInstances or recurrence)
      const originalEvent = events.find(e => e.id.toString() === eventId);

      if (!originalEvent) return resetPosition(dragged);

      const isSameMonth = moment(newDate).isSame(CurrentMonth, "month");
      const isDifferent = !moment(newDate).isSame(originalEvent.date, "day");

      if (isSameMonth && isDifferent) {
        // Update event date
        setEvents(prev =>
          prev.map(e =>
            e.id === originalEvent.id ? { ...e, date: newDate } : e
          )
        );
      }

      resetPosition(dragged);
    }
  });

  function resetPosition(target) {
    target.style.transform = "translate(0px, 0px)";
    delete target.dataset.x;
    delete target.dataset.y;
  }
}
