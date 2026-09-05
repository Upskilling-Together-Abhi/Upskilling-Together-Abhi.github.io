const tutors = [
  { id: 'maya', name: 'Maya Chen', initials: 'MC', subject: 'Math', subjects: ['Elementary Math', 'Pre-Algebra', 'Algebra I'], grades: 'Grades 3–9', rate: '$45 / hour', availability: 'Mon & Wed afternoons', slots: ['Monday · 4:00 PM', 'Wednesday · 4:00 PM', 'Wednesday · 5:15 PM'], color: 'peach', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=85', bio: 'Maya is the calm, encouraging guide students want beside them when a math problem feels too big. She loves helping middle schoolers see the pattern.' },
  { id: 'marcus', name: 'Marcus Hill', initials: 'MH', subject: 'Math', subjects: ['Pre-Algebra', 'Algebra I', 'Geometry'], grades: 'Grades 6–10', rate: '$50 / hour', availability: 'Tue & Thu evenings', slots: ['Tuesday · 5:00 PM', 'Thursday · 4:30 PM', 'Thursday · 6:00 PM'], color: 'blue', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=85', bio: 'Marcus makes math practical, visual, and a lot less intimidating. He is especially great at turning “I’m just not a math person” into confidence.' },
  { id: 'sophie', name: 'Sophie Patel', initials: 'SP', subject: 'Math', subjects: ['Elementary Math', 'Pre-Algebra', 'Algebra I'], grades: 'Grades 2–8', rate: '$45 / hour', availability: 'Sat mornings', slots: ['Saturday · 9:00 AM', 'Saturday · 10:15 AM', 'Saturday · 11:30 AM'], color: 'yellow', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=720&q=85', bio: 'Sophie brings an upbeat energy that makes practice feel possible. Her sessions are structured, playful, and always built around a student’s pace.' },
  { id: 'jordan', name: 'Jordan Reed', initials: 'JR', subject: 'Math', subjects: ['Algebra I', 'Algebra II', 'Geometry'], grades: 'Grades 8–12', rate: '$55 / hour', availability: 'Sun afternoons', slots: ['Sunday · 1:00 PM', 'Sunday · 2:15 PM', 'Sunday · 3:30 PM'], color: 'mint', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=720&q=85', bio: 'Jordan pairs deep subject knowledge with a low-pressure style. They help high school students build the strategies to work through hard problems independently.' },
  { id: 'elena', name: 'Elena Ruiz', initials: 'ER', subject: 'Science', subjects: ['Life Science', 'Earth Science', 'Biology'], grades: 'Grades 5–10', rate: '$50 / hour', availability: 'Tue & Fri afternoons', slots: ['Tuesday · 4:15 PM', 'Friday · 3:45 PM', 'Friday · 5:00 PM'], color: 'lavender', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=720&q=85', bio: 'Elena makes science feel alive. From ecosystems to cells, she helps students connect the dots and get genuinely curious about how the world works.' },
  { id: 'owen', name: 'Owen Brooks', initials: 'OB', subject: 'Reading', subjects: ['Early Reading', 'Comprehension', 'Writing'], grades: 'Grades K–5', rate: '$45 / hour', availability: 'Mon & Thu afternoons', slots: ['Monday · 3:30 PM', 'Thursday · 3:30 PM', 'Thursday · 4:45 PM'], color: 'coral', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=720&q=85', bio: 'Owen creates a relaxed space for young readers to grow. He uses stories, conversation, and lots of encouragement to make reading feel like an adventure.' }
];

const byId = id => tutors.find(tutor => tutor.id === id);
const subjectFromQuery = new URLSearchParams(location.search).get('subject');
const track = (event, properties) => window.abcTrack?.(event, properties);

function renderTutors(filter = 'All') {
  const grid = document.querySelector('#tutor-grid');
  if (!grid) return;
  const filtered = filter === 'All' ? tutors : tutors.filter(t => t.subject === filter);
  grid.innerHTML = filtered.map((tutor, index) => `
    <article class="tutor-card" tabindex="0" data-tutor-card aria-label="${tutor.name}, ${tutor.subject} tutor. Press enter for details.">
      <div class="card-inner">
        <div class="card-face card-front ${tutor.color}">
          <div class="tutor-photo"><img src="${tutor.image}" alt="${tutor.name}" loading="${index < 3 ? 'eager' : 'lazy'}" /></div>
          <div class="tutor-front-copy"><p>${tutor.subject} tutor</p><h2>${tutor.name}</h2><span>${tutor.grades}</span></div>
          <button class="flip-hint" type="button" tabindex="-1" aria-label="Show ${tutor.name}'s details">↻</button>
        </div>
        <div class="card-face card-back ${tutor.color}">
          <button class="flip-back" type="button" tabindex="-1" aria-label="Show ${tutor.name}'s photo">←</button>
          <p class="card-label">A little about ${tutor.name.split(' ')[0]}</p><p class="tutor-bio">${tutor.bio}</p>
          <div class="tutor-meta"><div><span>Subjects</span><b>${tutor.subjects.join(' · ')}</b></div><div><span>Rate</span><b>${tutor.rate}</b></div><div><span>Usually available</span><b>${tutor.availability}</b></div></div>
          <a href="booking.html?tutor=${tutor.id}" class="card-book">Book with ${tutor.name.split(' ')[0]} <span>→</span></a>
        </div>
      </div>
    </article>`).join('');
  grid.querySelectorAll('[data-tutor-card]').forEach(card => {
    const tutor = byId(card.querySelector('.card-book')?.href.split('tutor=')[1]);
    const toggle = () => {
      const isOpening = !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped');
      if (isOpening && tutor) {
        track('tutor_profile_viewed', { tutor_id: tutor.id, subject: tutor.subject });
      }
    };
    card.addEventListener('click', event => { if (!event.target.closest('a')) toggle(); });
    card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
    card.querySelector('.card-book')?.addEventListener('click', () => {
      if (tutor) track('booking_cta_clicked', { tutor_id: tutor.id, subject: tutor.subject, placement: 'tutor_card' });
    });
  });
}

function setupFilters() {
  const filters = document.querySelectorAll('.filter');
  if (!filters.length) return;
  const initial = ['Math', 'Science', 'Reading'].includes(subjectFromQuery) ? subjectFromQuery : 'All';
  renderTutors(initial);
  filters.forEach(button => {
    button.classList.toggle('active', button.dataset.filter === initial);
    button.addEventListener('click', () => {
      filters.forEach(b => b.classList.toggle('active', b === button));
      renderTutors(button.dataset.filter);
      track('subject_filter_selected', { subject: button.dataset.filter });
    });
  });
}

const bookingMemoryKey = 'abc-tutoring-booked-slots';
const bookingRequestMemoryKey = 'abc-tutoring-booking-requests';

function getBookedSlots() {
  try { return JSON.parse(localStorage.getItem(bookingMemoryKey)) || []; }
  catch { return []; }
}

function rememberBookedSlot(tutorId, slot) {
  const booked = getBookedSlots();
  const booking = `${tutorId}::${slot}`;
  if (!booked.includes(booking)) localStorage.setItem(bookingMemoryKey, JSON.stringify([...booked, booking]));
}

function rememberBookingRequest(data, tutor) {
  const request = {
    id: `request-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    tutorId: tutor.id,
    tutorName: tutor.name,
    subject: data.get('subject'),
    slot: data.get('slot'),
    parentName: data.get('parentName'),
    email: data.get('email'),
    studentName: data.get('studentName'),
    grade: data.get('grade'),
    notes: data.get('notes')
  };
  try {
    const requests = JSON.parse(localStorage.getItem(bookingRequestMemoryKey)) || [];
    localStorage.setItem(bookingRequestMemoryKey, JSON.stringify([...requests, request]));
  } catch {
    // The form remains usable when browser storage is unavailable.
  }
}

async function loadAvailability() {
  try {
    const response = await fetch('availability.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Availability file was unavailable.');
    return await response.json();
  } catch {
    return Object.fromEntries(tutors.map(tutor => [tutor.id, tutor.slots]));
  }
}

async function setupBooking() {
  const form = document.querySelector('#booking-form');
  if (!form) return;
  const tutorSelect = document.querySelector('#tutor-select');
  const subjectSelect = document.querySelector('#subject-select');
  const slots = document.querySelector('#slot-options');
  const availBox = document.querySelector('#availability-box');
  const availText = document.querySelector('#availability-text');
  const availability = await loadAvailability();
  let bookingStarted = false;
  let bookingSubmitted = false;
  const selectedProperties = () => {
    const tutor = byId(tutorSelect.value);
    return {
      tutor_id: tutor?.id || undefined,
      subject: subjectSelect.value || tutor?.subject || undefined,
      grade_band: form.elements.grade?.value || undefined,
      has_slot_selected: Boolean(form.querySelector('input[name="slot"]:checked')),
    };
  };
  const markBookingStarted = () => {
    if (bookingStarted) return;
    bookingStarted = true;
    track('booking_started', selectedProperties());
  };
  tutorSelect.insertAdjacentHTML('beforeend', tutors.map(t => `<option value="${t.id}">${t.name} · ${t.subject}</option>`).join(''));
  const updateTutor = () => {
    const tutor = byId(tutorSelect.value);
    if (!tutor) { slots.innerHTML = '<p class="slot-placeholder">Choose a tutor to see their openings.</p>'; availBox.hidden = true; return; }
    subjectSelect.value = tutor.subject;
    availBox.hidden = false; availText.textContent = tutor.availability;
    const openSlots = (availability[tutor.id] || []).filter(slot => !getBookedSlots().includes(`${tutor.id}::${slot}`));
    slots.innerHTML = openSlots.length
      ? openSlots.map((slot, index) => `<label class="slot-option"><input type="radio" name="slot" value="${slot}" required ${index === 0 ? 'checked' : ''}/><span>${slot}</span></label>`).join('')
      : '<p class="slot-placeholder">This tutor is fully booked in this browser. Please choose another tutor.</p>';
  };
  tutorSelect.addEventListener('change', () => {
    updateTutor();
    markBookingStarted();
    const tutor = byId(tutorSelect.value);
    if (tutor) track('tutor_selected_for_booking', { tutor_id: tutor.id, subject: tutor.subject });
  });
  subjectSelect.addEventListener('change', () => {
    markBookingStarted();
    track('booking_subject_selected', { subject: subjectSelect.value || undefined });
  });
  form.addEventListener('focusin', markBookingStarted, { once: true });
  slots.addEventListener('change', event => {
    if (!event.target.matches('input[name="slot"]')) return;
    markBookingStarted();
    track('booking_slot_selected', selectedProperties());
  });
  const selectedId = new URLSearchParams(location.search).get('tutor');
  if (byId(selectedId)) {
    tutorSelect.value = selectedId;
    updateTutor();
    track('booking_page_opened_with_tutor', { tutor_id: selectedId, subject: byId(selectedId).subject });
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form); const tutor = byId(data.get('tutor'));
    if (!tutor) return;
    rememberBookingRequest(data, tutor);
    rememberBookedSlot(tutor.id, data.get('slot'));
    bookingSubmitted = true;
    track('booking_request_submitted', {
      tutor_id: tutor.id,
      subject: data.get('subject'),
      grade_band: data.get('grade'),
      has_slot_selected: Boolean(data.get('slot')),
    });
    document.querySelector('#success-message').textContent = `Thanks, ${data.get('parentName').split(' ')[0]}! We’ve penciled in ${data.get('slot')} with ${tutor.name}. Dana will send confirmation details to ${data.get('email')}.`;
    document.querySelector('#success-modal').hidden = false;
  });
  window.addEventListener('pagehide', () => {
    if (bookingStarted && !bookingSubmitted) track('booking_abandoned', selectedProperties());
  });
}

document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());
setupFilters(); setupBooking();
