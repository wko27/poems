import { Outlet, Routes, Route } from "react-router-dom";

import { useSelector } from 'react-redux';

import PoemSearch from 'containers/search/PoemSearch';
import PoemEditor from 'containers/viewer/PoemViewer';
import PoemViewer from 'containers/viewer/PoemViewer';
import ProfilePoemViewer from 'containers/profile/ProfilePoemViewer';

const Workspace = (props) => {
  const {
    loginCheckComplete,
  } = useSelector((state) => state.user);

  if (!loginCheckComplete) {
    return "Checking if user is logged in ...";
  }

  return (
    <Routes>
      <Route path="/poems" element={<Outlet />} >
        <Route path="edit" element={<PoemEditor />} />
        <Route path="view" element={<PoemViewer />} />
        <Route path="search" element={<PoemSearch />} />
      </Route>
      <Route path="/profile" element={<Outlet />} >
        <Route path="poems" element={<ProfilePoemViewer />} />
      </Route>
    </Routes>
  );
};

export default Workspace;