"use strict";
// import "./styles/style.scss";
// import addpost from "./json/addpost.js";
// import colorsheme from "./json/colorsheme.js";
// import interview from "./json/interview.js";
// import signin from "./json/signin.js";
// import signup from "./json/signup.js";

var files = [
	{
		name: "addpost",
		fields: [
			{
				label: "Title",
				input: {
					type: "text",
					required: true,
				},
			},
			{
				label: "Description",
				input: {
					type: "textarea",
					required: true,
				},
			},
			{
				label: "Image",
				input: {
					type: "file",
					required: true,
				},
			},
			{
				label: "Publish Date",
				input: {
					type: "date",
					required: true,
				},
			},
			{
				label: "Author",
				input: {
					type: "text",
				},
			},
		],
		references: [
			{
				input: {
					type: "checkbox",
					required: true,
					checked: "false",
				},
			},
			{
				"text without ref": "View Author Post",
				text: "View Author Post",
				ref: "viewauthor",
			},
		],
		buttons: [
			{
				text: "Create Post",
			},
		],
	},
	{
		name: "website_color_scheme",
		fields: [
			{
				label: "Choose color scheme",
				input: {
					type: "color",
					colors: ["#3366ff", "#009933", "#990033", "#996633"],
				},
			},
			{
				input: {
					type: "checkbox",
					checked: "false",
				},
				label: "Turn on dark theme?",
			},
		],
	},
	{
		name: "interview",
		fields: [
			{
				label: "Введите своё ФИО",
				input: {
					type: "text",
					required: true,
					placeholder: "Иванов Иван Иванович",
				},
			},
			{
				label: "Введите Номер телефона",
				input: {
					type: "number",
					required: true,
					mask: "+7 (999) 99-99-999",
				},
			},
			{
				label: "Введите свою Почту",
				input: {
					type: "email",
					required: true,
					placeholder: "example@mail.com",
				},
			},
			{
				label: "Введите свой возраст",
				input: {
					type: "number",
					required: true,
				},
			},
			{
				label: "Введите вашу специальность",
				input: {
					type: "text",
					required: true,
				},
			},
			{
				label: "Выберете технологии, с которыми вы работали",
				input: {
					type: "technology",
					required: true,
					technologies: [
						"PHP",
						"JS",
						"Laravel",
						"Express.js",
						"Yii2",
						"HTML",
						"CSS",
						"Java",
					],
					multiple: true,
				},
			},
			{
				label: "Ваш срок работы",
				input: {
					type: "number",
					required: true,
				},
			},
			{
				label: "Ваша фотография",
				input: {
					type: "file",
					required: true,
				},
			},
			{
				label: "Серия, номер",
				input: {
					type: "number",
					required: true,
					mask: "99-99 999999",
				},
			},
			{
				label: "Код подразделения",
				input: {
					type: "number",
					required: true,
					mask: "999-999",
				},
			},
			{
				label: "Скан / Фото паспорта (1 страница)",
				input: {
					type: "file",
					required: true,
					multiple: true,
					filetype: ["png", "jpeg", "pdf"],
				},
			},
			{
				label: "Расскажите немного о себе",
				input: {
					type: "textarea",
					"required:": true,
				},
			},
		],
		references: [
			{
				input: {
					type: "checkbox",
					required: true,
					checked: "false",
				},
			},
			{
				"text without ref": "I accept the",
				text: "Terms & Conditions",
				ref: "termsandconditions",
			},
		],
		buttons: [
			{
				text: "Send",
			},
			{
				text: "Cancel",
			},
		],
	},
	{
		name: "login",
		fields: [
			{
				label: "Enter your login or email",
				input: {
					type: "text",
					required: true,
					placeholder: "login or email",
				},
			},
			{
				label: "Enter your password",
				input: {
					type: "password",
					required: true,
					placeholder: "password",
				},
			},
		],
		references: [
			{
				text: "Forgot password?",
				ref: "rememberpassword",
			},
			{
				text: "Create new account",
				ref: "signup",
			},
		],
		buttons: [
			{
				text: "Login",
			},
		],
	},
	{
		name: "register",
		fields: [
			{
				input: {
					type: "text",
					required: true,
					placeholder: "Enter full name",
				},
			},
			{
				input: {
					type: "email",
					required: true,
					placeholder: "Enter email",
				},
			},
			{
				input: {
					type: "password",
					required: true,
					placeholder: "password",
				},
			},
			{
				input: {
					type: "password",
					required: true,
					placeholder: "Confirm password",
				},
			},
		],
		references: [
			{
				"text without ref": "Already have account?",
				text: "Login",
				ref: "signin",
			},
		],
		buttons: [
			{
				text: "Sign Up",
			},
		],
	},
];
var fileNames = getFileNames(files);

fillDropdown();

///////////////////
makeFields(files.find((file) => file.name == "interview").fields);
////////////////////////

$("#input-form").submit((event) => {
	event.preventDefault();
	var select = $("#select");
	var file = files.find((file) => file.name == select.val());
	makeButtons(file.buttons);
	makeFields(file.fields);
	makeRefs(file.references);
});

//Парсит поле buttons
function makeButtons(buttonsArray) {
	var buttonsForm = $("#buttons");
	buttonsForm.empty();
	if (buttonsArray == null) return;
	buttonsArray.forEach((button) => {
		buttonsForm.append($("<button/>").text(button.text));
	});
	return true;
}
//Парсит поле fields
function makeFields(fieldsArray) {
	var fieldsForm = $("#fields");
	fieldsForm.empty();
	if (fieldsArray == null) return;

	fieldsArray.forEach((field, i) => {
		$("<div>")
			.attr({ class: "fields__line" })
			.append(
				$("<label/>")
					.text(field.label)
					.attr({ for: "input-" + i })
			)

			.append(() => {
				var needCheckboxes = false;
				var checkboxArray = [];

				for (var key in field.input) {
					if (Array.isArray(field.input[key]) && key != "filetype") {
						needCheckboxes = true;
						checkboxArray = field.input[key];
					}
				}
				// если в field.input есть массив - значит это чекбоксы
				if (needCheckboxes) {
					var checkboxes = $("<div>").attr({
						class: "fields__checkboxes",
					});
					var classForLabel = (field.input.type = "color"
						? "fields__color"
						: "");

					checkboxArray.forEach((element) => {
						checkboxes.append(
							$("<div>")
								.attr({ class: "fields__line" })
								.append(
									$("<input/>").attr({
										type: "checkbox",
										name: "checkbox" + i,
										id: element,
									})
								)
								.append(
									$("<label/>")
										.attr({
											for: element,
											class: classForLabel,
										})
										.append(
											$("<span>").text(element).css({
												"background-color": element,
											})
										)
								)
						);
					});
					return checkboxes;
				} else {
					var filetypes =
						field.input.filetype != null
							? field.input.filetype.map((i) => "." + i)
							: "";
					var inputType =
						field.input.mask != null ? "text" : field.input.type;
					var maxLength =
						field.input.mask != null ? field.input.mask.length : "";
					var placeholder;
					if (
						field.input.placeholder == null &&
						field.input.mask != null
					)
						placeholder = field.input.mask;
					else placeholder = field.input.placeholder;
					return $("<input/>").attr({
						type: inputType,
						required: field.input.required,
						placeholder: placeholder,
						multiple: field.input.multiple,
						mask: field.input.mask,
						accept: filetypes,
						id: "input-" + i,
						maxlength: maxLength,
						minlength: maxLength,
						min: "0",
					});
				}
			})
			.appendTo(fieldsForm);
	});
	addKeypressMaskListeners();
}
//Парсит поле references
function makeRefs(refsArray) {
	var refsForm = $("#refs");
	refsForm.empty();
	if (refsArray == null) return;
	var refsLine = $("<div>").attr({ class: "refs__line" });
	refsArray.forEach((ref, i) => {
		refsLine.append(function () {
			if (ref.input != null) {
				return $("<input/>").attr({
					type: ref.input.type,
					required: ref.input.required,
					checked: ref.input.checked,
					id: "input-" + i,
				});
			} else {
				return $("<label>")
					.attr({ for: "input-" + i })
					.append($("<span>").text(ref["text without ref"]))
					.append($("<a>").text(ref.text).attr({ href: ref.ref }));
			}
		});
	});
	refsForm.append(refsLine);
}
// Обработка маски input
function addKeypressMaskListeners() {
	$("input[mask]")
		.keydown(function (e) {
			var key = e.key; //which || e.charCode || e.keyCode || 0;
			var input = $(this);
			var mask = $(this).attr("mask");
			var currentSymbol = input.val().length;
			// Если в маске не 9 и нажат символ то добавляем в инпут значение из маски
			if (
				mask[currentSymbol] != 9 &&
				key !== "Backspace" &&
				key !== "Tab" &&
				key !== "Delete" &&
				input.val().length < mask.length
			) {
				addMaskSymbol(input, mask, currentSymbol);
			}
			// Allow numeric (and tab, backspace, delete) keys only
			return (
				key == "Backspace" ||
				key == "Tab" ||
				key == "Delete" ||
				(key >= 0 && key <= 9)
				// key == 8 ||
				// key == 9 ||
				// key == 46 ||
				// (key >= 48 && key <= 57) ||
				// (key >= 96 && key <= 105)
			);
		})
		.bind("focus click", function () {
			var input = $(this);
			var mask = $(this).attr("mask");
			var currentSymbol = input.val().length;

			if (input.val().length === 0 && mask[currentSymbol] != 9) {
				addMaskSymbol(input, mask, currentSymbol);
			} else {
				var val = input.val();
				input.val("").val(val); // Ensure cursor remains at the end
			}
		});

	// рекурсивно добавляем значения из маски в инпут
	function addMaskSymbol(input, mask, currentSymbol) {
		var value = mask[currentSymbol];
		input.val(input.val() + value);

		if (mask[currentSymbol + 1] != 9 && mask[currentSymbol + 1] != null)
			addMaskSymbol(input, mask, currentSymbol + 1);
	}
}

// Заполняет Дропдаун файлами
function fillDropdown() {
	fileNames.forEach((name) => {
		$("#select").append(
			$("<option>")
				.text(name + ".json")
				.val(name)
		);
	});
}

// Получают файлы
function getFileNames(files) {
	var fileNames = [];
	files.forEach((file) => {
		fileNames.push(file.name);
	});
	return fileNames;
}

function getFiles() {
	var files = new Map();
	files.set(addpost.name, addpost);
	files.set(colorsheme.name, colorsheme);
	files.set(interview.name, interview);
	files.set(signin.name, signin);
	files.set(signup.name, signup);
	return files;
}
