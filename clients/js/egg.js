/*function validation(){
    let form = document.getElementById("formGroup");
    let email = document.getElementById('exampleInputEmail1').value;
    let email_prop = document.getElementById('exampleInputEmail1');
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    let text = document.getElementById('emailHelp');
    if(email.match(pattern)){
      form.classList.add("valid");
      form.classList.remove("Invalid");
      text.innerHTML= "Email id is valid";
      text.style.color = "green";
      email_prop.className = "form-control shadow border-success rounded";
      //email.style.borderColor = '#FF0000';
      //email.style.boxShadow = '1px 1px 1px 1px#FF0000';
    }
    else{
      form.classList.add("Invalid");
      form.classList.remove("valid");
      text.innerHTML= "Email id is invalid";
      text.style.color = "red";
      email_prop.className = "form-control shadow border-danger rounded";
      //email.style.borderColor = '#7CFC00';
      //email.style.boxShadow = '#7CFC00';
    }
    text.innerHTML = "";
  }*/
  /*function hideGetIn(){
    document.getElementById('ModalGetIn').style.display = 'none';
  }*/

  let emailValidation1 = document.getElementById('exampleInputEmail1');
  let emailValidation2 = document.getElementById('exampleInputEmail2');
  //console.log(emailValidation);
  //console.log(emailValidation.value);
  emailValidation1.addEventListener('blur',emailVadidator);
  emailValidation2.addEventListener('blur',emailVadidator);

  
  function emailVadidator(e){
    let form = document.getElementById("formGroup");
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    var text = document.getElementById(e.target.parentElement.lastElementChild.id);
    console.log(text);
    if(e.target.value.match(pattern)){
        //form.classList.add("valid");
        //form.classList.remove("Invalid");
        //email_prop.className = "form-control shadow border-success rounded";
        //email.style.borderColor = '#FF0000';
        //email.style.boxShadow = '1px 1px 1px 1px#FF0000';
        text.style.display = 'none';
      }
      else{
        //form.classList.add("Invalid");
        //form.classList.remove("valid");
        text.innerHTML= "You Entered an Invalid E-mail Address";
        text.style.display = 'block';
        
        //text.style.color = "red";
        //email_prop.className = "form-control shadow border-danger rounded";
        //email.style.borderColor = '#7CFC00';
        //email.style.boxShadow = '#7CFC00';
      }
  }
let passwordValidation = document.getElementById('exampleInputPassword1');
passwordValidation.addEventListener('blur',passwordValidator);

let confirmPasswordValidation = document.getElementById('exampleInputConfirmPassword1');
confirmPasswordValidation.addEventListener('blur',confirmPasswordValidator);

function confirmPasswordValidator(e){
    var password = passwordValidation.value;
    var text = document.getElementById(e.target.parentElement.lastElementChild.id);
    console.log(password);
    console.log(confirmPasswordValidation.value);
    if(!password.localeCompare(confirmPasswordValidation.value)){
        text.innerHTML = '';
        text.style.display = 'none';
    }
    else{
        text.innerHTML = 'Password is not matched';
        text.style.display = 'block';
    }
}

function passwordValidator(e){
    var error="";
    let password = passwordValidation.value;
    console.log(password.length);
    var text = document.getElementById(e.target.parentElement.lastElementChild.id);
    if( password.length < 8){
        error = "You password is less than 8 characters";
    }
    else{
        var regex = /^(?=.*[a-z]).+$/; // Lowercase character pattern
        if( !regex.test(password) ) {
            error = "Please include a Lower ase character in your password";
        }
        var regex = /^(?=.*[A-Z]).+$/; // Uppercase character pattern
        if( !regex.test(password) ) {
            error = "Please include a Upper case character in your password";
        }
        var regex = /^(?=.*[0-9_\W]).+$/; // Special character or number pattern

            if( !regex.test(password) ) {
                error = "Please include a special character in your password";
            }
    }
    if(error){
        text.innerHTML = error;
        text.style.display = '';
    }
    else{
        text.innerHTML = '';
        text.style.display = 'none';
    }    
}

$(".dropdown-menu li a").click(function (e) {
    e.preventDefault()
    var selText = $(this).text();
    $(this).parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
});
