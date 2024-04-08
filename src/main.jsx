import React from 'react'
import ReactDOM from 'react-dom/client'
import Builder from './Builder.jsx'
import Validator from './Validator.jsx'
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>      
        <Routes>
          <Route path="/">
            <Route index element={<Navigate to="/useQueryParams" replace />} />
            <Route path="tools/builder" element={<Builder/>}/>
            <Route path="tools/validator" element={<Validator/>}/>
          </Route>
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
