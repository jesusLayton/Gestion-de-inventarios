
document.getElementById('email').addEventListener('input', function() {
    campo = event.target;
    valido = document.getElementById('emailOK');
        
    emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(campo.value)) {
      valido.innerText = "Email válido";
    } else {
      valido.innerText = "Email incorrecto";
    }
});



document.getElementById('r-password').addEventListener('input', function() {
    pass1 = document.getElementById('pass');
    pass2 = document.getElementById('r-password')
    valido = document.getElementById('passOk');

    if(pass1.value != pass2.value){
        valido.innerText = "Las contraseñas no coinciden, vuelve a intentar.";
        document.getElementById("guardar").disabled = true;
    }else{
        valido.innerText = "Las contraseñas  coinciden.";
        document.getElementById("guardar").disabled = false;
    }

});





