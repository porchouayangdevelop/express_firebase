new Vue({
    el: "#app",
    data: {
        provider: {
            name: "",
            phone: "",
        },
        providers: [],
    },
    created() {},
    mounted() {
        this.fetchData();
    },
    methods: {
        handleClick: function () {
            console.log("clicked!");
        },
        async fetchData() {
            try {
                await fetch("http://localhost:3000/providers", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        this.providers = data.data;
                    })
                    .catch((error) => console.error(error));
            } catch (error) {
                console.log(error);
            }
        },
        Submit() {
            if (this.provider.name == "" || this.provider.phone == "") {
                alert("Please fill all the fields");
            } else {

                fetch("http://localhost:3000/providers", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify(this.provider),
                    }).then((response) => response.json())
                    .then((data) => {
                        this.providers.push(data.data);
                        this.fetchData();
                        this.provider = {
                            name: "",
                            phone: "",
                        };
                    }).catch((error) => console.error(error));
            }

        },
        Delete(id) {
            try {
                if (window.alert("Are you sure you want to delete this provider?")) {
                    return;
                } else {
                    fetch("http://localhost:3000/providers/" + id, {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        }).then((response) => response.json())
                        .then((data) => {
                            this.providers = this.providers.filter((provider) => provider.id != id);
                            // this.providers = data.data;
                            this.fetchData();
                        }).catch((error) => console.error(error));
                }
            } catch (error) {
                console.log(error);
            }
        }

    },
});