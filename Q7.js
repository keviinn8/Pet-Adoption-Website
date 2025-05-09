function getDate() {
    const date = new Date();
    const time = date.toLocaleString();
    document.getElementById("date").textContent = time;
}

getDate();
setInterval(getDate, 1000);

function findValidation() {
    const catOrDogChoice = document.querySelector('input[name="choice1"]:checked');
    const breedInput = document.querySelector('input[name="specificBreed1"]');
    const breedMatters = document.querySelector('input[name="relevance"]');
    const error = document.getElementById("error1");

    let isValid = true;
    let errorMessage = "";

    if (error) {
        error.textContent = "";
    }

    if (!catOrDogChoice) {
        isValid = false;
        errorMessage += "Select either Cat or Dog!<br>";
    }

    if (!breedMatters.checked && breedInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Enter a breed or select 'Doesn't Matter'!<br>";
    }

    if (!isValid) {
        error.innerHTML = errorMessage;
        return false;
    }

    return true;
}

function giveawayValidation() {
    const catOrDogChoice = document.querySelector('input[name="choice2"]:checked');
    const breedInput = document.querySelector('input[name="specificBreed2"]');
    const age = document.querySelector('select[name="age"]');
    const gender = document.querySelector('select[name="gender"]');
    const description = document.querySelector('textarea[name="brag"]');
    const firstName = document.querySelector('input[name="first name"]');
    const familyName = document.querySelector('input[name="family name"]');
    const emailInput = document.querySelector('input[name="email"]');
    const error = document.getElementById("error2");

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isValid = true;
    let errorMessage = "";

    if (error) {
        error.textContent = "";
    }

    if (!catOrDogChoice) {
        isValid = false;
        errorMessage += "Select either Cat or Dog!<br>";
    }

    if (breedInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Enter a breed!<br>";
    }

    if (age.value === "Age") {
        isValid = false;
        errorMessage += "Select an age!<br>";
    }

    if (gender.value === "Gender") {
        isValid = false;
        errorMessage += "Select a gender!<br>";
    }

    if (description.value.trim() === "") {
        isValid = false;
        errorMessage += "Enter a bragging description!<br>";
    }

    if (firstName.value.trim() === "") {
        isValid = false;
        errorMessage += "Enter your first name!<br>";
    }

    if (familyName.value.trim() === "") {
        isValid = false;
        errorMessage += "Enter your family name!<br>";
    }

    if (!emailPattern.test(emailInput.value.trim()) || emailInput.value.trim() === "") {
        isValid = false;
        errorMessage += "Enter a valid email address!<br>";
    }

    if (!isValid) {
        error.innerHTML = errorMessage;
        return false;
    }
    return true;
}