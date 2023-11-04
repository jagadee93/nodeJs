const path = require("path")
const fsPromises = require("fs").promises;



const Data = {
    employees: require(path.join(__dirname, "..", "model", "employees.json")),
    setEmployees: function (data) { this.employees = data },
    async save() {
        if (this.employees) {
            const SEmployees = JSON.stringify(this.employees)
            console.log(SEmployees)
            await fsPromises.writeFile(path.join(__dirname, "..", "model", "employees.json"), SEmployees);
        }
        return
    }
}


const getEmployees = async (req, res) => {
    if (!Data.employees) res.json({ "error": "No employees found" })
    res.json(Data.employees)
}


const addNewEmployee = async (req, res) => {
    const { firstName, salary, lastName } = req.body;
    const newEmployee = { id: Data.employees[Data.employees.length - 1].id + 1 || 1, firstName, lastName, salary, };
    Data.setEmployees(Data.employees.concat(newEmployee));
    Data.save();
    res.json(Data.employees);
}

const editEmployee = async (req, res) => {
    const { id, firstName, lastName, salary } = req.body;
    if (!id) res.json({ "error": "Employee id id needed" })
    const employee = Data.employees.find((emp) => Number(emp.id) === parseInt(id));

    if (!employee) res.json({ "error": `Employee with the id ${id} Not Found` });
    // we have to remove that employee from the data 
    const filteredEmployees = Data.employees.filter((emp) => Number(emp.id) !== parseInt(id));
    //we have to modify the employee data based on the data that we have received from the server..
    const editedEmployee = {
        ...employee,
        firstName: firstName ? firstName : employee.firstName,
        lastName: lastName ? lastName : employee.lastName,
        salary: salary ? salary : employee.salary,
    }
    const unSortedEmployees = [...filteredEmployees, editedEmployee]
    //in this we are first checking if the a(emp1) id is greater than b(emp2) if greater 1 means a comes first ,-1 means b comes first,0 means nothing will be changed 
    Data.setEmployees(unSortedEmployees.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0))

    Data.save();
    res.json(Data.employees)
}

const deleteEmployee = async (req, res) => {
    const id = req.body.id;
    const employee = Data.employees.find((emp) => {
        return Number(emp.id) === Number(id)
    });

    if (!employee) res.json({ "error": `employee with id ${id} not found` })


    const filteredEmployees = Data.employees.filter((emp) => {
        return Number(emp.id) !== Number(id)
    })
    Data.setEmployees(filteredEmployees)
    Data.save();
    res.json(Data.employees)
}

const getEmployeeById = async (req, res) => {
    const id = req.params.id;
    const employee = Data.employees.find((emp) => {
        return Number(emp.id) === Number(id)
    });

    if (!id || !employee) res.status(400).json({ "error": `employee with id ${id} not found` })
    res.json(employee)
}


module.exports = {
    getEmployees,
    addNewEmployee,
    editEmployee,
    deleteEmployee,
    getEmployeeById

}