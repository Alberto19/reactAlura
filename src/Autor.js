import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './components/Input.component';
import Submit from './components/Submit.component';

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
        this.setNome = this
            .setNome
            .bind(this);
        this.setEmail = this
            .setEmail
            .bind(this);
        this.setSenha = this
            .setSenha
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
                this.props.atualiza(resposta);
            },
            error: resposta => {
                console.log('erro');
            }
        })
    }

    setNome(evento) {
        this.setState({nome: evento.target.value});
    }
    setEmail(evento) {
        this.setState({email: evento.target.value});
    }
    setSenha(evento) {
        this.setState({senha: evento.target.value});
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
                        onChange={this.setNome}
                        label="Nome"/>
                    <InputCustomizado
                        id="email"
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.setEmail}
                        label="Email"/>
                    <InputCustomizado
                        id="senha"
                        type="password"
                        name="senha"
                        value={this.state.senha}
                        onChange={this.setSenha}
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
        this.atualizagem = this.atualizagem.bind(this);
    }

    componentWillMount() {
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: resposta => {
                this.setState({lista: resposta});
            }
        });
    }
    atualizagem(novaLista){
        this.setState({lista:novaLista});
    }

    render() {
        return (
            <div>
                <FormularioAutor atualiza={this.atualizagem}/>
                <TabelaAutores lista={this.state.lista}/>
            </div>
        );
    }
}