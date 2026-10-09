const stageData={prep1:['أولى إعدادي','علوم','محتوى علوم أولى إعدادي سيضاف درسًا درسًا من الكتاب.'],prep2:['تانية إعدادي','علوم','محتوى علوم تانية إعدادي سيضاف درسًا درسًا من الكتاب.'],prep3:['تالتة إعدادي','علوم','محتوى علوم تالتة إعدادي سيضاف درسًا درسًا من الكتاب.'],sec1:['أولى ثانوي','علوم متكاملة','محتوى العلوم المتكاملة سيضاف درسًا درسًا من الكتاب.'],sec2:['تانية ثانوي','فيزياء','شرح الفيزياء والقوانين والمذكرات والاختبارات.'],sec3:['تالتة ثانوي','فيزياء','محتوى فيزياء تالتة ثانوي سيضاف درسًا درسًا من الكتاب.']};
const gradeKey=new URLSearchParams(location.search).get('grade')||'sec2';
const info=stageData[gradeKey]||stageData.sec2;
document.getElementById('stageTitle').textContent=info[0];
document.getElementById('stageType').textContent=info[1];
document.getElementById('stageDesc').textContent=info[2];
const container=document.getElementById('subjects');
const fallback=gradeKey==='sec2'?[['الحركة والسرعة','شرح الدرس ومذكرة PDF','lesson2.html'],['القياس الفيزيائي','شرح الدرس ومذكرة PDF','lesson1.html'],['القوانين والاختبارات','منصة الفيزياء الكاملة','index.html#formulas']]:[];
function render(items){if(!items.length){container.innerHTML='<article class="card"><h3>المحتوى الدراسي</h3><p>سيظهر هنا الدروس التي يضيفها المدرس لهذا الصف.</p><span class="tag">قريبًا</span></article>';return}container.innerHTML=items.map(function(x){const title=x.title||x[0],description=x.description||x[1],url=x.lesson_url||x[2];return '<article class="card"><h3>'+title+'</h3><p>'+description+'</p>'+(url?'<a class="btn" href="'+url+'">فتح المحتوى ←</a>':'<span class="tag">قريبًا</span>')+'</article>'}).join('')}
render(fallback);
fetch(window.SUPABASE_URL+'/rest/v1/lessons?grade=eq.'+encodeURIComponent(gradeKey)+'&published=eq.true&select=title,description,lesson_url&order=id.asc',{headers:{apikey:window.SUPABASE_ANON_KEY}}).then(function(r){return r.ok?r.json():Promise.reject(r)}).then(function(rows){if(rows.length)render(rows)}).catch(function(){});

