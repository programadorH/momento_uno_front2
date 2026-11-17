import Header from "./components/Header";
import Valoracion from "./components/pages/Valoracion/Valoracion";

// Header ya incluye Sidebar, TopBar, Breadcrumb, Toast, ThemeToggle y Footer,
// y pinta la vista que recibe como children dentro de su <main>.
function App() {
  return (
    <Header>
      <Valoracion />
    </Header>
  );
}

export default App;
