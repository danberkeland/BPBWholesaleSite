import React from "react";
import { BrowserRouter, Route, Redirect, Link, Switch } from "react-router-dom";
import { Dropdown, Menu, message } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import HomeScreen from "./screens/HomeScreen";
import Login from "./user/Login";
import Admin from "./Admin";
import { isLogined, getUsername, getUserType, clearToken } from "./utils/utils";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogined: false,
      username: "",
      userType: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.updateUser();
  }

  updateUser = () => {
    this.setState({
      username: getUsername(),
      userType: getUserType(),
      isLogined: isLogined(),
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let { isLogined, username, userType } = this.state;
    let popMenuAdmin = (
      <Menu
        onClick={(p) => {
          if (p.key == "logout") {
            clearToken();
            this.updateUser();
            this.props.history.push("/");
          } else if (p.key == "admin") {
          } else {
            message.info(p.key);
          }
        }}
      >
        <Menu.Item key="admin" icon={<ReconciliationOutlined />}>
          <Link to="/admin/main">admin</Link>
        </Menu.Item>
        <Menu.Item key="account" icon={<SafetyCertificateOutlined />}>
          account
        </Menu.Item>
        <Menu.Item key="logout" icon={<LoginOutlined />}>
          logout
        </Menu.Item>
      </Menu>
    );

    let popMenuCustomer = (
      <Menu
        onClick={(p) => {
          if (p.key == "logout") {
            clearToken();
            this.updateUser();
            this.props.history.push("/");
          } else {
            message.info(p.key);
          }
        }}
      >
        <Menu.Item key="account" icon={<SafetyCertificateOutlined />}>
          account
        </Menu.Item>
        <Menu.Item key="logout" icon={<LoginOutlined />}>
          logout
        </Menu.Item>
      </Menu>
    );
    let dropdown =
      userType == "admin" ? (
        <Dropdown overlay={popMenuAdmin} className="nav-item">
          <div>
            <UserOutlined />
            <span>Hello, {username}</span>
          </div>
        </Dropdown>
      ) : (
        <Dropdown overlay={popMenuCustomer} className="nav-item">
          <div>
            <UserOutlined />
            <span>Hello, {username}</span>
          </div>
        </Dropdown>
      );
    let header = username ? (
      <header>
        <div>
          <a className="brand" href="/">
            Back Porch Bakery
          </a>
        </div>
        <div className="nav">
          <a href="/cart" className="nav-item">
            <ShoppingCartOutlined />
            cart
          </a>
          {dropdown}
        </div>
      </header>
    ) : (
      <header className="row">
        <div>
          <a className="brand" href="/">
            Back Porch Bakery
          </a>
        </div>
        <div className="nav">
          <a href="/login" className="nav-item">
            login
          </a>
        </div>
      </header>
    );
    return (
      <div className="grid-container">
        {header}
        <main>
          <Switch>
            <Route
              path="/admin"
              // component={Admin}
              render={(props) =>
                userType == "admin" ? (
                  <Admin {...props} />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: props.location },
                    }}
                  />
                )
              }
            />
            <Route
              path="/login"
              exact
              render={(props) => (
                <Login {...props} onUserChange={this.updateUser} />
              )}
            ></Route>
            <Route
              path="/"
              render={(props) =>
                isLogined ? (
                  <HomeScreen {...props} />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: props.location },
                    }}
                  />
                )
              }
              // component={HomeScreen}
              // exact
            ></Route>
          </Switch>
        </main>
        <footer className="row center">This is footer</footer>
      </div>
    );
  }
}

export default App;
