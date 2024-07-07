// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import App from './App';

import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import Explorer from '@/components/Explorer';
import Faucet from '@/components/Faucet';
import Feed from '@/components/Feed';
import Mint from '@/components/Mint';
import Transfer from '@/components/Transfer';

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: Explorer,
});

const explorerRoute = createRoute({
path: "/explorer",
getParentRoute: () => rootRoute,
component: Explorer,
})

const faucetRoute = createRoute({
  path: "/faucet",
  getParentRoute: () => rootRoute,
  component: Faucet,
});

const mintRoute = createRoute({
  path: "/mint",
  getParentRoute: () => rootRoute,
  component: Mint,
});

const transferRoute = createRoute({
  path: "/transfer",
  getParentRoute: () => rootRoute,
  component: Transfer,
});

const feedRoute = createRoute({
  path: "/feed",
  getParentRoute: () => rootRoute,
  component: Feed,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  explorerRoute,
  faucetRoute,
  mintRoute,
  transferRoute,
  feedRoute
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
