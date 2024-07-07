// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import React from 'react';
import { routeTree } from '@/routes';
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter, createHashHistory } from '@tanstack/react-router';
const router = createRouter( { routeTree, history: createHashHistory()  });

// biome-ignore lint/style/noNonNullAssertion: root always exists
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
