import './App.css';
import axios from 'axios'

function App() {
    function login() {
        axios.post("http://localhost:8000/api/v1/users/login",
        {
            // "fullName":"odoo-user-jassu-0001",
            // "email":"odoouser@gmail.com",
            "username":"jassu2",
            "password":"jassudajanam2"
        })
        .then((res) => console.log(res))
        .catch(e => console.log(e))
    }
  return (
    <div className="App">
        <h1>Hello</h1>
        <button onClick={login}>
            click to login
        </button>
    </div>
  );
}

export default App;
