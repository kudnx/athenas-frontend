import React, { useEffect, useState } from 'react';
import './EdicaoUsuario.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const EdicaoUsuario = () => {

const navigate = useNavigate();

const { id } = useParams();
const [nome, setNome] = useState('');
const [cpf, setCpf] = useState('');
const [dataDeNasc, setDataDeNasc] = useState('');
const [sexo, setSexo] = useState('');
const [altura, setAltura] = useState('');
const [peso, setPeso] = useState('');

useEffect(() => {
    if (id) {
      axios.get(`/listar-pessoa/${id}`)  
        .then((response) => {
            const { nome, cpf, data_de_nasc, sexo, altura, peso } = response.data;
            setNome(nome);
            setCpf(cpf);
            setDataDeNasc(data_de_nasc);
            setSexo(sexo);
            setAltura(altura);
            setPeso(peso);
        })
        .catch((error) => console.error('Erro ao carregar os dados:', error));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuario = {
        nome,
        data_de_nasc: dataDeNasc,
        cpf,
        sexo,
        altura: parseFloat(altura),
        peso: parseFloat(peso),
      };

    axios.put(`/atualizar-pessoa/${id}/`, usuario).then((res) => {
        navigate('/');
      });

  };

  return (
    <div className="container">
      <h2>Edição de Usuário</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Data de Nascimento:</label>
          <input
            type="date"
            value={dataDeNasc}
            onChange={(e) => setDataDeNasc(e.target.value)}
            required
          />
        </div>

        <div>
          <label>CPF:</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="somente números"
            required
            maxLength="11" // CPF tem 11 dígitos
          />
        </div>

        <div>
          <label>Sexo:</label>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} required>
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div>
          <label>Altura (em metros):</label>
          <input
            type="number"
            step="0.01"
            value={altura}
            max="999"
            min='1'
            placeholder="ex: 1.80"
            onChange={(e) => setAltura(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Peso (em kg):</label>
          <input
            type="number"
            step="0.1"
            value={peso}
            maxLength="999999"
            min='1'
            placeholder="ex: 55.85"
            onChange={(e) => setPeso(e.target.value)}
            required
          />
        </div>

        <div>
          <button type="submit">Editar Pessoa</button>
        </div>
      </form>
    </div>
  );
};

export default EdicaoUsuario;
