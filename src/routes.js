import { Dashboard } from "./containers/dashboard";
import { PredictionForm } from "./containers/prediction-form";
import ReadyTemplates from "./containers/templates";
import { UserProfile } from "./containers/userProfile";
import { ChangePassword } from "./containers/changePassword";
import { AnalysisResult } from "./containers/analysis-result";

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
    element: <ReadyTemplates />,
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-primary",
    element: <UserProfile />,
  },
  {
    path: "/change-password",
    name: "Change Password",
    icon: "ni ni-key-25 text-primary",
    element: <ChangePassword />,
  },
  {
    path: "/analysis-result",
    name: "Analysis Result",
    icon: "ni ni-chart-bar-32 text-primary",
    element: <AnalysisResult />,
  },
];

export default routes;