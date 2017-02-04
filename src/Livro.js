import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './components/Input.component';
import Submit from './components/Submit.component';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {
            titulo: '',
            preco: '',
            autorId: ''
        };
        this.enviaForm = this
            .enviaForm
            .bind(this);
    }

    //cdc-react.herokuapp.com/api/autores
    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/livros",
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
            success: resposta => {
                PubSub.publish('atualiza', resposta);
                this.setState({titulo: '', preco: '', autorId: ''});
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
                        id="titulo"
                        type="text"
                        name="titulo"
                        value={this.state.titulo}
                        onChange={this.salvaAlteracao.bind(this,'titulo')}
                        label="titulo"/>
                    <InputCustomizado
                        id="preco"
                        type="text"
                        name="preco"
                        value={this.state.preco}
                        onChange={this.salvaAlteracao.bind(this,'preco')}
                        label="preco"/>

                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor</label>
                        <select id="autorId" name="autorId" value={this.state.autorId} onChange={this.salvaAlteracao.bind(this,'autorId')}>
                            <option value="">Selecione</option>
                            {
                                this.props.autores.map(autor =>{
                                    return <option value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select>
                    </div>
                    <Submit type="submit" botao="Gravar"/>
                </form>
            </div>
        );
    }
}

class TabelaLivros extends Component {

    render() {
        return (

            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Titulo</th>
                            <th>Preço</th>
                            <th>Autor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this
                            .props
                            .lista
                            .map(livro => {
                                return (
                                    <tr key={livro.id}>
                                        <td>{livro.titulo}</td>
                                        <td>{livro.preco}</td>
                                        <td>{livro.autor.nome}</td>
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

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = {
            lista: [],
            autores: []
        };
    }

    componentDidMount() {
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/livros",
            dataType: 'json',
            success: resposta => {
                this.setState({lista: resposta});
            }
        });
        $.ajax({
            url: "http://cdc-react.herokuapp.com/api/autores",
            dataType: 'json',
            success: resposta => {
                this.setState({autores: resposta});
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
                    <h1>Cadastro de Livro</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.lista}/>
                </div>
            </div>
        );
    }
}