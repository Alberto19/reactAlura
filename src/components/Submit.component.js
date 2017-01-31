import React, {Component} from 'react';

export default class Submit extends Component{
    render(){
        return(
            <div className="pure-control-group">
                  <label></label>
                  <button type={this.props.type} className="pure-button pure-button-primary">{this.props.botao}</button>
                </div>
        );
    }
}


                