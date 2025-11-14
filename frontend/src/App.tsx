import {Route, Routes} from "react-router";

import {Dashboard} from "./pages/Dashboard/Dashboard";
import {Login} from "./pages/Login/Login";
import routes from "./utils/routes";

function App() {
  return (
    <Routes>
      <Route path={routes.LOGIN} element={<Login />} />
      <Route path={routes.DASHBOARD} element={<Dashboard />} />
    </Routes>
  );
}

export default App;
