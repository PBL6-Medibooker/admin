import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx";
import DoctorContextProvider from "./context/DoctorContext";
import AppContextProvider from "./context/AppContext";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <AdminContextProvider>
         <DoctorContextProvider>
            <AppContextProvider>

                <App />
            </AppContextProvider>
         </DoctorContextProvider>
      </AdminContextProvider>
      </QueryClientProvider>

  </BrowserRouter>
);

