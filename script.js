/* === State === */
const state = {
  currentScreen: 1,
  student: {
    nombre: '',
    grado: '',
    institucion: '',
    area: '',
    docente: ''
  },
  answers: {
  q3: null,
  q4: null,
  q5: null,
  q6: [],
  q7: null,
  q8: null,
  q9: null
},
  phrase: '',
  commitment: '',
  screensCompleted: {}
};

/* === DOM refs === */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* === Navigation === */
function showScreen(num) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + num);
  if (el) el.classList.add('active');
  state.currentScreen = num;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goNext(nextNum) {
  showScreen(nextNum);
  if (nextNum === 10) populateEvidence();
}

/* === Feedback helpers === */
function showFeedback(id, message, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = 'feedback-general visible ' + type;
}

function hideFeedback(id) {
  const el = document.getElementById(id);
  if (el) {
    el.className = 'feedback-general';
    el.textContent = '';
  }
}

function showFieldFeedback(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = 'feedback-field visible';
}

function hideFieldFeedback(id) {
  const el = document.getElementById(id);
  if (el) {
    el.className = 'feedback-field';
    el.textContent = '';
  }
}

function unlockContinueButton(screenNumber) {
  const screen = document.querySelector(`#screen-${screenNumber}`);
  if (!screen) return;

  const continueButton = screen.querySelector('.btn-continue');
  if (continueButton) {
    continueButton.classList.remove('hidden');
    continueButton.classList.remove('is-locked');
  }
}

function lockContinueButton(screenNumber) {
  const screen = document.querySelector(`#screen-${screenNumber}`);
  if (!screen) return;

  const continueButton = screen.querySelector('.btn-continue');
  if (continueButton) {
    continueButton.classList.add('hidden');
    continueButton.classList.add('is-locked');
  }
}

/* === Screen 1: Welcome === */
document.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  if (!action) return;

  switch (action) {
    case 'go-to-2': goNext(2); break;
    case 'go-to-4': goNext(4); break;
    case 'go-to-5': goNext(5); break;
    case 'go-to-6': goNext(6); break;
    case 'go-to-7': goNext(7); break;
    case 'go-to-8': goNext(8); break;
    case 'go-to-9': goNext(9); break;
    case 'go-to-10': goNext(10); break;
  }
});

/* === Screen 2: Registration === */
$('#form-registro').addEventListener('submit', (e) => {
  e.preventDefault();
  hideFeedback('feedback-registro');
  ['nombre','grado','institucion','docente'].forEach(f => hideFieldFeedback('feedback-' + f));

  const nombre = $('#input-nombre').value.trim();
  const grado = $('#input-grado').value.trim();
  const institucion = $('#input-institucion').value.trim();
  const area = $('#input-area').value.trim();
  const docente = $('#input-docente').value.trim();

  let valid = true;

  if (!nombre || nombre.split(' ').length < 2) {
    showFieldFeedback('feedback-nombre', 'Escribí tu nombre completo para que tu certificado final salga correctamente.');
    valid = false;
  }
  if (!grado) {
    showFieldFeedback('feedback-grado', 'Completá tu grado y tu institución educativa. Estos datos ayudan a identificar tu recorrido de aprendizaje.');
    valid = false;
  }
  if (!institucion) {
    showFieldFeedback('feedback-institucion', 'Completá tu grado y tu institución educativa. Estos datos ayudan a identificar tu recorrido de aprendizaje.');
    valid = false;
  }
  if (!docente) {
    showFieldFeedback('feedback-docente', 'Completá tu docente.');
    valid = false;
  }

  if (!valid) {
    showFeedback('feedback-registro', 'Revisá tus datos antes de continuar. Necesitamos esta información para preparar tu evidencia final como Patrullero Verde.', 'error');
    return;
  }

  state.student.nombre = nombre;
  state.student.grado = grado;
  state.student.institucion = institucion;
  state.student.area = area;
  state.student.docente = docente;

  state.screensCompleted[2] = true;
  goNext(3);
});

/* === Screen 3: Question (protagonist) === */
document.querySelector('[data-action="check-q3"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q3');
  const selected = document.querySelector('input[name="q3"]:checked');
  if (!selected) {
  showFeedback('feedback-q5', 'Seleccioná una respuesta antes de comprobar.', 'warning');
  lockContinueButton(3);
  return;
}
  state.answers.q3 = selected.value;
  const correct = selected.value === 'basura';
  state.screensCompleted.q3correct = correct;

  const options = document.querySelectorAll('#screen-3 input[name="q3"]');
  options.forEach(o => {
  const label = o.closest('.option');
  label.classList.remove('correct', 'incorrect');

  if (correct && o.value === 'basura') {
    label.classList.add('correct');
  }

  if (!correct && o.checked) {
    label.classList.add('incorrect');
  }
});

  if (correct) {
    showFeedback('feedback-q3', 'Muy bien. Sebastián se preocupó porque el barrio estaba sucio: había basura en las calles, bolsas rotas y papeles que llegaban hasta el parque. Reconocer el problema es el primer paso para poder ayudar.', 'success');
    state.screensCompleted[3] = true;
    unlockContinueButton(3);
} else {
    showFeedback('feedback-q3', 'Pensalo otra vez. En el fragmento se cuenta  que los vecinos notaron basura en las calles, que los perros rompían las bolsas y que el viento llevaba papeles hasta el parque. Volvé a leer esa parte y fijate qué situación afectaba al barrio.', 'error');
  state.screensCompleted[3] = false;
  lockContinueButton(3);
}
});

/* === Screen 4: Question (problem) === */
document.querySelector('[data-action="check-q4"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q4');
  const selected = document.querySelector('input[name="q4"]:checked');
  if (!selected) {
  showFeedback('feedback-q5', 'Seleccioná una respuesta antes de comprobar.', 'warning');
  lockContinueButton(4);
  return;
}
  state.answers.q4 = selected.value;
  const correct = selected.value === 'basura';
  state.screensCompleted.q4correct = correct;

  const options = document.querySelectorAll('#screen-4 input[name="q4"]');
  options.forEach(o => {
  const label = o.closest('.option');
  label.classList.remove('correct', 'incorrect');

  if (correct && o.value === 'basura') {
    label.classList.add('correct');
  }

  if (!correct && o.checked) {
    label.classList.add('incorrect');
  }
});

  if (correct) {
    showFeedback('feedback-q4', 'Correcto. El barrio estaba sucio porque había basura en las calles y papeles en el parque.', 'success');
    state.screensCompleted[4] = true;
    unlockContinueButton(4);
  } else {
    showFeedback('feedback-q4', 'Observá nuevamente la imagen y recordá el inicio del cuento. El problema no eran las flores ni el frío: los vecinos estaban preocupados porque había basura en las calles y papeles en el parque.', 'error');
    state.screensCompleted[4] = false;
    lockContinueButton(4);
}
});

/* === Screen 5: Question (decision) === */
document.querySelector('[data-action="check-q5"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q5');
  const selected = document.querySelector('input[name="q5"]:checked');
  if (!selected) {
  showFeedback('feedback-q5', 'Seleccioná una respuesta antes de comprobar.', 'warning');
  lockContinueButton(5);
  return;
}
  state.answers.q5 = selected.value;
  const correct = selected.value === 'equipo';
  state.screensCompleted.q5correct = correct;

  const options = document.querySelectorAll('#screen-5 input[name="q5"]');
  options.forEach(o => {
  const label = o.closest('.option');
  label.classList.remove('correct', 'incorrect');

  if (correct && o.value === 'equipo') {
    label.classList.add('correct');
  }

  if (!correct && o.checked) {
    label.classList.add('incorrect');
  }
});

  if (correct) {
    showFeedback('feedback-q5', 'Excelente decisión. Los problemas ambientales se resuelven mejor cuando las personas trabajan juntas.', 'success');
    state.screensCompleted[5] = true;
    unlockContinueButton(5);
    } else {
    showFeedback('feedback-q5', 'Probá otra vez. Quejarse o tirar más basura no ayuda a resolver el problema. Sebastián necesitaba buscar una acción positiva, invitar a otros y empezar a cuidar el barrio en equipo.', 'error');
    state.screensCompleted[5] = false;
    lockContinueButton(5);
}
});

/* === Screen 6: Multi-select === */
const CORRECT_ACTIONS = ['separar','no-desperdiciar','carteles','limpieza','plantas'];
const INCORRECT_ACTIONS = ['tirar-papeles','romper-bolsas','canillas','ensuciar'];

document.querySelector('[data-action="check-q6"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q6');
  const checkboxes = document.querySelectorAll('#q6-options input[type="checkbox"]');
  const selected = [];
  checkboxes.forEach(cb => { if (cb.checked) selected.push(cb.value); });

  if (selected.length === 0) {
    showFeedback('feedback-q6', 'Elegí al menos una acción antes de comprobar.', 'warning');
    lockContinueButton(6);
    return;
  }

  state.answers.q6 = selected;

  const correctSelected = selected.filter(v => CORRECT_ACTIONS.includes(v));
  const incorrectSelected = selected.filter(v => INCORRECT_ACTIONS.includes(v));
  const correctNotSelected = CORRECT_ACTIONS.filter(v => !selected.includes(v));

  checkboxes.forEach(cb => {
    const label = cb.closest('.option');
    label.classList.remove('correct','incorrect');
    if (CORRECT_ACTIONS.includes(cb.value) && cb.checked) label.classList.add('correct');
    if (INCORRECT_ACTIONS.includes(cb.value) && cb.checked) label.classList.add('incorrect');
  });

let message = '';
let type = 'warning';

if (correctSelected.length === CORRECT_ACTIONS.length && incorrectSelected.length === 0) {
  message = 'Muy bien. Una Patrulla Verde observa, informa, cuida y actúa.';
  type = 'success';
} else if (incorrectSelected.length > 0 && correctSelected.length === 0) {
  message = 'Cuidado: las acciones elegidas hacen daño al barrio. Tirar papeles, romper bolsas, dejar canillas abiertas o ensuciar el parque no son acciones de una Patrulla Verde.';
  type = 'error';
} else if (incorrectSelected.length > 0) {
  message = 'Cuidado: algunas opciones hacen daño al barrio. Revisá tus elecciones y quedate con las acciones que ayudan a limpiar, cuidar el agua, informar a los vecinos y proteger las plantas.';
  type = 'error';
} else if (correctSelected.length > 0 && correctNotSelected.length > 0) {
  message = 'Vas bien. Las acciones que elegiste ayudan al barrio, pero todavía podés sumar más acciones positivas para completar la Patrulla Verde.';
  type = 'warning';
} else {
  message = 'Elegí las acciones que ayudan a cuidar el barrio.';
  type = 'warning';
}

showFeedback('feedback-q6', message, type);

const allCorrectSelected = correctSelected.length === CORRECT_ACTIONS.length;
const noIncorrectSelected = incorrectSelected.length === 0;

if (allCorrectSelected && noIncorrectSelected) {
  state.screensCompleted[6] = true;
  unlockContinueButton(6);
} else {
  state.screensCompleted[6] = false;
  lockContinueButton(6);
}
});

/* === Screen 7: Phrase === */
document.querySelector('[data-action="save-q7"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q7');

  const customText = $('#input-frase-propia').value.trim();
  const phrase = customText;

  if (!phrase) {
    showFeedback(
      'feedback-q7',
      'Antes de continuar, escribí una frase para cuidar el barrio o el ambiente.',
      'warning'
    );
    state.screensCompleted[7] = false;
    lockContinueButton(7);
    return;
  }

  if (phrase.length < 10) {
    showFeedback(
      'feedback-q7',
      'Tu frase puede ser más clara. Intentá escribir un mensaje un poco más completo.',
      'warning'
    );
    state.screensCompleted[7] = false;
    lockContinueButton(7);
    return;
  }

  const environmentalWords = [
    'ambiente',
    'ambiental',
    'barrio',
    'basura',
    'residuo',
    'residuos',
    'reciclar',
    'reciclaje',
    'agua',
    'canilla',
    'plantas',
    'árbol',
    'arbol',
    'árboles',
    'arboles',
    'naturaleza',
    'planeta',
    'verde',
    'limpio',
    'limpieza',
    'cuidar',
    'cuidado',
    'contaminación',
    'contaminacion',
    'comunidad',
    'escuela',
    'reutilizar',
    'separar'
  ];

  const normalizedPhrase = phrase.toLowerCase();

  const hasEnvironmentalMeaning = environmentalWords.some((word) =>
    normalizedPhrase.includes(word)
  );

  if (!hasEnvironmentalMeaning) {
    showFeedback(
      'feedback-q7',
      'Tu frase puede estar más relacionada con la misión. Probá escribir un mensaje sobre cuidar el ambiente, el agua, las plantas, separar residuos, mantener limpio el barrio o ayudar a la comunidad.',
      'warning'
    );
    state.screensCompleted[7] = false;
    lockContinueButton(7);
    return;
  }

  state.phrase = phrase;
  state.answers.q7 = phrase;
  state.screensCompleted[7] = true;

  showFeedback(
    'feedback-q7',
    'Muy buena frase. Los mensajes ambientales ayudan a que más personas recuerden la importancia de cuidar el barrio y el ambiente.',
    'success'
  );

  unlockContinueButton(7);
});

/* === Screen 8: Question (why changed) === */
document.querySelector('[data-action="check-q8"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q8');
  const selected = document.querySelector('input[name="q8"]:checked');
  if (!selected) {
  showFeedback('feedback-q5', 'Seleccioná una respuesta antes de comprobar.', 'warning');
  lockContinueButton(8);
  return;
}
  state.answers.q8 = selected.value;
  const correct = selected.value === 'todos';
  state.screensCompleted.q8correct = correct;

  const options = document.querySelectorAll('#screen-8 input[name="q8"]');
  options.forEach(o => {
  const label = o.closest('.option');
  label.classList.remove('correct', 'incorrect');

  if (correct && o.value === 'todos') {
    label.classList.add('correct');
  }

  if (!correct && o.checked) {
    label.classList.add('incorrect');
  }
});

  if (correct) {
    showFeedback('feedback-q8', 'Muy bien. El barrio cambió porque Sebastián, sus amigos y los vecinos se organizaron para cuidarlo.', 'success');
    state.screensCompleted[8] = true;
    unlockContinueButton(8);
    } else {
    showFeedback('feedback-q8', 'Pensalo otra vez. El barrio no cambió por magia ni porque una sola persona hizo todo. Cambió porque Sebastián, sus amigos y los vecinos trabajaron juntos para limpiar y cuidar el lugar.', 'error');
    state.screensCompleted[8] = false;
    lockContinueButton(8);
}
});

/* === Screen 9: Commitment === */
document.querySelector('[data-action="save-q9"]')?.addEventListener('click', () => {
  hideFeedback('feedback-q9');

  const commitment = $('#input-compromiso').value.trim();

  if (!commitment) {
    showFeedback(
      'feedback-q9',
      'Antes de terminar, escribí tu compromiso ambiental.',
      'warning'
    );
    state.screensCompleted[9] = false;
    lockContinueButton(9);
    return;
  }

  if (commitment.length < 12) {
    showFeedback(
      'feedback-q9',
      'Tu compromiso puede ser más claro. Escribí una acción concreta que puedas hacer para cuidar el ambiente.',
      'warning'
    );
    state.screensCompleted[9] = false;
    lockContinueButton(9);
    return;
  }

  const normalizedCommitment = commitment
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const environmentalWords = [
    'ambiente',
    'ambiental',
    'barrio',
    'basura',
    'residuo',
    'residuos',
    'reciclar',
    'reciclaje',
    'agua',
    'canilla',
    'plantas',
    'arbol',
    'arboles',
    'naturaleza',
    'planeta',
    'verde',
    'limpio',
    'limpieza',
    'contaminacion',
    'comunidad',
    'escuela',
    'reutilizar',
    'separar',
    'materiales',
    'energia',
    'luz',
    'papeles',
    'plastico',
    'botellas'
  ];

  const actionWords = [
    'cuidar',
    'cerrar',
    'separar',
    'reciclar',
    'reutilizar',
    'limpiar',
    'levantar',
    'juntar',
    'tirar',
    'no tirar',
    'ahorrar',
    'apagar',
    'plantar',
    'regar',
    'proteger',
    'ayudar',
    'invitar',
    'mantener',
    'usar menos',
    'evitar',
    'reducir'
  ];

  const hasEnvironmentalMeaning = environmentalWords.some((word) =>
    normalizedCommitment.includes(word)
  );

  const hasConcreteAction = actionWords.some((word) =>
    normalizedCommitment.includes(word)
  );

  if (!hasEnvironmentalMeaning) {
    showFeedback(
      'feedback-q9',
      'Tu compromiso tiene que estar relacionado con la misión. Probá escribir una acción sobre cuidar el ambiente, ahorrar agua, separar residuos, limpiar el barrio, cuidar plantas o evitar la contaminación.',
      'warning'
    );
    state.screensCompleted[9] = false;
    lockContinueButton(9);
    return;
  }

  if (!hasConcreteAction) {
    showFeedback(
      'feedback-q9',
      'Tu compromiso necesita una acción concreta. Podés empezar con: “Me comprometo a cuidar...”, “Me comprometo a separar...”, “Me comprometo a cerrar...”, “Me comprometo a limpiar...”',
      'warning'
    );
    state.screensCompleted[9] = false;
    lockContinueButton(9);
    return;
  }

  state.commitment = commitment;
  state.answers.q9 = commitment;
  state.screensCompleted[9] = true;

  showFeedback(
    'feedback-q9',
    'Excelente compromiso. Elegiste una acción concreta para cuidar la casa, la escuela, el barrio o el planeta.',
    'success'
  );

  unlockContinueButton(9);
});

/* === Screen 10: Evidence === */
function populateEvidence() {
  const s = state.student;
  $('#ev-nombre').textContent = s.nombre || '—';
  $('#ev-grado').textContent = s.grado || '—';
  $('#ev-institucion').textContent = s.institucion || '—';
  $('#ev-docente').textContent = s.docente || '—';
  $('#ev-fecha').textContent = new Date().toLocaleDateString('es-AR');
  $('#ev-compromiso').textContent = state.commitment || '—';
  $('#ev-frase').textContent = state.phrase || '—';
}

document.querySelector('[data-action="download-evidence"]')?.addEventListener('click', () => {
  const s = state.student;
  if (!s.nombre || !state.commitment) {
    showFeedback('feedback-q10', 'Para descargar tu evidencia final, revisá que hayas completado tu nombre y tu compromiso ambiental.', 'error');
    return;
  }
  showFeedback('feedback-q10', 'Felicitaciones. Completaste la misión y ya sos parte de la Patrulla Verde.', 'success');

  const date = new Date().toLocaleDateString('es-AR');
  const logoUrl = new URL('assets/logos/LogoHDC.jpg', window.location.href).href;
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Certificado - Patrulla Verde</title>
<style>
  body { font-family: 'Segoe UI', sans-serif; padding: 2rem; max-width: 700px; margin: auto; color: #1b4332; }
  .cert { border: 4px solid #2d6a4f; border-radius: 16px; padding: 2rem; text-align: center; }
  .cert-logo { width: 110px; height: auto; margin-bottom: 1rem; }
  h1 { color: #1b4332; font-size: 1.75rem; margin-bottom: 0.5rem; }
  h2 { color: #2d6a4f; font-size: 1.2rem; }
  .data { text-align: left; margin: 1.5rem 0; }
  .data p { margin: 0.3rem 0; }
  .frase { font-style: italic; color: #2d6a4f; margin: 1rem 0; }
  .compromiso { background: #d8f3dc; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
</style></head>
<body>
<div class="cert">
  <img class="cert-logo" src="${logoUrl}" alt="Asociación Huella de Carbono">
  <h1>Misión Patrulla Verde</h1>
  <h2>Certificado de Patrullero Verde</h2>
  <p>Se reconoce a <strong>${s.nombre}</strong> por completar la misión y aprender que cuidar el ambiente empieza con pequeñas acciones realizadas en comunidad.</p>
  <div class="data">
    <p><strong>Grado:</strong> ${s.grado}</p>
    <p><strong>Institución:</strong> ${s.institucion}</p>
    <p><strong>Docente:</strong> ${s.docente}</p>
    <p><strong>Fecha:</strong> ${date}</p>
  </div>
  ${state.phrase ? `<div class="frase">"${state.phrase}"</div>` : ''}
  <div class="compromiso"><strong>Mi compromiso:</strong> ${state.commitment}</div>
  <p>Gracias por cuidar el ambiente. ¡Seguí siendo parte del cambio!</p>
</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Certificado_Patrulla_Verde_${s.nombre.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

document.querySelector('[data-action="print-evidence"]')?.addEventListener('click', () => {
  window.print();
});

/* === Keyboard / Enter support for forms === */
$('#input-frase-propia')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.querySelector('[data-action="save-q7"]')?.click();
  }
});

$('#input-compromiso')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    document.querySelector('[data-action="save-q9"]')?.click();
  }
});

/* === Load screen images from assets/images === */
function loadScreenImages() {
  document.querySelectorAll('.img-placeholder[data-img]').forEach((box) => {
    const fileName = box.dataset.img;
    const imagePath = `assets/images/${fileName}`;

    box.style.backgroundImage = `linear-gradient(rgba(27, 67, 50, 0.08), rgba(27, 67, 50, 0.08)), url("${imagePath}")`;
    box.classList.add('has-image');

    const span = box.querySelector('span');
    if (span) {
      span.classList.add('visually-hidden');
    }
  });
}

loadScreenImages();

/* === Init: show screen 1 === */
showScreen(1);
