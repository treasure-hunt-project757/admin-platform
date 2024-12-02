
import { RouterProvider } from "react-router-dom";
import router from "./view/router/Route";
import "./App.css";
import { Provider } from 'react-redux';
import store from './redux/store';
import { genericAPI } from "./redux/services/GenericAPI";

function App() {

  const token = localStorage.getItem('authToken');
  if (token) {
    genericAPI.setAuthToken(token);
  }

  return (
    <div className="app-body">
      <Provider store={store}>
        <RouterProvider router={router} >
        </RouterProvider>
      </Provider>

    </div>
  );
}

export default App;