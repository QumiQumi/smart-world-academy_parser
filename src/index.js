"use strict";
import "./styles/style.scss";

import addpost from "./json/addpost.js";
import colorsheme from "./json/colorsheme.js";
import interview from "./json/interview.js";
import signin from "./json/signin.js";
import signup from "./json/signup.js";

var fileNames = getFileNames();
var files = getFiles();
// console.log(fileNames);
// console.log(files);

fillDropdown();

$("#input-form").submit((event) => {
	event.preventDefault();
	var select = $("#select");
	var file = files.get(select.val());
	console.log(file);
	makeButtons(file.buttons);
	makeFields(file.fields);
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

	fieldsArray.forEach((field) => {
		$("<div>")
			.attr({ class: "fields__line" })
			.append($("<label/>").text(field.label))
			.append(() => {
				var needCheckboxes = false;
				var checkboxArray = [];

				for (var key in field.input) {
					if (Array.isArray(field.input[key])) {
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
										name: "checkbox",
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
					return $("<input/>").attr({
						type: field.input.type,
						required: field.input.required,
						placeholder: field.input.placeholder,
						multiple: field.input.multiple,
						mask: field.input.mask,
						filetype: field.input.filetype,
					});
				}
			})
			.appendTo(fieldsForm);
	});
}

function fillDropdown() {
	fileNames.forEach((name) => {
		$("#select").append(
			$("<option>")
				.text(name + ".json")
				.val(name)
		);
	});
}

function getFileNames() {
	var fileNames = [];
	fileNames.push(addpost.name);
	fileNames.push(colorsheme.name);
	fileNames.push(interview.name);
	fileNames.push(signin.name);
	fileNames.push(signup.name);
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
