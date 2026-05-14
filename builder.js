// Global Resume Data State
let resumeData = {
  personal: { name: '', title: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', summary: '', photo: '' },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certs: [],
  projects: [],
  awards: []
};

// UI Elements
const els = {
  tplSelect: document.getElementById('sel-template'),
  colPrimary: document.getElementById('col-primary'),
  colAccent: document.getElementById('col-accent'),
  fontSelect: document.getElementById('sel-font'),
  a4Page: document.getElementById('a4-page'),
  saveBadge: document.getElementById('save-status'),
  btnPrint: document.getElementById('btn-print'),
  btnPdf: document.getElementById('btn-pdf'),
  photoInput: document.getElementById('photo-input'),
  uploadZone: document.getElementById('upload-zone'),
  uploadThumb: document.getElementById('upload-thumb'),
  uploadInner: document.getElementById('upload-inner')
};

// Auto-save logic
let saveTimer;
function triggerSave() {
  els.saveBadge.textContent = "Saving...";
  els.saveBadge.style.color = "rgba(255,255,255,0.8)";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('resumeAI_data', JSON.stringify(resumeData));
    localStorage.setItem('resumeAI_settings', JSON.stringify({
      template: els.tplSelect.value,
      primary: els.colPrimary.value,
      accent: els.colAccent.value,
      font: els.fontSelect.value
    }));
    els.saveBadge.textContent = "● Saved";
    els.saveBadge.style.color = "#22c55e";
    renderPreview();
  }, 800);
}

// ── FORM ACCORDION ──
document.querySelectorAll('.card-hdr').forEach(hdr => {
  hdr.addEventListener('click', () => {
    const body = hdr.nextElementSibling;
    const isOpen = hdr.classList.contains('open');
    document.querySelectorAll('.card-hdr').forEach(h => {
      h.classList.remove('open');
      h.nextElementSibling.classList.add('collapsed');
    });
    if (!isOpen) {
      hdr.classList.add('open');
      body.classList.remove('collapsed');
    }
  });
});

// ── DATA BINDING ──
function bindPersonalInput(id, key) {
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener('input', (e) => {
    resumeData.personal[key] = e.target.value;
    triggerSave();
  });
}

bindPersonalInput('f-name', 'name');
bindPersonalInput('f-title', 'title');
bindPersonalInput('f-email', 'email');
bindPersonalInput('f-phone', 'phone');
bindPersonalInput('f-location', 'location');
bindPersonalInput('f-website', 'website');
bindPersonalInput('f-linkedin', 'linkedin');
bindPersonalInput('f-github', 'github');
bindPersonalInput('f-summary', 'summary');

// ── DYNAMIC SECTIONS ──
function createEntryBlock(type, index, data, fieldsHTML) {
  const block = document.createElement('div');
  block.className = 'entry-block';
  block.innerHTML = `
    <button class="del-btn" onclick="removeEntry('${type}', ${index})" title="Remove">×</button>
    ${fieldsHTML}
  `;
  // Add listeners to new inputs
  block.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const field = e.target.dataset.field;
      resumeData[type][index][field] = e.target.value;
      triggerSave();
    });
  });
  return block;
}

// Experience
function renderExpList() {
  const list = document.getElementById('exp-list');
  list.innerHTML = '';
  resumeData.experience.forEach((exp, i) => {
    list.appendChild(createEntryBlock('experience', i, exp, `
      <div class="row2">
        <div class="fg"><label>Role / Title</label><input type="text" data-field="role" value="${exp.role||''}"/></div>
        <div class="fg"><label>Company</label><input type="text" data-field="company" value="${exp.company||''}"/></div>
      </div>
      <div class="row2">
        <div class="fg"><label>Start Date</label><input type="text" data-field="start" placeholder="Jan 2020" value="${exp.start||''}"/></div>
        <div class="fg"><label>End Date</label><input type="text" data-field="end" placeholder="Present" value="${exp.end||''}"/></div>
      </div>
      <div class="fg"><label>Description (Bullet points)</label><textarea data-field="desc" placeholder="- Achieved X by doing Y...">${exp.desc||''}</textarea></div>
    `));
  });
}
document.getElementById('add-exp').addEventListener('click', () => {
  resumeData.experience.push({ role: '', company: '', start: '', end: '', desc: '' });
  renderExpList();
  triggerSave();
});

// Education
function renderEduList() {
  const list = document.getElementById('edu-list');
  list.innerHTML = '';
  resumeData.education.forEach((edu, i) => {
    list.appendChild(createEntryBlock('education', i, edu, `
      <div class="row2">
        <div class="fg"><label>Degree / Program</label><input type="text" data-field="degree" value="${edu.degree||''}"/></div>
        <div class="fg"><label>Institution</label><input type="text" data-field="school" value="${edu.school||''}"/></div>
      </div>
      <div class="row2">
        <div class="fg"><label>Year</label><input type="text" data-field="year" placeholder="2020 - 2024" value="${edu.year||''}"/></div>
        <div class="fg"><label>GPA / Grade</label><input type="text" data-field="grade" placeholder="3.8/4.0" value="${edu.grade||''}"/></div>
      </div>
    `));
  });
}
document.getElementById('add-edu').addEventListener('click', () => {
  resumeData.education.push({ degree: '', school: '', year: '', grade: '' });
  renderEduList();
  triggerSave();
});

// Skills
function renderSkillList() {
  const list = document.getElementById('skill-list');
  list.innerHTML = '';
  resumeData.skills.forEach((sk, i) => {
    const div = document.createElement('div');
    div.className = 'skill-row';
    div.innerHTML = `
      <input type="text" value="${sk.name||''}" placeholder="E.g. JavaScript" oninput="updateArr('skills', ${i}, 'name', this.value)"/>
      <input type="range" min="10" max="100" step="5" value="${sk.level||80}" oninput="updateArr('skills', ${i}, 'level', this.value); this.nextElementSibling.textContent=this.value+'%'"/>
      <span class="lvl">${sk.level||80}%</span>
      <button class="del-btn" style="position:static;width:auto;padding:0 8px" onclick="removeEntry('skills', ${i})">×</button>
    `;
    list.appendChild(div);
  });
}
document.getElementById('add-skill').addEventListener('click', () => {
  resumeData.skills.push({ name: '', level: 80 });
  renderSkillList();
  triggerSave();
});

// Simple List Helper for Langs, Certs, Projects, Awards
function renderSimpleList(type, id) {
  const list = document.getElementById(id);
  list.innerHTML = '';
  resumeData[type].forEach((item, i) => {
    list.appendChild(createEntryBlock(type, i, item, `
      <div class="fg"><label>Item Name</label><input type="text" data-field="name" value="${item.name||''}"/></div>
      <div class="fg"><label>Additional Details (Optional)</label><input type="text" data-field="detail" value="${item.detail||''}"/></div>
    `));
  });
}

function renderProjList() {
  const list = document.getElementById('proj-list');
  list.innerHTML = '';
  resumeData.projects.forEach((item, i) => {
    list.appendChild(createEntryBlock('projects', i, item, `
      <div class="fg"><label>Project Name</label><input type="text" data-field="name" value="${item.name||''}"/></div>
      <div class="fg"><label>Description (Bullet points)</label><textarea data-field="detail" placeholder="- Developed X using Y...">${item.detail||''}</textarea></div>
    `));
  });
}

document.getElementById('add-lang').addEventListener('click', () => { resumeData.languages.push({name:'', detail:''}); renderSimpleList('languages', 'lang-list'); triggerSave(); });
document.getElementById('add-cert').addEventListener('click', () => { resumeData.certs.push({name:'', detail:''}); renderSimpleList('certs', 'cert-list'); triggerSave(); });
document.getElementById('add-proj').addEventListener('click', () => { resumeData.projects.push({name:'', detail:''}); renderProjList(); triggerSave(); });
document.getElementById('add-award').addEventListener('click', () => { resumeData.awards.push({name:'', detail:''}); renderSimpleList('awards', 'award-list'); triggerSave(); });

window.updateArr = function(type, index, field, val) {
  resumeData[type][index][field] = val;
  triggerSave();
}
window.removeEntry = function(type, index) {
  resumeData[type].splice(index, 1);
  if(type==='experience') renderExpList();
  else if(type==='education') renderEduList();
  else if(type==='skills') renderSkillList();
  else if(type==='languages') renderSimpleList('languages', 'lang-list');
  else if(type==='certs') renderSimpleList('certs', 'cert-list');
  else if(type==='projects') renderProjList();
  else if(type==='awards') renderSimpleList('awards', 'award-list');
  triggerSave();
}

// ── PHOTO CROPPER ──
let cropper = null;
const cropModal = document.getElementById('crop-modal');
const cropSrc = document.getElementById('crop-src');

els.photoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if(file) {
    const reader = new FileReader();
    reader.onload = (re) => {
      cropSrc.src = re.target.result;
      cropModal.classList.add('open');
      if(cropper) cropper.destroy();
      cropper = new Cropper(cropSrc, { aspectRatio: 1, viewMode: 1, dragMode: 'move', autoCropArea: 1, restore: false, guides: true, center: true, highlight: false, cropBoxMovable: true, cropBoxResizable: true, toggleDragModeOnDblclick: false });
    };
    reader.readAsDataURL(file);
  }
});

document.querySelectorAll('#btn-remove-photo').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resumeData.personal.photo = '';
    els.uploadThumb.src = '';
    els.uploadThumb.style.display = 'none';
    els.uploadInner.style.display = 'block';
    els.photoInput.value = '';
    document.querySelectorAll('#btn-remove-photo').forEach(b => b.style.display = 'none');
    triggerSave();
  });
});

document.getElementById('crop-close').addEventListener('click', () => cropModal.classList.remove('open'));
document.getElementById('crop-cancel').addEventListener('click', () => cropModal.classList.remove('open'));

document.getElementById('zoom-slider').addEventListener('input', e => cropper && cropper.zoomTo(e.target.value));
document.getElementById('zoom-in').addEventListener('click', () => cropper && cropper.zoom(0.1));
document.getElementById('zoom-out').addEventListener('click', () => cropper && cropper.zoom(-0.1));
document.getElementById('rot-l').addEventListener('click', () => cropper && cropper.rotate(-90));
document.getElementById('rot-r').addEventListener('click', () => cropper && cropper.rotate(90));
let flipX = 1, flipY = 1;
document.getElementById('flip-h').addEventListener('click', () => { flipX = -flipX; cropper && cropper.scaleX(flipX); });
document.getElementById('flip-v').addEventListener('click', () => { flipY = -flipY; cropper && cropper.scaleY(flipY); });
document.getElementById('crop-reset').addEventListener('click', () => cropper && cropper.reset());

document.querySelectorAll('.rbtn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.rbtn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(cropper) {
      let r = parseFloat(btn.dataset.ratio);
      cropper.setAspectRatio(isNaN(r) ? NaN : r);
      if(btn.dataset.ratio === 'circle') {
        document.querySelector('.cropper-view-box').style.borderRadius = '50%';
        document.querySelector('.cropper-face').style.borderRadius = '50%';
      } else {
        document.querySelector('.cropper-view-box').style.borderRadius = '0';
        document.querySelector('.cropper-face').style.borderRadius = '0';
      }
    }
  });
});

document.getElementById('crop-apply').addEventListener('click', () => {
  if(!cropper) return;
  const canvas = cropper.getCroppedCanvas({ width: 400, height: 400, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' });
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  resumeData.personal.photo = dataUrl;
  els.uploadThumb.src = dataUrl;
  els.uploadThumb.style.display = 'block';
  els.uploadInner.style.display = 'none';
  document.querySelectorAll('#btn-remove-photo').forEach(b => b.style.display = 'block');
  cropModal.classList.remove('open');
  triggerSave();
});

// ── THEME & SETTINGS ──
function applySettings() {
  const root = document.documentElement;
  root.style.setProperty('--r-primary', els.colPrimary.value);
  root.style.setProperty('--r-accent', els.colAccent.value);
  root.style.setProperty('--resume-font', els.fontSelect.value);
  triggerSave();
}
els.colPrimary.addEventListener('input', applySettings);
els.colAccent.addEventListener('input', applySettings);
els.fontSelect.addEventListener('change', applySettings);
els.tplSelect.addEventListener('change', triggerSave);

// ── RENDER ENGINE ──
function renderPreview() {
  const tpl = els.tplSelect.value;
  let html = '';
  const pd = resumeData.personal;
  const liSVG = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.1em;height:1.1em;vertical-align:-0.125em;"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
  const ghSVG = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:1.1em;height:1.1em;vertical-align:-0.125em;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;
  
  const contactHTML = `
    ${pd.email ? `<div class="r-contact-item"><div class="r-contact-icon">✉</div><div class="r-contact-text">${pd.email}</div></div>` : ''}
    ${pd.phone ? `<div class="r-contact-item"><div class="r-contact-icon">☎</div><div class="r-contact-text">${pd.phone}</div></div>` : ''}
    ${pd.location ? `<div class="r-contact-item"><div class="r-contact-icon">📍</div><div class="r-contact-text">${pd.location}</div></div>` : ''}
    ${pd.website ? `<div class="r-contact-item"><div class="r-contact-icon">🌐</div><div class="r-contact-text">${pd.website.replace(/^https?:\/\//,'')}</div></div>` : ''}
    ${pd.linkedin ? `<div class="r-contact-item"><div class="r-contact-icon">${liSVG}</div><div class="r-contact-text">${pd.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//,'').replace(/\/$/,'')}</div></div>` : ''}
    ${pd.github ? `<div class="r-contact-item"><div class="r-contact-icon">${ghSVG}</div><div class="r-contact-text">${pd.github.replace(/^https?:\/\/(www\.)?github\.com\//,'').replace(/\/$/,'')}</div></div>` : ''}
  `;

  const skillsHTML = resumeData.skills.map(s => `
    <div class="r-skill-item">
      <div class="r-skill-name"><span>${s.name}</span><span>${s.level}%</span></div>
      <div class="r-skill-bar"><div class="r-skill-fill" style="width:${s.level}%"></div></div>
    </div>
  `).join('');

  const expHTML = resumeData.experience.map(e => `
    <div class="r-exp-block">
      <div style="display:flex;justify-content:space-between;align-items:flex-end">
        <div>
          <div class="r-exp-role">${e.role}</div>
          <div class="r-exp-company">${e.company}</div>
        </div>
        <div class="r-exp-date">${e.start} - ${e.end}</div>
      </div>
      ${e.desc ? `<ul class="r-exp-bullets">${e.desc.split('\n').map(d=>`<li>${d.replace(/^- /,'')}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const eduHTML = resumeData.education.map(e => `
    <div class="r-edu-block">
      <div class="r-edu-degree">${e.degree}</div>
      <div class="r-edu-school">${e.school}</div>
      <div class="r-edu-meta">
        ${e.year ? `<span>🗓 ${e.year}</span>` : ''}
        ${e.grade ? `<span>★ ${e.grade}</span>` : ''}
      </div>
    </div>
  `).join('');

  const langsHTML = resumeData.languages.map(l => `
    <div class="r-lang-item">
      <div class="r-lang-name">${l.name}</div>
      ${l.detail ? `<div class="r-lang-level">${l.detail}</div>` : ''}
    </div>
  `).join('');

  const certsHTML = resumeData.certs.map(c => `
    <div class="r-cert-item">
      <div class="r-cert-dot"></div>
      <div class="r-cert-text">
        <strong>${c.name}</strong>${c.detail ? ` - ${c.detail}` : ''}
      </div>
    </div>
  `).join('');

  const projsHTML = resumeData.projects.map(p => `
    <div class="r-proj-block">
      <div class="r-proj-title">${p.name}</div>
      ${p.detail ? `<ul class="r-exp-bullets">${p.detail.split('\n').filter(d=>d.trim()).map(d=>`<li>${d.replace(/^- /,'')}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('');

  const awardsHTML = resumeData.awards.map(a => `
    <div class="r-award-item">
      <div class="r-award-icon">🏆</div>
      <div class="r-award-text">
        <div class="award-name">${a.name}</div>
        ${a.detail ? `<div class="award-year">${a.detail}</div>` : ''}
      </div>
    </div>
  `).join('');

  if (tpl === 'executive') {
    html = `
      <div class="tpl-exec">
        <header class="exec-header">
          ${pd.photo ? `<img src="${pd.photo}" class="exec-photo"/>` : `<div class="exec-photo-ph">${pd.name ? pd.name.charAt(0) : ''}</div>`}
          <div>
            <div class="exec-name">${pd.name || 'Your Name'}</div>
            <div class="exec-title">${pd.title || 'Professional Title'}</div>
          </div>
        </header>
        <div class="exec-body">
          <aside class="exec-sidebar">
            <div>
              <div class="r-sec-title">Contact</div>
              ${contactHTML}
            </div>
            ${resumeData.skills.length ? `<div><div class="r-sec-title">Expertise</div>${skillsHTML}</div>` : ''}
            ${resumeData.languages.length ? `<div><div class="r-sec-title">Languages</div>${langsHTML}</div>` : ''}
            ${resumeData.certs.length ? `<div><div class="r-sec-title">Certifications</div>${certsHTML}</div>` : ''}
          </aside>
          <main class="exec-main">
            ${pd.summary ? `<div><div class="r-main-sec-title">Professional Summary</div><div class="r-summary">${pd.summary}</div></div>` : ''}
            ${resumeData.experience.length ? `<div><div class="r-main-sec-title">Experience</div>${expHTML}</div>` : ''}
            ${resumeData.education.length ? `<div><div class="r-main-sec-title">Education</div>${eduHTML}</div>` : ''}
            ${resumeData.projects.length ? `<div><div class="r-main-sec-title">Projects</div>${projsHTML}</div>` : ''}
            ${resumeData.awards.length ? `<div><div class="r-main-sec-title">Awards</div>${awardsHTML}</div>` : ''}
          </main>
        </div>
      </div>
    `;
  } else if (tpl === 'modern') {
    html = `
      <div class="tpl-modern">
        <header class="mod-header">
          <div class="mod-name">${pd.name || 'Your Name'}</div>
          <div class="mod-title">${pd.title || 'Professional Title'}</div>
          <div class="mod-contact-row">
            ${pd.email ? `<div class="mod-contact-item">✉ ${pd.email}</div>` : ''}
            ${pd.phone ? `<div class="mod-contact-item">☎ ${pd.phone}</div>` : ''}
            ${pd.location ? `<div class="mod-contact-item">📍 ${pd.location}</div>` : ''}
            ${pd.website ? `<div class="mod-contact-item">🌐 ${pd.website.replace(/^https?:\/\//,'')}</div>` : ''}
            ${pd.linkedin ? `<div class="mod-contact-item">${liSVG} <span style="margin-left:4px">${pd.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//,'').replace(/\/$/,'')}</span></div>` : ''}
            ${pd.github ? `<div class="mod-contact-item">${ghSVG} <span style="margin-left:4px">${pd.github.replace(/^https?:\/\/(www\.)?github\.com\//,'').replace(/\/$/,'')}</span></div>` : ''}
          </div>
          ${pd.photo ? `<img src="${pd.photo}" class="mod-photo"/>` : ''}
        </header>
        <div class="mod-body">
          <main class="mod-main">
            ${pd.summary ? `<div><div class="r-main-sec-title">About Me</div><div class="r-summary">${pd.summary}</div></div>` : ''}
            ${resumeData.experience.length ? `<div><div class="r-main-sec-title">Experience</div>${expHTML}</div>` : ''}
            ${resumeData.education.length ? `<div><div class="r-main-sec-title">Education</div>${eduHTML}</div>` : ''}
            ${resumeData.projects.length ? `<div><div class="r-main-sec-title">Projects</div>${projsHTML}</div>` : ''}
            ${resumeData.awards.length ? `<div><div class="r-main-sec-title">Awards</div>${awardsHTML}</div>` : ''}
          </main>
          <aside class="mod-aside">
            ${resumeData.skills.length ? `<div><div class="r-sec-title">Skills</div>${skillsHTML}</div>` : ''}
            ${resumeData.languages.length ? `<div><div class="r-sec-title">Languages</div>${langsHTML}</div>` : ''}
            ${resumeData.certs.length ? `<div><div class="r-sec-title">Certifications</div>${certsHTML}</div>` : ''}
          </aside>
        </div>
      </div>
    `;
  } else if (tpl === 'minimal') {
    html = `
      <div class="tpl-min">
        <header class="min-header">
          <div>
            <div class="min-name">${pd.name || 'Your Name'}</div>
            <div class="min-title">${pd.title || 'Professional Title'}</div>
          </div>
          <div class="min-contact-col">
            ${pd.email ? `<div class="min-contact-item">${pd.email}</div>` : ''}
            ${pd.phone ? `<div class="min-contact-item">${pd.phone}</div>` : ''}
            ${pd.location ? `<div class="min-contact-item">${pd.location}</div>` : ''}
            ${pd.website ? `<div class="min-contact-item">${pd.website.replace(/^https?:\/\//,'')}</div>` : ''}
            ${pd.linkedin ? `<div class="min-contact-item">${liSVG} <span style="margin-left:4px">${pd.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//,'').replace(/\/$/,'')}</span></div>` : ''}
            ${pd.github ? `<div class="min-contact-item">${ghSVG} <span style="margin-left:4px">${pd.github.replace(/^https?:\/\/(www\.)?github\.com\//,'').replace(/\/$/,'')}</span></div>` : ''}
          </div>
        </header>
        ${pd.summary ? `<div class="min-sec"><div class="min-sec-title">Profile</div><div class="r-summary">${pd.summary}</div></div>` : ''}
        ${resumeData.experience.length ? `<div class="min-sec"><div class="min-sec-title">Experience</div>${expHTML}</div>` : ''}
        ${resumeData.education.length ? `<div class="min-sec"><div class="min-sec-title">Education</div>${eduHTML}</div>` : ''}
        ${resumeData.projects.length ? `<div class="min-sec"><div class="min-sec-title">Projects</div>${projsHTML}</div>` : ''}
        ${resumeData.skills.length ? `<div class="min-sec"><div class="min-sec-title">Skills</div>${skillsHTML}</div>` : ''}
        ${resumeData.languages.length ? `<div class="min-sec"><div class="min-sec-title">Languages</div>${langsHTML}</div>` : ''}
        ${resumeData.certs.length ? `<div class="min-sec"><div class="min-sec-title">Certifications</div>${certsHTML}</div>` : ''}
        ${resumeData.awards.length ? `<div class="min-sec"><div class="min-sec-title">Awards</div>${awardsHTML}</div>` : ''}
      </div>
    `;
  } else if (tpl === 'creative') {
    html = `
      <div class="tpl-creative">
        <aside class="cr-sidebar">
          ${pd.photo ? `<img src="${pd.photo}" class="cr-photo"/>` : `<div class="cr-photo-ph">${pd.name ? pd.name.charAt(0) : ''}</div>`}
          <div class="cr-name">${pd.name || 'Your Name'}</div>
          <div class="cr-title">${pd.title || 'Professional Title'}</div>
          <div style="margin-top:20px">
            <div class="cr-sec-title">Contact</div>
            ${pd.email ? `<div class="cr-contact-item">✉ ${pd.email}</div>` : ''}
            ${pd.phone ? `<div class="cr-contact-item">☎ ${pd.phone}</div>` : ''}
            ${pd.location ? `<div class="cr-contact-item">📍 ${pd.location}</div>` : ''}
            ${pd.website ? `<div class="cr-contact-item">🌐 ${pd.website.replace(/^https?:\/\//,'')}</div>` : ''}
            ${pd.linkedin ? `<div class="cr-contact-item">${liSVG} <span style="margin-left:4px">${pd.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//,'').replace(/\/$/,'')}</span></div>` : ''}
            ${pd.github ? `<div class="cr-contact-item">${ghSVG} <span style="margin-left:4px">${pd.github.replace(/^https?:\/\/(www\.)?github\.com\//,'').replace(/\/$/,'')}</span></div>` : ''}
          </div>
          ${resumeData.skills.length ? `<div style="margin-top:20px"><div class="cr-sec-title">Skills</div>${skillsHTML}</div>` : ''}
          ${resumeData.languages.length ? `<div style="margin-top:20px"><div class="cr-sec-title">Languages</div>${langsHTML}</div>` : ''}
          ${resumeData.certs.length ? `<div style="margin-top:20px"><div class="cr-sec-title">Certifications</div>${certsHTML}</div>` : ''}
        </aside>
        <main class="cr-main">
          ${pd.summary ? `<div><div class="cr-main-title">Profile</div><div class="r-summary">${pd.summary}</div></div>` : ''}
          ${resumeData.experience.length ? `<div><div class="cr-main-title">Experience</div>${expHTML}</div>` : ''}
          ${resumeData.education.length ? `<div><div class="cr-main-title">Education</div>${eduHTML}</div>` : ''}
          ${resumeData.projects.length ? `<div><div class="cr-main-title">Projects</div>${projsHTML}</div>` : ''}
          ${resumeData.awards.length ? `<div><div class="cr-main-title">Awards</div>${awardsHTML}</div>` : ''}
        </main>
      </div>
      </div>
    `;
  } else if (tpl === 'corporate') {
    html = `
      <div class="tpl-corporate">
        <header class="corp-header">
          <div class="corp-header-left">
            <div class="corp-name">${pd.name || 'Your Name'}</div>
            <div class="corp-title">${pd.title || 'Professional Title'}</div>
          </div>
          <div class="corp-contact-right">
            ${pd.email ? `<div class="corp-contact-item">✉ ${pd.email}</div>` : ''}
            ${pd.phone ? `<div class="corp-contact-item">☎ ${pd.phone}</div>` : ''}
            ${pd.location ? `<div class="corp-contact-item">📍 ${pd.location}</div>` : ''}
            ${pd.website ? `<div class="corp-contact-item">🌐 ${pd.website.replace(/^https?:\/\//,'')}</div>` : ''}
            ${pd.linkedin ? `<div class="corp-contact-item">${liSVG} <span style="margin-left:4px">${pd.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//,'').replace(/\/$/,'')}</span></div>` : ''}
            ${pd.github ? `<div class="corp-contact-item">${ghSVG} <span style="margin-left:4px">${pd.github.replace(/^https?:\/\/(www\.)?github\.com\//,'').replace(/\/$/,'')}</span></div>` : ''}
          </div>
        </header>
        <div class="corp-body">
          <main class="corp-main">
            ${pd.summary ? `<div><div class="corp-sec-title">Professional Summary</div><div class="r-summary">${pd.summary}</div></div>` : ''}
            ${resumeData.experience.length ? `<div><div class="corp-sec-title">Experience</div>${expHTML}</div>` : ''}
            ${resumeData.education.length ? `<div><div class="corp-sec-title">Education</div>${eduHTML}</div>` : ''}
            ${resumeData.projects.length ? `<div><div class="corp-sec-title">Projects</div>${projsHTML}</div>` : ''}
            ${resumeData.awards.length ? `<div><div class="corp-sec-title">Awards</div>${awardsHTML}</div>` : ''}
          </main>
          <aside class="corp-sidebar">
            ${resumeData.skills.length ? `<div><div class="corp-sec-title">Skills</div>${skillsHTML}</div>` : ''}
            ${resumeData.languages.length ? `<div><div class="corp-sec-title">Languages</div>${langsHTML}</div>` : ''}
            ${resumeData.certs.length ? `<div><div class="corp-sec-title">Certifications</div>${certsHTML}</div>` : ''}
          </aside>
        </div>
      </div>
    `;
  } else if (tpl === 'professional') {
    html = `
      <div class="tpl-professional">
        <header class="prof-header">
          ${pd.photo ? `<img src="${pd.photo}" class="prof-photo"/>` : ''}
          <div class="prof-header-text">
            <div class="prof-name">${pd.name || 'Your Name'}</div>
            <div class="prof-title">${pd.title || 'Professional Title'}</div>
            <div class="prof-contact-row">
              ${pd.email ? `<span class="prof-contact-item">✉ ${pd.email}</span>` : ''}
              ${pd.phone ? `<span class="prof-contact-item">☎ ${pd.phone}</span>` : ''}
              ${pd.location ? `<span class="prof-contact-item">📍 ${pd.location}</span>` : ''}
              ${pd.website ? `<span class="prof-contact-item">🌐 ${pd.website.replace(/^https?:\/\//,'')}</span>` : ''}
              ${pd.linkedin ? `<span class="prof-contact-item">${liSVG} <span style="margin-left:2px">${pd.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//,'').replace(/\/$/,'')}</span></span>` : ''}
              ${pd.github ? `<span class="prof-contact-item">${ghSVG} <span style="margin-left:2px">${pd.github.replace(/^https?:\/\/(www\.)?github\.com\//,'').replace(/\/$/,'')}</span></span>` : ''}
            </div>
          </div>
        </header>
        <div class="prof-body">
          ${pd.summary ? `<div class="prof-section"><div class="prof-sec-title">Summary</div><div class="prof-sec-content"><div class="r-summary">${pd.summary}</div></div></div>` : ''}
          ${resumeData.experience.length ? `<div class="prof-section"><div class="prof-sec-title">Experience</div><div class="prof-sec-content">${expHTML}</div></div>` : ''}
          ${resumeData.education.length ? `<div class="prof-section"><div class="prof-sec-title">Education</div><div class="prof-sec-content">${eduHTML}</div></div>` : ''}
          ${resumeData.projects.length ? `<div class="prof-section"><div class="prof-sec-title">Projects</div><div class="prof-sec-content">${projsHTML}</div></div>` : ''}
          ${resumeData.skills.length ? `<div class="prof-section"><div class="prof-sec-title">Skills</div><div class="prof-sec-content">${skillsHTML}</div></div>` : ''}
          ${resumeData.languages.length ? `<div class="prof-section"><div class="prof-sec-title">Languages</div><div class="prof-sec-content">${langsHTML}</div></div>` : ''}
          ${resumeData.certs.length ? `<div class="prof-section"><div class="prof-sec-title">Certifications</div><div class="prof-sec-content">${certsHTML}</div></div>` : ''}
          ${resumeData.awards.length ? `<div class="prof-section"><div class="prof-sec-title">Awards</div><div class="prof-sec-content">${awardsHTML}</div></div>` : ''}
        </div>
      </div>
    `;
  }

  els.a4Page.innerHTML = html || `<div class="preview-placeholder"><div style="font-size:3rem">📄</div><div>Fill in your details to see preview</div></div>`;
}

// ── EXPORT ──
els.btnPrint.addEventListener('click', () => window.print());
els.btnPdf.addEventListener('click', () => window.print());

// ── LANDING PAGE TRANSITION ──
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const isNew = urlParams.get('new') === 'true';
  const tplParam = urlParams.get('template');

  if (isNew) {
    localStorage.removeItem('resumeAI_data');
    localStorage.removeItem('resumeAI_settings');
    window.history.replaceState({}, document.title, window.location.pathname + (tplParam ? `?template=${tplParam}` : ''));
  }

  // Load saved data if any
  const saved = localStorage.getItem('resumeAI_data');
  if(saved) {
    try {
      const parsed = JSON.parse(saved);
      resumeData = { ...resumeData, ...parsed };
      // Populate fields
      ['name','title','email','phone','location','website','linkedin','github','summary'].forEach(k => {
        const el = document.getElementById('f-'+k);
        if(el && resumeData.personal[k]) el.value = resumeData.personal[k];
      });
      if(resumeData.personal.photo) {
        els.uploadThumb.src = resumeData.personal.photo;
        els.uploadThumb.style.display = 'block';
        els.uploadInner.style.display = 'none';
        document.querySelectorAll('#btn-remove-photo').forEach(b => b.style.display = 'block');
      }
    } catch(e){}
  }

  const savedSets = localStorage.getItem('resumeAI_settings');
  if(savedSets) {
    try {
      const sets = JSON.parse(savedSets);
      els.tplSelect.value = tplParam || sets.template || 'executive';
      els.colPrimary.value = sets.primary || '#1a2340';
      els.colAccent.value = sets.accent || '#3b82f6';
      els.fontSelect.value = sets.font || 'Inter';
    } catch(e){}
  } else if (tplParam) {
    els.tplSelect.value = tplParam;
  }
  
  const btnClear = document.getElementById('btn-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all your data?')) {
        localStorage.removeItem('resumeAI_data');
        localStorage.removeItem('resumeAI_settings');
        window.location.reload();
      }
    });
  }

  renderExpList();
  renderEduList();
  renderSkillList();
  renderSimpleList('languages', 'lang-list');
  renderSimpleList('certs', 'cert-list');
  renderProjList();
  renderSimpleList('awards', 'award-list');
  applySettings();
  renderPreview();

  // Attach click events to landing page template buttons
  document.querySelectorAll('.use-template-btn').forEach(btn => {
    const card = btn.closest('.group');
    
    const handleTemplateSelection = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tpl = btn.getAttribute('data-template');
      if (tpl) {
        window.open(`builder.html?template=${tpl}&new=true`, '_blank');
      }
    };

    if (card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', handleTemplateSelection);
    }
    
    btn.addEventListener('click', handleTemplateSelection);
  });

  // Close Builder
  const closeBtn = document.getElementById('btn-close-builder');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeBuilder);
  }
});

function openBuilder() {
  // Hide all children of body except builder container and script/link tags
  document.querySelectorAll('body > :not(#builder-container, script, link, style)').forEach(el => {
    if (el.tagName !== 'SCRIPT' && el.tagName !== 'LINK' && el.tagName !== 'STYLE') {
      el.dataset.originalDisplay = el.style.display;
      el.style.display = 'none';
    }
  });
  
  // Show builder container
  document.getElementById('builder-container').style.display = 'block';
  // Enable builder CSS
  const builderStyle = document.getElementById('builder-style');
  if (builderStyle) builderStyle.disabled = false;
  
  window.scrollTo(0, 0);
  renderPreview();
}

function closeBuilder() {
  // Hide builder container
  document.getElementById('builder-container').style.display = 'none';
  // Disable builder CSS
  const builderStyle = document.getElementById('builder-style');
  if (builderStyle) builderStyle.disabled = true;
  
  // Show all children of body
  document.querySelectorAll('body > :not(#builder-container, script, link, style)').forEach(el => {
    if (el.tagName !== 'SCRIPT' && el.tagName !== 'LINK' && el.tagName !== 'STYLE') {
      el.style.display = el.dataset.originalDisplay || '';
    }
  });
}
