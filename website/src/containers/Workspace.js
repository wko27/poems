import { Outlet, Routes, Route, useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';

import Home from 'containers/home/Home';
import PoemWorkspace from 'containers/poem/PoemWorkspace';
import ProfilePoemViewer from 'containers/profile/ProfilePoemViewer';

import InvalidRouteDialog from 'components/validation/InvalidRouteDialog'

const Workspace = (props) => {
  const navigate = useNavigate();

  const {
    loginCheckComplete,
  } = useSelector((state) => state.user);

  if (!loginCheckComplete) {
    return "Checking if user is logged in ...";
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/poems" element={<Outlet />} >
        <Route path=":poemId" element={<Outlet />} >
          <Route path=":operation" element={<PoemWorkspace />} />
        </Route>
      </Route>
      <Route path="/profile" element={<Outlet />} >
        <Route path="poems" element={<ProfilePoemViewer />} />
      </Route>
      <Route path="*" element={
        <InvalidRouteDialog
          onClose={() => navigate("/")}
        />
      } />
    </Routes>
  );
};

export default Workspace;
