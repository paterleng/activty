import { createContext, useContext, useState } from 'react';
import SlideShow from "./components/showde/SlideShow.jsx";
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Expand from './pages/home/Expand';
// import ChessBoard from './components/chessboard/ChessBoard';
// import RegisterForm from './pages/RegisterForm';
// import LoginForm from './pages/login/LoginForm';
// import Rule from './components/Rule';


// 创建 AuthContext 用于管理用户登录状态
const AuthContext = createContext(null);
export const UseAuth = () => useContext(AuthContext);

function App() {
   return(
       <SlideShow />
   );

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // return (
  //   <>
  //     {/* <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>*/}
  //     {/*  <Router>*/}
  //     {/*    <Routes>*/}
  //     {/*      <Route path='/' element={<Expand />}></Route>*/}
  //     {/*      <Route path="/board/:id" element={<ChessBoard />} />*/}
  //     {/*      <Route path="/login" element={<LoginForm loginIn={isLoggedIn} />} />*/}
  //     {/*      <Route path="/register" element={<RegisterForm />} />*/}
  //     {/*      <Route path='/rule' element={<Rule />}></Route>*/}
  //     {/*      <Route*/}
  //     {/*        path="/"*/}
  //     {/*        element={*/}
  //     {/*          isLoggedIn ? <Expand to="/" replace /> : <Navigate to="/login" replace />*/}
  //     {/*        }*/}
  //     {/*      />*/}
  //     {/*    </Routes>*/}
  //     {/*  </Router>*/}
  //     {/*</AuthContext.Provider>*/}
  //   </>
  // )
}

export default App
