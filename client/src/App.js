import React, { Component } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import SimpleStorageContract from "../build/contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import Layout from "./components/UI/Layout/Layout";
import Signin from "./components/Signin/Signin";
import Signup from "./components/Signup/Signup";
import Signout from "./components/Signout/Signout";
import Feature from "./components/Feature/Feature";
import require_auth from './components/hoc/require_auth/require_auth'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null
    };
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require("truffle-contract");
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage
        .deployed()
        .then(instance => {
          simpleStorageInstance = instance;

          return simpleStorageInstance.set(77, { from: accounts[0] });
        })
        .then(result => {
          return simpleStorageInstance.get.call({
            from: accounts[0],
            value: 0,
            gasPrice: 0
          });
        })
        .then(result => {
          return this.setState({ storageValue: result.c[0] });
        });
    });
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/signin" component={Signin} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signout" exact component={Signout} />
        <Route path="/feature" exact component={require_auth(Feature)} />
      </Switch>
    );

    return (
      <div>
        <Layout>{routes}</Layout>
        {this.props.isAuthenticated}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.authenticated
  };
};

export default withRouter(connect(mapStateToProps)(App));
