import HeaderPublic from "../components/common/HeaderPublic";
import HeaderLoggedIn from "../components/common/HeaderLoggedIn";
import { useAuth } from "../store/useStore";
import { useLocation } from "react-router-dom";

function Header() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (["/", "/login", "/signup"].includes(location.pathname)) {
    return <HeaderPublic />;
  }
  return isAuthenticated ? <HeaderLoggedIn /> : <HeaderPublic />;
}

export default Header;
