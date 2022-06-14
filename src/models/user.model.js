class User {
    constructor(name, email, password, createdAt, updatedAt) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        return this;
    }
}

const save = async (user) => {
    const userRef = await db.ref(`users/${user.id}`).set(user);
    return userRef;
}

User.save = save;