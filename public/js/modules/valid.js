export default {
 runValid () {
	'use strict';

	let root = document.getElementById('root')
	// console.log(root.innerHTML)

	var form = document.getElementById('feedback');
	let mailprov = document.getElementById('email')
	//console.log(form)

	//console.log('----------------------------------')
	if (!form) return;
	//console.log('----------------------------------')

	var	elements	= form.querySelectorAll('.form-control'),
		btn			= document.getElementById('send_mess'),
		patternName	= /^[а-яёА-ЯЁ\s]+$/,
		patternMail	= /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
		patternSpam	= /[^\<\>\[\]%\&'`]+$/,
		patternLog = /^[a-zA-Z0-9]{0,19}$/, 
		patternPhone = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,  
		patternPassword = /([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/,
		errorMess	= [
			'Незаполненное поле ввода', // 0
			'Введите имя на кириллице', // 1
			'Укажите Вашу электронную почту', // 2
			'Неверный формат электронной почты', // 3
			'Укажите тему сообщения', // 4
			'Напишите текст сообщения', // 5
			'Ваше сообщение похоже на спам, уберите специальные символы.', // 6
			'Неподходящий логин', // 7
			'Введите фамилию на кириллице', // 8
			'Ваше сообщение похоже на спам, уберите специальные символы.', // 9
			'Выберите специальность из списка', // 10
			'Неверный формат телефонного номера', // 11
			'Плохой пароль'  // 12
		],
		iserror		= false;

	btn.addEventListener('click', validForm);
	form.addEventListener('focus', function() {
		var el = document.activeElement;
		if (el !== btn) {
			cleanError(el);
			cleanValid(el);
		} 
	}, true);

	function validForm(e) {
		e.preventDefault();
		var formVal = getFormData(form),
			error;

		for (var property in formVal) {
			error = getError(formVal, property);
			if (error.length != 0) {
				iserror = true;
				showError(property, error);
			} else if (error.length == 0) {
				console.log("URRRRRRRRRAAAAAAAAAAAAAAAAAAAA")
				console.log("PROVEKRA AAAA", property)
				showValid(property)
			}
		}



		if (!iserror) {
			sendFormData(formVal);
		}
		return false;
	}

	function getError(formVal, property) {
		// console.log(formVal)
		// console.log(property)
		var error = '',
			validate = {
			'username': function() {
				if (formVal.username.length == 0 || patternLog.test(formVal.username) == false) {
					error = errorMess[7];
				}
			},
			'usermail': function() {
				if (formVal.usermail.length == 0) {
					error = errorMess[2];
				} else if (patternMail.test(formVal.usermail) == false) {
					error = errorMess[3];
				}
			},
			// 'subject': function() {
			// 	if (formVal.subject.length == 0) {
			// 		error = errorMess[4];
			// 	} else if (patternSpam.test(formVal.subject) == false) {
			// 		error = errorMess[6];
			// 	}
			// },
			// 'textmess': function() {
			// 	if (formVal.textmess.length == 0) {
			// 		error = errorMess[5];
			// 	} else if (patternSpam.test(formVal.textmess) == false) {
			// 		error = errorMess[6];
			// 	}
			// },
			'firstName': function() {
				if (formVal.firstName.length == 0 || patternName.test(formVal.firstName) == false) {
					error = errorMess[1];
				}
			},
			'lastName': function() {
				if (formVal.lastName.length == 0 || patternName.test(formVal.lastName) == false) {
					error = errorMess[8];
				}
			},
			'list1': function() {
				if (formVal.list1 == 0) {
					error = errorMess[10];
				}
			},
			'phone': function() {
				if (formVal.phone.length == 0 || patternPhone.test(formVal.phone) == false) {
					error = errorMess[11];
				}
			},
			'password': function() {
				if (formVal.password.length == 0 || patternPassword.test(formVal.password) == false) {
					error = errorMess[12];
				}
			},
		};
		// console.log('----------------------------------')
		// console.log(property)
		validate[property]();
		return error;
	}

	[].forEach.call(elements, function(element) {
		element.addEventListener('blur', function(e) {
			var formElement = e.target,
				property = formElement.getAttribute('name'),
				dataField = {};

			dataField[property] = formElement.value;

			var error = getError(dataField, property);
			if (error.length != 0) {
				showError(property, error);
			} else if (error.length == 0) {
				console.log("URRRRRRRRRAAAAAAAAAAAAAAAAAAAA")
				console.log("PROVEKRA AAAA", property)
				showValid(property)
			}
			return false;
		});
	});

	function showError(property, error) {
		console.log(error)
		var formElement = form.querySelector('[name=' + property + ']'),
			errorBox	= formElement.parentElement.nextElementSibling;
		console.log(errorBox)

		formElement.classList.add('form-control_error');
		errorBox.innerHTML = error;
		errorBox.style.display = 'block';
	}

	function showValid(property) {
		var formElement = form.querySelector('[name=' + property + ']'),
			validBox	= formElement.parentElement.nextElementSibling;
			console.log("VALID BOX = ",  validBox)

		formElement.classList.add('form-control_valid');
		validBox.innerHTML = "";
		validBox.style.display = 'block';
	}

	function cleanError(el) {
		// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
		// console.log(el)
		// console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
		//el.innerHTML = ""
		var errorBox = el.parentElement.nextElementSibling;
		// console.log("ЖОПень С МОТОРЧИКОМ")
		// console.log(errorBox)
		errorBox.innerHTML = ""
		// console.log("ЖОПень С МОТОРЧИКОМ")
		el.classList.remove('form-control_error');
		errorBox.removeAttribute('style');
	}

	function cleanValid(el) {
		console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
		console.log(el)
		console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
		//el.innerHTML = ""
		var validBox = el.parentElement.nextElementSibling;
		console.log("ASDSDAASSADADSS")
		console.log(validBox)
		validBox.innerHTML = ""
		console.log("ASDSDSADSDAASDDSA")
		el.classList.remove('form-control_valid');
		validBox.removeAttribute('style');
	}

	function getFormData(form) {
		var controls = {};
		if (!form.elements) return '';
		for (var i = 0, ln = form.elements.length; i < ln; i++) {
			var element = form.elements[i];
			if (element.tagName.toLowerCase() !== 'button') {
				controls[element.name]= element.value;
			}
		}
		return controls;
	}

	function sendFormData(formVal) {
		var xhr 	= new XMLHttpRequest(),
			body 	= 'username=' + encodeURIComponent(formVal.username) +
					  '&usermail=' + encodeURIComponent(formVal.usermail) +
					  '&subject=' + encodeURIComponent(formVal.subject) +
					  '&textmess=' + encodeURIComponent(formVal.textmess);

		xhr.open('POST', '/sendmail.php', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.setRequestHeader('Cache-Control', 'no-cache');

		xhr.onreadystatechange = function() {
			// callback
		}

		xhr.send(body);
	}
}}; 