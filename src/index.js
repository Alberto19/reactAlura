import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import './index.css';
import Home from './home'
import App from './App';
import AutorBox from './Autor';
import LivroBox from './Livro';

ReactDOM.render(
  <Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
    <Route path="/autor" component={AutorBox}/>
    <Route path="/livro" component={LivroBox}/>
  </Route>
</Router>, document.getElementById('root'));
