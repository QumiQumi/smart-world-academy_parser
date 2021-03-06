"use strict";

$(document).ready(function () {
	let files = [];
	addFilesChangeEventListener();
	addButtonClearListener();
	addSubmitListener();

	// Кнопка очистки
	function addButtonClearListener() {
		$("#button-clear").click(function (event) {
			event.preventDefault();
			$("#fields").empty();
			$("#buttons").empty();
			$("#refs").empty();
			$("#fields").text("Выберите файл для создания формы");
		});
	}

	// Действия при отправке формы с селектом
	function addSubmitListener() {
		$("#select-form").submit((event) => {
			event.preventDefault();
			let select = $("#select");
			let span = $(".input-files").children("span");
			span.removeClass("input-files__input-warn");
			span.addClass("input-files__input-hidden");

			if (select.val() == null) {
				span.addClass("input-files__input-warn");
				span.removeClass("input-files__input-hidden");
				return;
			}
			let file = files.find((file) => file.name == select.val());
			makeForm(file);
		});
	}

	// Создание формы из файла
	function makeForm(file) {
		makeButtons(file.buttons);
		makeFields(file.fields);
		makeRefs(file.references);
		//Парсит поле buttons
		function makeButtons(buttonsArray) {
			let buttonsForm = $("#buttons");
			buttonsForm.empty();
			if (buttonsArray == null) return;
			buttonsArray.forEach((button) => {
				buttonsForm.append($("<button/>").text(button.text));
			});
			return true;
		}
		//Парсит поле fields
		function makeFields(fieldsArray) {
			let fieldsForm = $("#fields");
			fieldsForm.empty();
			if (fieldsArray == null) return;

			fieldsArray.forEach((field, i) => {
				let needCheckboxes = false;
				let checkboxArray = [];

				for (let key in field.input) {
					if (Array.isArray(field.input[key]) && key != "filetype") {
						needCheckboxes = true;
						checkboxArray = field.input[key];
					}
				}
				if (!needCheckboxes) {
					let className =
						field.label == null
							? "fields__line-center"
							: "fields__line";
					if (field.input.type == "checkbox")
						className = "fields__line-left";

					$("<div>")
						.attr({ class: className })
						.append(function () {
							if (field.label != null)
								return $("<label/>")
									.text(field.label)
									.attr({ for: "input-" + i });
						})
						.append(function () {
							if (field.input.type == "file")
								return $("<label>")
									.text("Выберете файл(ы)")
									.attr({
										for: "input-" + i,
										class: "input-file",
									});
						})
						.append(() => {
							let filetypes =
								field.input.filetype != null
									? field.input.filetype.map((i) => "." + i)
									: "";
							let inputType =
								field.input.mask != null
									? "text"
									: field.input.type;
							let maxLength =
								field.input.mask != null
									? field.input.mask.length
									: "";
							let placeholder;
							if (
								field.input.placeholder == null &&
								field.input.mask != null
							)
								placeholder = field.input.mask;
							else placeholder = field.input.placeholder;

							if (field.input.type == "textarea")
								return $("<textarea>").attr({
									required: field.input.required,
									placeholder: placeholder,
									id: "input-" + i,
								});

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
						})
						.appendTo(fieldsForm);
				}
				// Проверка - Есть ли чекбоксы в инпуте
				// если в field.input есть массив (не filetype) - значит это чекбоксы
				else {
					let checkboxes = $("<div>")
						.attr({
							class: "fields__checkboxes",
						})
						.append(
							$("<div>")
								.text(field.label)
								.attr({ class: "fields__line" })
						);
					let classForLabel =
						field.input.type == "color" ? "fields__color" : "";
					let inputType =
						field.input.type == "color" ? "radio" : "checkbox";

					checkboxArray.forEach((element) => {
						let labelText =
							field.input.type == "color" ? "" : element;
						checkboxes.append(
							$("<div>")
								.attr({ class: "fields__checkbox" })

								.append(
									$("<input/>").attr({
										type: inputType,
										name: "checkbox" + i,
										id: element,
										value: element,
									})
								)
								.append(
									$("<label/>")
										.attr({
											for: element,
											class: classForLabel,
										})
										.append(
											$("<span>").text(labelText).css({
												"background-color": element,
											})
										)
								)
						);
					});
					fieldsForm.append(checkboxes);
				}
			});
			addKeypressMaskListeners();
			// Обработка маски input
			function addKeypressMaskListeners() {
				$("input[mask]")
					.keydown(function (e) {
						let key = e.key;
						let input = $(this);
						let mask = $(this).attr("mask");
						let currentSymbol = input.val().length;
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
						);
					})
					.bind("focus click", function () {
						let input = $(this);
						let mask = $(this).attr("mask");
						let currentSymbol = input.val().length;

						if (
							input.val().length === 0 &&
							mask[currentSymbol] != 9
						) {
							addMaskSymbol(input, mask, currentSymbol);
						} else {
							let val = input.val();
							input.val("").val(val); // Ensure cursor remains at the end
						}
					});

				// рекурсивно добавляем значения из маски в инпут
				function addMaskSymbol(input, mask, currentSymbol) {
					let value = mask[currentSymbol];
					input.val(input.val() + value);

					if (
						mask[currentSymbol + 1] != 9 &&
						mask[currentSymbol + 1] != null
					)
						addMaskSymbol(input, mask, currentSymbol + 1);
				}
			}
		}
		//Парсит поле references
		function makeRefs(refsArray) {
			let refsForm = $("#refs");
			refsForm.empty();
			if (refsArray == null) return;
			let refsLine = $("<div>").attr({ class: "refs__line" });
			refsArray.forEach((ref, i) => {
				refsLine.append(function () {
					if (ref.input != null) {
						return $("<input/>").attr({
							type: ref.input.type,
							required: ref.input.required,
							checked: ref.input.checked,
							id: "input-ref",
						});
					} else {
						return $("<label>")
							.attr({ for: "input-ref" })
							.append($("<span>").text(ref["text without ref"]))
							.append(
								$("<a>").text(ref.text).attr({ href: ref.ref })
							);
					}
				});
			});
			refsForm.append(refsLine);
		}
	}

	// Заполняет Дропдаун файлами
	function fillDropdown() {
		$("#select").empty();
		for (let i = 0; i < files.length; i++) {
			$("#select").append(
				$("<option>").text(files[i].name).val(files[i].name)
			);
		}
	}

	// Считывает файлы с input и выводит их в select
	function addFilesChangeEventListener() {
		$("#input-files").change(function () {
			let upload = $(this).get(0).files;
			$("#select").empty();
			files = [];
			for (let i = 0; i < upload.length; i++) {
				getFile(upload[i]);
			}
			fillDropdown(files);
		});
	}

	// Считывает выбранные файлы в селект
	function getFile(upload) {
		try {
			let reader = new FileReader();
			reader.onload = function () {
				let json = JSON.parse(reader.result);
				files.push(json);
				$("#select").append(
					$("<option>").text(json.name).val(json.name)
				);
			};
			reader.readAsText(upload);
		} catch (error) {
			console.log(error);
		}
	}
});
