import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Aircraft from "./pages/Aircraft";
import Components from "./pages/Components";
import Maintenance from "./pages/Maintenance";
import Faults from "./pages/Faults";

import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />

          {/* Manager Only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/aircraft"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <Aircraft />
              </ProtectedRoute>
            }
          />

          {/* Manager + Employee */}
          <Route
            path="/components"
            element={
              <ProtectedRoute allowedRoles={["manager", "employee"]}>
                <Components />
              </ProtectedRoute>
            }
          />

          <Route
            path="/maintenance"
            element={
              <ProtectedRoute allowedRoles={["manager", "employee"]}>
                <Maintenance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faults"
            element={
              <ProtectedRoute allowedRoles={["manager", "employee"]}>
                <Faults />
              </ProtectedRoute>
            }
          />

          {/* Catch All */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;


// import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import Navbar from "./components/Navbar"
// import Dashboard from "./pages/Dashboard"
// import Aircraft from "./pages/Aircraft"
// import Components from "./pages/Components"
// import Maintenance from "./pages/Maintenance";
// import Faults from "./pages/Faults";
// import ProtectedRoute from './auth/ProtectedRoute';
// import { Navigate } from 'react-router-dom';
// import Login from '../src/auth/Login'

// function App() {
//   return (
//     <BrowserRouter>
//       <Navbar />
//       <div className="container">
//         <Routes>
//           {/* Login Route */}
//           <Route path="/login" element={<Login />} />

//           {/* Default Route */}
//           <Route path="/" element={<Navigate to="/login" />} />

//           {/* Protected Dashboard */}
//           <Route 
//             path="/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["manager"]}>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/aircraft"
//             element={
//               <ProtectedRoute allowedRoles={["manager"]}>
//                 <Aircraft />
//               </ProtectedRoute>} 
//           />
//           <Route 
//             path="/components" 
//             element={
//               <ProtectedRoute allowedRoles={["manager","employee"]}>
//                 <Components />
//               </ProtectedRoute>
//              }
//           />
//           <Route 
//             path="/components" 
//             element={
//               <ProtectedRoute allowedRoles={["manager","employee"]}>
//                 <Maintenance />
//               </ProtectedRoute>
//              }
//           />
//           <Route 
//             path="/components" 
//             element={
//               <ProtectedRoute allowedRoles={["manager","employee"]}>
//                 <Faults />
//               </ProtectedRoute>
//              }
//           />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
