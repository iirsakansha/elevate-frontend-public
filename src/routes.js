import { Dashboard } from "./containers/dashboard";
import { PredictionForm } from "./containers/prediction-form";
import { ReadyTempaltes } from "./containers/templates";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-books text-primary",
    element: <Dashboard />,
  },
  {
    path: "/ev-analysis",
    name: "EV Analysis",
    icon: "ni ni-email-83 text-primary",
    element: <PredictionForm />,
  },
  {
    path: "/templates",
    name: "Templates",
    icon: "ni ni-email-83 text-primary",
    element: <ReadyTempaltes />,
  },
];

export default routes;