document.addEventListener('DOMContentLoaded',function(){const allowed=localStorage.getItem('portalRole')==='teacher'&&localStorage.getItem('portalUser')==='verb9004@gmail.com'&&localStorage.getItem('portalToken');if(!allowed)location.replace('login.html');});

