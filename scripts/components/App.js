import React from 'react';
import Catalyst from 'react-catalyst';
import Rebase from 're-base';
var base = Rebase.createClass('https://catch-of-the-day-dev.firebaseio.com');
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

import Fish from './Fish';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';

@autobind
class App extends React.Component{
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    };
  }
  componentDidMount() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });
    var localStorageRef = localStorage.getItem('order-'+this.props.params.storeId);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-'+this.props.params.storeId, JSON.stringify(nextState.order));
  }
  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({order: this.state.order})
  }
  addFish(fish) {
    var timestamp = (new Date()).getTime();
    this.state.fishes['fish-' + timestamp] = fish;
    this.setState({fishes: this.state.fishes});
  }
  removeFromOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  }
  removeFish(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      });
    }
  }
  loadSamples() {
    this.setState({
      fishes: require('../sample-fishes')
    })
  }
  renderFish(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
  }
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagLine="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
             {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder}/>
        <Inventory fishes={this.state.fishes} addFish={this.addFish} removeFish={this.removeFish} linkState={this.linkState.bind(this)} loadSamples={this.loadSamples}/>
      </div>
    );
  }
};

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;
