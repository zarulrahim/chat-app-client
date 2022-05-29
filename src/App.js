import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import HomeScreen from './screens/home';
import ChatScreen from './screens/chat';
import AuthScreen from './screens/auth';
import DashboardScreen from './screens/dashboard';
import { observer } from 'mobx-react';
import { getSnapshot } from 'mobx-state-tree';
import { mstAuth } from './mobx';
import AdminDashboardScreen from './screens/adminDashboard';

const App = observer((props) => {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/auth" element={<AuthScreen />} />
        {
          getSnapshot(mstAuth).isLoggedIn ? // Only LoggedIn user can access these routes
          (
            <>
              <Route path="/users/:target_id" element={<DashboardScreen />} />
              <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
              <Route path="/chat/:target_id" element={<ChatScreen type={"private"} />} />
              <Route path="/group/:target_id" element={<ChatScreen type={"group"} />} />
            </>
          )
          :
          (
            null
          )
        }
      </Routes>
    </BrowserRouter>
  );
})

export default App;

// function App() {
//   const domainUrl = 'http://localhost:5000';
//   const [csrfTokenState, setCsrfTokenState] = useState('');

//   const getCSRFToken = async () => {
//     const url = '/form';
//     let fetchGetResponse = await axios.get(`${domainUrl}${url}`, {
//         // method: 'GET',
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         },
//         credentials: "include",
//         mode: 'cors'
//     })
//     // console.log("check parsedResponse===> ", fetchGetResponse)
//     // let parsedResponse = fetchGetResponse.json();
//     setCsrfTokenState(fetchGetResponse.data.csrfToken)
//     axios.defaults.headers.post['X-CSRF-Token'] = fetchGetResponse.data.csrfToken;
//   }

//   useEffect(() => {
//     // getCSRFToken();
//   }, [])

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomeScreen />} />
//         <Route path="/auth" element={<AuthScreen />} />
//         {

//         }
//         <Route path="/crud" element={<CrudScreen />} />
//         <Route path="/chat/:target_id" element={<ChatScreen socket={socket} type={"private"} />} />
//         <Route path="/group/:target_id" element={<ChatScreen socket={socket} type={"group"} />} />
//         <Route path="/dashboard" element={<DashboardScreen socket={socket} />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
