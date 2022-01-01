import { Outlet, Routes, Route } from "react-router-dom";

import { useSelector } from 'react-redux';

import Home from 'containers/home/Home';
import PoemEditor from 'containers/poem/PoemEditor';
import PoemViewer from 'containers/poem/PoemViewer';
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
      <Route path="/" element={<Home />} />
      <Route path="/poems" element={<Outlet />} >
        <Route path="edit" element={<Outlet />} >
          <Route path=":poemId" element={<PoemEditor />} />
        </Route>
        <Route path="view" element={<Outlet />} >
          <Route path=":poemId" element={<PoemViewer />} />
        </Route>
      </Route>
      <Route path="/profile" element={<Outlet />} >
        <Route path="poems" element={<ProfilePoemViewer />} />
      </Route>
    </Routes>
  );
};

export default Workspace;
