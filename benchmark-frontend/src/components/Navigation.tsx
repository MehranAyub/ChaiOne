import {
  Link,
  useLocation
} from "react-router-dom";

// Images
import BenLogo from '../assets/ben-logo.png';
import NavAlert from '../assets/alert.svg';
import NavSearch from '../assets/search.svg';
import NavUser from '../assets/user.svg';


function Navigation() {
  const { pathname } = useLocation();

  return (
    <nav className="nav">
      <div className="nav-left">
        <img src={BenLogo} alt="BenLogo" className="nav-logo" />
        <div className="nav-title">The ChaiOne Benchmark | Admin Portal</div>
      </div>
      <div className="nav-right">
        <div className="nav-menu-item-links">
          <Link className={`nav-menu-item ${pathname === '/dashboard' ? "nav-menu-item-active" : ""}`}
            to="/dashboard">Import Survey</Link>
          <Link className={`nav-menu-item ${pathname === '/pending-validations' ? "nav-menu-item-active" : ""}`}
            to="/pending-validations">Review Data</Link>
          <Link className={`nav-menu-item ${pathname === '/compute-score' ? "nav-menu-item-active" : ""}`}
            to="/compute-score/0/0">Compute Score</Link>
        </div>
        <div className="nav-menu-item-icons">
          <img src={NavSearch} alt="Navigation Search" className="nav-menu-icon" />
          <img src={NavAlert} alt="Navigation Alert" className="nav-menu-icon" />
          <img src={NavUser} alt="Navigation User" className="nav-menu-icon" />
        </div>
      </div>
    </nav>
  );
}
export default Navigation;
