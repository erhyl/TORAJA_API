const list = document.getElementById('list');
const form = document.getElementById('addForm');

function refresh() {
  fetch('/students')
    .then(r => r.json())
    .then(data => {
      list.innerHTML = '';
      data.forEach(s => {
        const li = document.createElement('li');
        li.textContent = `${s.name} - ${s.course} (${s.year}) `;
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.onclick = () => fetch(`/students/${s.id}`, {method:'DELETE'})
                             .then(r=>refresh());
        li.appendChild(del);
        list.appendChild(li);
      });
    });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value,
    course: document.getElementById('course').value,
    year: document.getElementById('year').value
  };
  fetch('/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => {
    if (r.ok) {
      form.reset();
      refresh();
    } else {
      alert('error');
    }
  });
});

// load data on start
refresh();