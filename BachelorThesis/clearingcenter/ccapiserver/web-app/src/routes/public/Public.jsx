import HomeCircle from "mdi-material-ui/HomeCircle";
import LoginVariant from "mdi-material-ui/LoginVariant";
import PersonAdd from "@material-ui/icons/PersonAdd";

import Home from "pages/public/home/Home";
import Login from "pages/public/login/Login";
import Register from "pages/public/register/Register";

const HomePageRoute = {
  path: "/",
  name: "Home",
  icon: HomeCircle,
  component: Home,
  title: "Clearing Center | Your automated trading toolkit"
};
export const LoginPageRoute = {
  path: "/login",
  name: "Login",
  icon: LoginVariant,
  component: Login,
  title: "Clearing Center | Login"
};
export const NotFoundPageRoute = {
  path: "/login",
  name: "Login",
  icon: LoginVariant,
  component: Login,
  title: "Clearing Center | Login"
};

export const RegisterPageRoute = {
  path: "/register",
  name: "Sign up",
  icon: PersonAdd,
  component: Register,
  title: "Clearing Center | Sign up"
};

export const NavigationLinks = [LoginPageRoute, RegisterPageRoute];

export const PublicRoutes = [HomePageRoute, LoginPageRoute, RegisterPageRoute];
