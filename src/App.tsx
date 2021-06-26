

import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AdminRoom } from './pages/AdminRoom';
import { DarkButton } from './components/DarkButton';
import {AuthContextProvider} from './contexts/AuthContext';
import { ToastProvider} from 'react-toast-notifications';

function App() {

  
  return (
    <ToastProvider>
    <AuthContextProvider>
    <BrowserRouter>
    <Switch>
    <Route path="/" exact component={Home}/>
      <Route path="/rooms/new" component={NewRoom}/>
      <Route path="/admin/rooms/:id" component={AdminRoom} />
      <Route path="/rooms/:id" component={Room}/>
    </Switch>
    </BrowserRouter>
    </AuthContextProvider>
    <DarkButton></DarkButton>
    </ToastProvider>
   
  );
}

export default App;
