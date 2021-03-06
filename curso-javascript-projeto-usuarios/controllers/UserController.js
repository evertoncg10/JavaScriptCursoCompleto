class UserController {
    constructor(formIdCreate, formIdUpdate, tbodyTableId) {
        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tbodyTableEl = document.getElementById(tbodyTableId);
        this.onSubmit();
        this.onEdit();
        this.listAllUsers();
        
    }

    onEdit(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", event => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {
            event.preventDefault();

            let btnSubmit = this.formUpdateEl.querySelector("[type=submit]");
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let tr = this.tbodyTableEl.rows[this.formUpdateEl.dataset.trIndex];

            let userOld = JSON.parse(tr.dataset.user);

            let result = Object.assign({}, userOld, values);
            

            this.getPhoto(this.formUpdateEl).then(
                content => {

                    if(!values.photo) {
                        result._photo = userOld._photo;
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `
                        <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin) ? "Sim" : "Não"}</td>
                        <td>${Utils.dateFormat(result._register)}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;

                    this.addEventsTr(tr);
                    this.updateCount();

                    this.formUpdateEl.reset();
                    btnSubmit.disabled = false;
                    this.showPanelCreate();
                }, 
                e => {
                    console.error(e);
                }
            );

        });
    }

    onSubmit(){

        this.formEl.addEventListener("submit", event => {
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit]");
            btnSubmit.disabled = true;

            let values = this.getValues(this.formEl);

            if (!values) {
                btnSubmit.disabled = false;
                return false;
            }

            this.getPhoto(this.formEl).then(
                content => {
                    values.photo = content;
                    this.insertSessionStorage(values);
                    this.addLine(values);
                    this.formEl.reset();
                    btnSubmit.disabled = false;
                }, 
                e => {
                    console.error(e);
                }
            );
        });
    }

    getPhoto(formEl) {

        return new Promise((resolve, reject) => {
            
            let fileReader = new FileReader();
            
            let elements = [...formEl.elements].filter(item => {
                if (item.name === "photo") {
                    return item;
                }     
            });

            let file = elements[0].files[0];

            if(file) {
                fileReader.readAsDataURL(file);
            } else  {
                resolve("dist/img/boxed-bg.jpg");
            }
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) => {
                reject(e);
            }
        });
    }

    getValues(formEl) {
        let user = {};
        let isValid = true;
        [...formEl.elements].forEach(function(field, index) {

            //Efetua a validação de campos obrigatórios com JS
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                field.parentElement.classList.add("has-error");
                isValid = false;
            } else {
                field.parentElement.classList.remove("has-error");
            }

            if(field.name == "gender") {
                if(field.checked) {
                    user[field.name] = field.value;
                }
            } else if(field.name == "admin") {
                user[field.name] = field.checked;

            } else {
                user[field.name] = field.value;
            }
        });

        if(!isValid) {
            return false;
        }

        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo,
            user.admin
        );
        
    }

    addLine(dataUser) {

        let tr = document.createElement('tr');
        
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        this.tbodyTableEl.appendChild(tr);

        this.updateCount();
    }

    getUsersStorage(){
        let users = [];

        if(sessionStorage.getItem("users")) {
            users = JSON.parse(sessionStorage.getItem("users"));
        }
        return users;
    }

    listAllUsers(){
        let users = this.getUsersStorage();

        users.forEach(dataUser => {
            let user = new User();
            user.loadFromJson(dataUser);
            this.addLine(user);
        });
    }

    insertSessionStorage(dataUser) {
        let users = this.getUsersStorage();

        users.push(dataUser);

        sessionStorage.setItem("users", JSON.stringify(users));
    }

    addEventsTr(tr) {

        tr.querySelector(".btn-delete").addEventListener("click", event => {

            if(confirm("Deseja realmente excluir?")) {
                tr.remove();
                this.updateCount();
            }
        });

        tr.querySelector(".btn-edit").addEventListener("click", event => {
            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (const name in json) {
                let field = this.formUpdateEl.querySelector("[name = " + name.replace("_", "") + "]");
                if (field) {
                    if (field.type == "file")
                        continue;
                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name = " + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }
                    field.value = json[name];
                }
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();
        });
    }

    showPanelCreate(){
        document.getElementById("box-user-create").style.display = "block";
        document.getElementById("box-user-update").style.display = "none";
    }

    showPanelUpdate(){
        document.getElementById("box-user-create").style.display = "none";
        document.getElementById("box-user-update").style.display = "block";
    }

    updateCount() {
        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tbodyTableEl.children].forEach(tr => {
            numberUsers++;

            let user = JSON.parse(tr.dataset.user);
            if(user._admin) {
                numberAdmin++;
            }
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;
    }
}
