const btnTogle = document.querySelector(".toggle-btn");
btnTogle.addEventListener('click', function(){
    document.getElementById('sidebar').classList.toggle('active');
});