import { Dashboard } from "./containers/dashboard";
import { PredictionForm } from "./containers/prediction-form";
import { ReadyTempaltes } from "./containers/templates";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-books text-primary",
    component: Dashboard,
    exact: true
  },
  {
    path: "/ev-analysis",
    name: "EV Analysis",
    icon: "ni ni-email-83 text-primary",
    component: PredictionForm,
    exact: true
  },
  {
    path: "/templates",
    name: "Templates",
    icon: "ni ni-email-83 text-primary",
    component: ReadyTempaltes,
    exact: true
  },
];
export default routes;
