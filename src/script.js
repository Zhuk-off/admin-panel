import React from 'react';
import Editor from './components/editor';
import { createRoot } from 'react-dom/client';


const root = createRoot(document.getElementById('root'));
root.render(<Editor tab="home"/>);

