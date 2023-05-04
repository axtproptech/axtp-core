import Fade from "react-reveal/Fade";

const Sidebar = () => (
  <Fade>
    <div className="drawer drawer-end">
      <div className="drawer-side">
        <label className="drawer-overlay"></label>
        <ul className="menu p-4 mt-4 rounded-2xl w-full h-screen text-black bg-white">
          <li>
            <a>Sidebar Item 1</a>
          </li>

          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul>
      </div>
    </div>
  </Fade>
);

export default Sidebar;
