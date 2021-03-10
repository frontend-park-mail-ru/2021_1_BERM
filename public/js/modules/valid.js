export default {
 runValid () {
	'use strict';

	let root = document.getElementById('root')

	let form = document.getElementById('feedback');
	let mailprov = document.getElementById('email')



	if (!form) return;


	let	elements	= form.querySelectorAll('.form-control'),
		btn			= document.getElementById('send_mess'),
		patternName	= /^[а-яёА-ЯЁ\s]+$/,
		patternMail	= /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
		patternSpam	= /[^\<\>\[\]%\&'`]+$/,
		patternLog = /^[a-zA-Z0-9]{0,19}$/, 
		patternPhone = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,  
		patternPassword = /([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/,
		patternPrice = /^[0-9]+$/,
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
			'Плохой пароль',  // 12
			'Введите цену в рублях',  // 13
		],
		iserror		= false;

	btn.addEventListener('click', validForm);
	form.addEventListener('focus', function() {
		let el = document.activeElement;
		if (el !== btn) {
			cleanError(el);
			cleanValid(el);
		} 
	}, true);

	function validForm(e) {
		e.preventDefault();
		let formVal = getFormData(form),
			error;

		for (let property in formVal) {
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
		let error = '',
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
			'subject': function() {
				if (formVal.subject.length == 0) {
					error = errorMess[4];
				} else if (patternSpam.test(formVal.subject) == false) {
					error = errorMess[6];
				}
			},
			'textmess': function() {
				if (formVal.textmess.length == 0) {
					error = errorMess[5];
				} else if (patternSpam.test(formVal.textmess) == false) {
					error = errorMess[6];
				}
			},
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
			'price': function() {
				if (formVal.price.length == 0 || patternPrice.test(formVal.price) == false) {
					error = errorMess[13];
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
			let formElement = e.target,
				property = formElement.getAttribute('name'),
				dataField = {};

			dataField[property] = formElement.value;

			let error = getError(dataField, property);
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
		console.log("KOKOKO")
		console.log(error)
		
		
		let formElement = form.querySelector('[name=' + property + ']')
		let errorBox	= formElement.parentElement.nextElementSibling;
		console.log(errorBox)

		formElement.classList.add('form-control_error');
		errorBox.innerHTML = error;
		errorBox.style.display = 'block';
	}

	function showValid(property) {
		let formElement = form.querySelector('[name=' + property + ']'),
			validBox	= formElement.parentElement.nextElementSibling;
			console.log("VALID BOX = ",  validBox)

		formElement.classList.add('form-control_valid');
		validBox.innerHTML = "";
		validBox.style.display = 'block';
	}

	function cleanError(el) {
		let errorBox = el.parentElement.nextElementSibling;
		errorBox.innerHTML = ""
		el.classList.remove('form-control_error');
		errorBox.removeAttribute('style');
	}

	function cleanValid(el) {
		let validBox = el.parentElement.nextElementSibling;
		console.log("ASDSDAASSADADSS")
		console.log(validBox)
		validBox.innerHTML = ""
		console.log("ASDSDSADSDAASDDSA")
		el.classList.remove('form-control_valid');
		validBox.removeAttribute('style');
	}

	function getFormData(form) {
		let controls = {};
		if (!form.elements) return '';
		for (var i = 0, ln = form.elements.length; i < ln; i++) {
			var element = form.elements[i];
			if (element.tagName.toLowerCase() !== 'button') {
				controls[element.name]= element.value;
			}
		}
		return controls;
	}

}}; 