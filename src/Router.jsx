import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Materials,
  Users,
  Loans,
  MaterialForm,
  UserForm,
  LoansForm
} from "./scenes";
import { Login } from "./components/Login";
import UserEdit from "./scenes/user-edit";
import MaterialEdit from "./scenes/material-edit";
import LoanEdit from "./scenes/loans-edit";
import PrivateRouter from "./services/PrivateRouter";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element = {<PrivateRouter />}>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Materials />} />
            <Route path="/materiales" element={<Materials />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/prestamos" element={<Loans />} />
            <Route path="/crear-material" element={<MaterialForm />} />
            <Route path="/crear-usuario" element={<UserForm />} />
            <Route path="/crear-prestamo" element={<LoansForm />} />
            <Route path="/user-edit/:idUser" element={<UserEdit />} />
            <Route path="/material-edit/:idMaterial" element={<MaterialEdit />} />
            <Route path="/loan-edit/:idLoan" element={<LoanEdit />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
