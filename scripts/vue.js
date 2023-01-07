const ifYouWant = new Vue({
	el: "#vue-app-context", // this is the scope it will 'watch'

	data: function () { // "live" (watched for changes/updated) data
		return {
			username: "",
			message: "",
			outputStyle: "none",
		};
	},

	methods: {
		update(event) {
			event.preventDefault();
			if (this.username) {
				this.outputStyle = "yay";
				this.message = `Hello, ${this.username}, nice to meet you!`;
			} else {
				this.outputStyle = "nay";
				this.message = "Please enter your name";
			}
		}
	},

	computed: {
		anAutomaticallUpdatedProperty() {
			// mmmmm
		}
	},

});