(function () {
	const script = document.createElement("script");
	script.src =
		"https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";
	document.body.appendChild(script);

	setTimeout(() => {
		faker.seed(23);

		const container = document.querySelector(".Firestore-actions");

		const btn = document.createElement("button");
		btn.innerHTML = "Add 100 Users";
		btn.className = "mdc-button mdc-button--unelevated";
		btn.onclick = async () => {
			Array(100)
				.fill(0)
				.forEach((_) => {
					firestore
						.collection("users")
						.add(faker.helpers.createCard());
				});
		};

		container.appendChild(btn);
	}, 2000);
})();
