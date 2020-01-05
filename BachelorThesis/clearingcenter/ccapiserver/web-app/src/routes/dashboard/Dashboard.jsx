import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBalanceWallet from "@material-ui/icons/AccountBalanceWallet";
import Store from "@material-ui/icons/Store";
import * as Loadable from "react-loadable";
import { FavoriteBorder, FiberNew } from "@material-ui/icons";
import { Pulse } from "mdi-material-ui";

const Home = Loadable({
  loader: () => import("pages/dashboard/home/Home"),
  loading: () => null
});

const Wallet = Loadable({
  loader: () => import("pages/dashboard/wallet/Wallet"),
  loading: () => null
});

const Market = Loadable({
  loader: () => import("pages/dashboard/market/Market"),
  loading: () => null
});

const Strategy = Loadable({
  loader: () => import("pages/dashboard/strategy/Strategy"),
  loading: () => null
});

const UserStrategyEdit = Loadable({
  loader: () => import("pages/dashboard/userStrategyEdit/UserStrategyEdit"),
  loading: () => null
});

const UserStrategy = Loadable({
  loader: () => import("pages/dashboard/userStrategy/UserStrategy"),
  loading: () => null
});

const UserStrategies = Loadable({
  loader: () => import("pages/dashboard/userStrategies/UserStrategies"),
  loading: () => null
});

const FollowingStrategies = Loadable({
  loader: () =>
    import("pages/dashboard/followingStrategies/FollowingStrategies"),
  loading: () => null
});

const UserSignals = Loadable({
  loader: () => import("pages/dashboard/userSignals/UserSignals"),
  loading: () => null
});

import {
  blueColor,
  dangerColor,
  infoColor,
  warningColor,
  primaryColor,
  roseColor,
  successColor
} from "styles/app.jss";

const HomeDashboardRoute = {
  path: "/dashboard",
  name: "Dashboard",
  icon: DashboardIcon,
  component: Home,
  pageColor: infoColor,
  title: "Clearing Center | Home"
};
export const NotFoundDashboardRoute = {
  path: "/dashboard/wallet",
  name: "Wallet",
  pageColor: successColor,
  icon: AccountBalanceWallet,
  component: Wallet,
  title: "Clearing Center | Wallet"
};

const WalletDashboardRoute = {
  path: "/dashboard/wallet",
  name: "Wallet",
  pageColor: successColor,
  icon: AccountBalanceWallet,
  component: Wallet,
  title: "Clearing Center | Wallet"
};
const MarketDashboardRoute = {
  path: "/dashboard/marketplace",
  name: "Marketplace",
  icon: Store,
  pageColor: primaryColor,
  component: Market,
  title: "Clearing Center | Marketplace"
};

const StrategyDashboardRoute = {
  path: "/dashboard/marketplace/:id",
  name: "Strategy",
  icon: Store,
  component: Strategy,
  pageColor: infoColor,
  title: "Clearing Center | Strategy"
};
const UserStrategyEditDashboardRoute = {
  name: "Strategy",
  path: "/dashboard/marketplace/:id/edit",
  icon: Store,
  pageColor: infoColor,
  component: UserStrategyEdit,
  title: "Clearing Center | Edit Strategy"
};
export const UserStrategyDashboardRoute = {
  name: "Create New strategy",
  path: "/dashboard/strategy/create",
  pageColor: infoColor,
  icon: FiberNew,
  component: UserStrategy,
  title: "Clearing Center | Create New strategy"
};

export const UserStrategiesDashboardRoute = {
  name: "My Strategies",
  icon: Store,
  pageColor: blueColor,
  path: "/dashboard/mystrategies",
  component: UserStrategies,
  title: "Clearing Center | My Strategies"
};

export const FollowingStrategiesDashboardRoute = {
  name: "My Following Strategies",
  icon: FavoriteBorder,
  path: "/dashboard/following",
  pageColor: dangerColor,
  component: FollowingStrategies,
  title: "Clearing Center | My Following Strategies"
};
export const UserSignalsDashboardRoute = {
  path: "/dashboard/signals",
  name: "Dashboard",
  pageColor: roseColor,
  icon: Pulse,
  component: UserSignals,
  title: "Clearing Center | My Signals"
};

export const dashboardSidebarMainItems = [
  MarketDashboardRoute,
  UserStrategyDashboardRoute
];

export const DashboardLinks = [
  HomeDashboardRoute,
  WalletDashboardRoute,
  UserStrategyEditDashboardRoute,
  UserStrategiesDashboardRoute,
  UserStrategyDashboardRoute,
  FollowingStrategiesDashboardRoute
];

export const DashboardRoutes = [
  HomeDashboardRoute,
  WalletDashboardRoute,
  MarketDashboardRoute,
  UserStrategyEditDashboardRoute,
  UserStrategiesDashboardRoute,
  UserStrategyDashboardRoute,
  FollowingStrategiesDashboardRoute,
  StrategyDashboardRoute,
  UserSignalsDashboardRoute
];
