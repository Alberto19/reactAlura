import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './components/Input.component';
import Submit from './components/Submit.component';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {
            nome: '',
            email: '',
            senha: ''
        };
        this.enviaForm = this
            .enviaForm
            .bind(this);

    }

    //cdc-react.herokuapp.com/api/autores
    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
            success: resposta => {
                PubSub.publish('atualiza', resposta);
                this.setState({nome: '', email: '', senha: ''});
            },
            error: resposta => {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
                console.log('erro');
            },
            beforeSend: () => {
                PubSub.publish('limpa-erros', {})
            }
        })
    }

    salvaAlteracao(nomeInput, evento) {
        this.setState({[nomeInput]: evento.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form
                    className="pure-form pure-form-aligned"
                    onSubmit={this.enviaForm}
                    method="post">
                    <InputCustomizado
                        id="nome"
                        type="text"
                        name="nome"
                        value={this.state.nome}
                        onChange={this
                        .salvaAlteracao
                        .bind(this, 'nome')}
                        label="Nome"/>
                    <InputCustomizado
                        id="email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this
                        .salvaAlteracao
                        .bind(this, 'email')}
                        label="Email"/>
                    <InputCustomizado
                        id="senha"
                        type="password"
                        name="senha"
                        value={this.state.senha}
                        onChange={this
                        .salvaAlteracao
                        .bind(this, 'senha')}
                        label="Senha"/>
                    <Submit type="submit" botao="Gravar"/>
                </form>
            </div>
        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (

            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this
                            .props
                            .lista
                            .map(autor => {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                );
                            })
}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default class AutorBox extends Component {
    constructor() {
        super();
        this.state = {
            lista: []
        };
    }

    componentWillMount() {
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: resposta => {
                this.setState({lista: resposta});
            }
        });
        PubSub.subscribe('atualiza', (topico, novaLista) => {
            this.setState({lista: novaLista});
        });
    }

    render() {
        return (
            <div id="main">
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}