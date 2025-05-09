const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'Key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname)));

const PORT = 5000;
const header = fs.readFileSync(path.join(__dirname, "Q7_header.html"), "utf-8");
const footer = fs.readFileSync(path.join(__dirname, "Q7_footer.html"), "utf-8");

function renderPage(contentFile, res) {
    const content = fs.readFileSync(path.join(__dirname, `${contentFile}`), "utf-8");

    const fullPage = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Adopt A-Cat/Dog</title>
    <link rel="stylesheet" href="Q7_home.css">
</head>

<body>
        ${header}
    <main class="middle">
        ${content}
    </main>
        ${footer}
    <script src="Q7.js"></script>
</body>

</html>
`;
    res.send(fullPage);
}

app.get("/", (req, res) => {
    renderPage("Q7_home.html", res);
});

app.get("/find", (req, res) => {
    renderPage("Q7_find.html", res);
});

app.get("/create", (req, res) => {
    renderPage("Q7_create.html", res);
});

app.get("/dogcare", (req, res) => {
    renderPage("Q7_dogcare.html", res);
});

app.get("/catcare", (req, res) => {
    renderPage("Q7_catcare.html", res);
});

app.get("/giveaway", (req, res) => {
    renderPage("Q7_login.html", res);
});

app.get("/contact", (req, res) => {
    renderPage("Q7_contact.html", res);
});

app.get("/privacy", (req, res) => {
    renderPage("Q7_privacy.html", res);
});

app.get("/findPet", (req, res) => {
    const { choice1, specificBreed1, relevance, age, gender, friendlyCat, friendlyDog, friendlyChildren } = req.query;

    const petsPath = path.join(__dirname, "available_pets.txt");

    const lines = fs.readFileSync(petsPath, "utf-8").trim().split('\n');

    const pets = lines.map(line => {
        const parts = line.split(':');
        return {
            id: parts[0],
            username: parts[1],
            type: parts[2],
            breed: parts[3],
            age: parts[4],
            gender: parts[5],
            friendlyCat: parts[6],
            friendlyDog: parts[7],
            friendlyChildren: parts[8],
            message: parts[9],
            ownerFirstName: parts[10],
            ownerFamilyName: parts[11],
            ownerEmail: parts[12]
        };
    });

    const breedMatch = specificBreed1.trim().toLowerCase();
    const typeMatch = choice1;
    const ageMatch = age === "Doesn't Matter" ? null : age;
    const genderMatch = gender === "Doesn't Matter" ? null : gender;
    const friendlyCatMatch = friendlyCat === 'yes';
    const friendlyDogMatch = friendlyDog === 'yes';
    const friendlyChildrenMatch = friendlyChildren === 'yes';

    const matchedPets = pets.filter(pet => {
        return (
            pet.type === typeMatch &&
            (relevance === "doesn't matter" || pet.breed.toLowerCase() === breedMatch) &&
            (!ageMatch || pet.age === ageMatch) &&
            (!genderMatch || pet.gender === genderMatch) &&
            (!friendlyCatMatch || pet.friendlyCat === friendlyCatMatch) &&
            (!friendlyDogMatch || pet.friendlyDog === friendlyDogMatch) &&
            (!friendlyChildrenMatch || pet.friendlyChildren === friendlyChildrenMatch)
        );
    });

    if (matchedPets.length > 0) {
        let body = ``;
        matchedPets.forEach(pet => {
            body += `
            <div class="aboutPet">
                    <div class="description">
                        <p class="name">${pet.username}</p>
                        <p>${pet.type === 'dog' ? pet.type + '🐶' : pet.type + '😺'}: ${pet.breed}</p>
                        <p>Age: ${pet.age}</p>
                        <p>Gender: ${pet.gender}</p>
                        <p>Friendly with cats: ${pet.friendlyCat === 'yes' ? 'Yes☑️' : 'No❌'}</p>
                        <p>Friendly with dogs: ${pet.friendlyDog === 'yes' ? 'Yes☑️' : 'No❌'}</p>
                        <p>Friendly with children: ${pet.friendlyChildren === 'yes' ? 'Yes☑️' : 'No❌'}</p>
                        <p>Message from owner: "${pet.message}"</p>
                    </div>
                    <div class="interested">
                        <button class="interestButton">Interested</button>
                    </div>
                </div>
                <div class="aboutOwner">
                    <p><b>Owner Name and Email:</b> ${pet.ownerFirstName} ${pet.ownerFamilyName}, ${pet.ownerEmail}</p>
                </div>`;
        });
        res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Browse</title>
    <link rel="stylesheet" href="Q7_home.css">
</head>

<body>
    ${header}

    <div class="middle">
        <div class="container">
            <nav class="side-menu">
                <ul class="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/create">Create an account</a></li>
                    <li><a href="/find">Find a Dog/Cat</a></li>
                    <li><a href="/dogcare">Dog Care</a></li>
                    <li><a href="/catcare">Cat Care</a></li>
                    <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/logout">Log Out</a></li>
                </ul>
            </nav>
        </div>

        <div class="browse">
            <h1>Our pets are waiting for you!</h1>
            <div class="pet">
                ${body}
            </div>
        </div>
    </div>

    ${footer}
    <script src="Q7.js"></script>
</body>

</html>`);
    } else {
        res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Browse</title>
    <link rel="stylesheet" href="Q7_home.css">
</head>

<body>
    ${header}

    <div class="middle">
        <div class="container">
            <nav class="side-menu">
                <ul class="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/create">Create an account</a></li>
                    <li><a href="/find">Find a Dog/Cat</a></li>
                    <li><a href="/dogcare">Dog Care</a></li>
                    <li><a href="/catcare">Cat Care</a></li>
                    <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/logout">Log Out</a></li>
                </ul>
            </nav>
        </div>

        <div class="browse">
            <h4>No Matches Found!</h4>
        </div>
    </div>

    ${footer}
    <script src="Q7.js"></script>
</body>

</html>`);
    }
});

app.post("/createAccount", (req, res) => {
    const { username, password } = req.body;

    const usernameValid = /^[A-Za-z0-9]+$/.test(username);
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(password);

    if (!usernameValid || !passwordValid) {
        res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Create</title>
    <link rel="stylesheet" href="Q7_home.css">
</head>

<body>
    ${header}
    <div class="middle">
        <div class="container">
            <nav class="side-menu">
                <ul class="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/create">Create an account</a></li>
                    <li><a href="/find">Find a Dog/Cat</a></li>
                    <li><a href="/dogcare">Dog Care</a></li>
                    <li><a href="/catcare">Cat Care</a></li>
                    <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/logout">Log Out</a></li>
                </ul>
            </nav>
        </div>

        <div class="create">
            <h4>Invalid Username or Password!</h4>
        </div>
    </div>
    ${footer}
    <script src="Q7.js"></script>
</body>

</html>`);
return;
    }

    const loginPath = path.join(__dirname, "login.txt");

    let existingUsers = [];
    if (fs.existsSync(loginPath)) {
        const data = fs.readFileSync(loginPath, "utf-8");
        existingUsers = data.split("\n").filter(Boolean).map(line => line.split(":")[0].trim().toLowerCase());
    }

    if(existingUsers.includes(username.toLowerCase())){
        res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Create</title>
    <link rel="stylesheet" href="Q7_home.css">
</head>

<body>
    ${header}
    <div class="middle">
        <div class="container">
            <nav class="side-menu">
                <ul class="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/create">Create an account</a></li>
                    <li><a href="/find">Find a Dog/Cat</a></li>
                    <li><a href="/dogcare">Dog Care</a></li>
                    <li><a href="/catcare">Cat Care</a></li>
                    <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/logout">Log Out</a></li>
                </ul>
            </nav>
        </div>

        <div class="create">
            <h4>Username already exists!</h4>
        </div>
    </div>
    ${footer}
    <script src="Q7.js"></script>
</body>

</html>`);
return;
    }

    const entry = `${username}:${password}\n`;
    fs.appendFileSync(loginPath, entry);

    res.send(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>Create</title>
            <link rel="stylesheet" href="Q7_home.css">
        </head>
        
        <body>
            ${header}
            <div class="middle">
                <div class="container">
                    <nav class="side-menu">
                        <ul class="menu">
                            <li><a href="/">Home</a></li>
                            <li><a href="/create">Create an account</a></li>
                            <li><a href="/find">Find a Dog/Cat</a></li>
                            <li><a href="/dogcare">Dog Care</a></li>
                            <li><a href="/catcare">Cat Care</a></li>
                            <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/logout">Log Out</a></li>
                        </ul>
                    </nav>
                </div>
        
                <div class="create">
                    <h4>Account successfully created! Ready to login!</h4>
                </div>
            </div>
            ${footer}
            <script src="Q7.js"></script>
        </body>
        
        </html>`);
});

app.post("/loginAccount", (req, res) => {
    const { username, password } = req.body;

    const usernameValid = /^[A-Za-z0-9]+$/.test(username);
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(password);

    if (!usernameValid || !passwordValid) {
        res.send(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Create</title>
    <link rel="stylesheet" href="Q7_home.css">
</head>

<body>
    ${header}
    <div class="middle">
        <div class="container">
            <nav class="side-menu">
                <ul class="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="/create">Create an account</a></li>
                    <li><a href="/find">Find a Dog/Cat</a></li>
                    <li><a href="/dogcare">Dog Care</a></li>
                    <li><a href="/catcare">Cat Care</a></li>
                    <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/logout">Log Out</a></li>
                </ul>
            </nav>
        </div>

        <div class="login">
            <h4>Invalid Username or Password!</h4>
        </div>
    </div>
    ${footer}
    <script src="Q7.js"></script>
</body>

</html>`);
return;
    }

    const loginPath = path.join(__dirname, "login.txt");
    const data = fs.readFileSync(loginPath, "utf-8");
    const lines = data.split("\n");

    const match = lines.find(line => {
        const [storedUser, storedPass] = line.split(":");
        return storedUser === username && storedPass === password;
    });

    if (match){
        req.session.username = username;
        renderPage("Q7_giveaway.html", res);
    } else {
        res.send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <title>Create</title>
                <link rel="stylesheet" href="Q7_home.css">
            </head>
            
            <body>
                ${header}
                <div class="middle">
                    <div class="container">
                        <nav class="side-menu">
                            <ul class="menu">
                                <li><a href="/">Home</a></li>
                                <li><a href="/create">Create an account</a></li>
                                <li><a href="/find">Find a Dog/Cat</a></li>
                                <li><a href="/dogcare">Dog Care</a></li>
                                <li><a href="/catcare">Cat Care</a></li>
                                <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                                <li><a href="/logout">Log Out</a></li>
                            </ul>
                        </nav>
                    </div>
            
                    <div class="login">
                        <h4>Login failed! Try again.</h4>
                    </div>
                </div>
                ${footer}
                <script src="Q7.js"></script>
            </body>
            
            </html>`);
    }
});

app.post("/giveawayPet", (req, res) => {
    if (!req.session || !req.session.username) {
        return res.status(401).send("Please log in to submit a pet.");
    }

    const username = req.session.username;
    const {
        choice2,
        specificBreed2,
        age,
        gender,
        friendlyCat,
        friendlyDog,
        friendlyChildren,
        brag,
        firstName,
        familyName,
        email } = req.body;
    
    const filePath = path.join(__dirname, "available_pets.txt");

    let nextId = 1;

    if (fs.existsSync(filePath)) {
        const lines = fs.readFileSync(filePath, "utf-8").split("\n").filter(line => line.trim() !== "");
        if (lines.length > 0){
            const lastLine = lines[lines.length - 1];
            const lastId = parseInt(lastLine.split(":")[0]);
            if(!isNaN(lastId)){
                nextId = lastId + 1;
            }
        }
    }

    const isfriendlyCat = friendlyCat === 'yes' ? 'yes' : 'no';
    const isfriendlyDog = friendlyDog === 'yes' ? 'yes' : 'no';
    const isfriendlyChildren = friendlyChildren === 'yes' ? 'yes' : 'no';
    const bragMessage = brag.trim();

    const newPet = [
        nextId,
        username,
        choice2,
        specificBreed2,
        age,
        gender,
        isfriendlyCat,
        isfriendlyDog,
        isfriendlyChildren,
        bragMessage,
        firstName,
        familyName,
        email
        ].join(":");

    fs.appendFileSync(filePath, newPet + `\n`, "utf-8");

    res.send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <title>Create</title>
                <link rel="stylesheet" href="Q7_home.css">
            </head>
            
            <body>
                ${header}
                <div class="middle">
                    <div class="container">
                        <nav class="side-menu">
                            <ul class="menu">
                                <li><a href="/">Home</a></li>
                                <li><a href="/create">Create an account</a></li>
                                <li><a href="/find">Find a Dog/Cat</a></li>
                                <li><a href="/dogcare">Dog Care</a></li>
                                <li><a href="/catcare">Cat Care</a></li>
                                <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                                <li><a href="/logout">Log Out</a></li>
                            </ul>
                        </nav>
                    </div>
            
                    <div class="giveaway">
                        <h4>Your pet has been listed for adoption with the ID ${nextId}.</h4>
                    </div>
                </div>
                ${footer}
                <script src="Q7.js"></script>
            </body>
            
            </html>`);
});

app.get("/logout", (req, res) => {
    if(req.session.username){
        req.session.destroy(err => {
            if(err) {
                return res.send("Error logging out.");
        }
        res.send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <title>Logout</title>
                <link rel="stylesheet" href="Q7_home.css">
            </head>
            
            <body>
                ${header}
                <div class="middle">
                    <div class="container">
                        <nav class="side-menu">
                            <ul class="menu">
                                <li><a href="/">Home</a></li>
                                <li><a href="/create">Create an account</a></li>
                                <li><a href="/find">Find a Dog/Cat</a></li>
                                <li><a href="/dogcare">Dog Care</a></li>
                                <li><a href="/catcare">Cat Care</a></li>
                                <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                                <li><a href="/logout">Log Out</a></li>
                            </ul>
                        </nav>
                    </div>
            
                    <div class="logout">
                        <h4>You have been logged out successfully!</h4>
                    </div>
                </div>
                ${footer}
                <script src="Q7.js"></script>
            </body>
            
            </html>`);
    });
    } else {
        res.send(`<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <title>Logout</title>
                <link rel="stylesheet" href="Q7_home.css">
            </head>
            
            <body>
                ${header}
                <div class="middle">
                    <div class="container">
                        <nav class="side-menu">
                            <ul class="menu">
                                <li><a href="/">Home</a></li>
                                <li><a href="/create">Create an account</a></li>
                                <li><a href="/find">Find a Dog/Cat</a></li>
                                <li><a href="/dogcare">Dog Care</a></li>
                                <li><a href="/catcare">Cat Care</a></li>
                                <li><a href="/giveaway">Have a Pet to Give Away</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                                <li><a href="/logout">Log Out</a></li>
                            </ul>
                        </nav>
                    </div>
            
                    <div class="logout">
                        <h4>You are not logged in. Login first!</h4>
                    </div>
                </div>
                ${footer}
                <script src="Q7.js"></script>
            </body>
            
            </html>`);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});