import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CadastroUsuario from './components/CadastroUsuario';
import EdicaoUsuario from './components/EdicaoUsuario';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { format } from 'date-fns';

const formataCPF = (cpf) => {
  return cpf
    .replace(/\D/g, '') // Remove qualquer caractere que não seja número
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o ponto após os 3 primeiros números
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o ponto após os 3 seguintes
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o hífen e o último dígito
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      isLoading: false,
      error: null,
      PessoaList: [],
      modal: false,
      activeItem: {
        nome: "",
        data_de_nasc: "",
        cpf: "",
        sexo: "",
        altura: "",
        peso: "",
      },
    };
  }

  componentDidMount() {
    // this.refreshList();
  }

  handleSearch = async () => {
    const { searchQuery } = this.state;

    if (!searchQuery) {
      // Vou pesquisar todos as pessoas se nada for passado no campo de pesquisa
      this.refreshList()
      return;
    }

    this.setState({ isLoading: true, error: null });

    try {
      // Simulando uma chamada à API de pesquisa
      axios
      .get(`pesquisar-pessoas/${searchQuery}/`)
      .then((res) => this.setState({ PessoaList: res.data }))
      .catch((err) => {
        console.error("Erro ao realizar a pesquisa de pessoas:", err);
        toast.error("Erro ao pesquisar pessoa. Tente novamente!"); 
      });
    } catch (error) {
      this.setState({ error: error.message, isLoading: false });
    }
  };

  refreshList = () => {
    axios
      .get("/listar-pessoas/")
      .then((res) => this.setState({ PessoaList: res.data }))
      .catch((err) => console.log(err));
  };

  handleDelete = (item) => {
    const isConfirmed = window.confirm("Você tem certeza que deseja deletar essa pessoa?");

    if (isConfirmed) {
      axios
        .delete(`/deletar-pessoa/${item.id}/`)
        .then((res) => {
          toast.success("Pessoa deletada com sucesso!"); 
          this.refreshList(); 
        })
        .catch((err) => {
          console.error("Erro ao deletar pessoa:", err);
          toast.error("Erro ao deletar pessoa. Tente novamente!"); 
        });
    }
  };

  handleIMC = (item) => {
    axios
    .get(`/calcular-imc/${item.id}/`)
    .then((res) => {
      toast.success(res.data); 
    })
    .catch((err) => {
      console.error("Erro ao fazer o calculo do IMC da pessoa:", err);
      toast.error("Tente novamente!"); 
    });
  };


  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Lista de Pessoas
        </span>
      </div>
    );
  };

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };



  renderListHeader = () => {
    return (
      <div>
      {/* Cabeçalho da lista */}
      <li className="list-group-item d-flex justify-content-around align-items-center font-weight-bold">
        <span className="todo-title mr-2">Nome</span>
        <span className="todo-title mr-2">CPF</span>
        <span className="todo-title mr-2">Data de Nascimento</span>
        <span className="todo-title mr-2">Sexo</span>
        <span className="todo-title mr-2">Altura</span>
        <span className="todo-title mr-2">Peso</span>
        <span>Ações</span>
      </li>
      </div>
    );
  };

  renderItems = () => {
    const newItems = this.state.PessoaList.filter(
      (item) => item);

    return newItems.map((item) => (
      
      
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-around align-items-center"
      >
        <span
          className={`todo-title mr-2 `}
        >
          {item.nome}
        </span>
        <span
          className={`todo-title mr-2 `}
        >
          {item.cpf ? formataCPF(item.cpf) : 'CPF inválido'}
        </span>
        <span
          className={`todo-title mr-2 `}
        >
          {item.data_de_nasc ? format(new Date(item.data_de_nasc), 'dd/MM/yyyy') : 'Data inválida'}
        </span>
        <span
          className={`todo-title mr-2 `}
        >
            {item.sexo === 'F' ? 'Feminino' : item.sexo === 'M' ? 'Masculino' : 'Sexo indefinido'}
        </span>

        <span
          className={`todo-title mr-2 `}
        >
          {item.altura + ' m'}
        </span>

        <span
          className={`todo-title mr-2 `}
        >
          {item.peso + ' Kg'}
        </span>
        <span className="mr-2">
        <button
            className="btn btn-primary font-weight-bold"
            onClick={() => this.handleIMC(item)}
          >
            Calcular IMC
          </button>

          <button className="btn btn-warning font-weight-bold">
            <Link
              to={`/edicao/${item.id}`}
            >
              Editar
            </Link>
          </button>

          <button
            className="btn btn-danger font-weight-bold"
            onClick={() => this.handleDelete(item)}
          >
            Deletar
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <Router>
          {/* Navbar com links para Home e Cadastro */}
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
          <ToastContainer></ToastContainer>
            <Link className="navbar-brand" to="/">Athemis</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                
                <li className="nav-item">
                  <Link className="nav-link" to="/cadastro">Cadastro de Usuários</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Definindo as rotas */}
        <Routes>
        <Route path="/" element={
            <div>
                    {/* Campo de Pesquisa abaixo da navbar */}
            <div className="container mt-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pesquisar pessoas..."
                    value={this.searchQuery}
                    onChange={this.handleSearchChange} 
                  />
                  <button
                    className="btn btn-primary"
                    onClick={this.handleSearch} 
                    disabled={this.isLoading} 
                  >
                    {this.isLoading ? 'Pesquisando...' : 'Pesquisar'}
                  </button>
                </div>
              </div>
              <h1>Listagem de Pessoas</h1>

              {this.renderListHeader()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          } />
          <Route path="/cadastro" element={<CadastroUsuario />} />
          <Route path="/edicao/:id" element={<EdicaoUsuario />} />
        </Routes>
      </Router>
    );
  }
}

export default App;