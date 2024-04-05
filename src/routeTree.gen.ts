/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DashboardLayoutImport } from './routes/_dashboard-layout'
import { Route as IndexImport } from './routes/index'
import { Route as TestIndexImport } from './routes/test/index'
import { Route as DashboardLayoutTicketsIndexImport } from './routes/_dashboard-layout/tickets/index'
import { Route as DashboardLayoutProjectsIndexImport } from './routes/_dashboard-layout/projects/index'
import { Route as DashboardLayoutDashboardIndexImport } from './routes/_dashboard-layout/dashboard/index'
import { Route as DashboardLayoutAccountsIndexImport } from './routes/_dashboard-layout/accounts/index'
import { Route as DashboardLayoutTicketsDisabledImport } from './routes/_dashboard-layout/tickets/disabled'
import { Route as DashboardLayoutTicketsCreateImport } from './routes/_dashboard-layout/tickets/create'
import { Route as DashboardLayoutTicketsIdImport } from './routes/_dashboard-layout/tickets/$id'
import { Route as DashboardLayoutProjectsDisabledImport } from './routes/_dashboard-layout/projects/disabled'
import { Route as DashboardLayoutProjectsCreateImport } from './routes/_dashboard-layout/projects/create'
import { Route as DashboardLayoutProjectsIdImport } from './routes/_dashboard-layout/projects/$id'
import { Route as DashboardLayoutAccountsEmailImport } from './routes/_dashboard-layout/accounts/email'
import { Route as DashboardLayoutAccountsCreateImport } from './routes/_dashboard-layout/accounts/create'
import { Route as DashboardLayoutAccountsIdImport } from './routes/_dashboard-layout/accounts/$id'
import { Route as DashboardLayoutTicketsVouchersIndexImport } from './routes/_dashboard-layout/tickets/vouchers/index'
import { Route as DashboardLayoutTicketsOrdersIndexImport } from './routes/_dashboard-layout/tickets/orders/index'
import { Route as DashboardLayoutTicketsVouchersDisabledImport } from './routes/_dashboard-layout/tickets/vouchers/disabled'
import { Route as DashboardLayoutTicketsVouchersCreateImport } from './routes/_dashboard-layout/tickets/vouchers/create'
import { Route as DashboardLayoutTicketsVouchersIdImport } from './routes/_dashboard-layout/tickets/vouchers/$id'
import { Route as DashboardLayoutTicketsOrdersCreateImport } from './routes/_dashboard-layout/tickets/orders/create'
import { Route as DashboardLayoutTicketsOrdersIdImport } from './routes/_dashboard-layout/tickets/orders/$id'

// Create/Update Routes

const DashboardLayoutRoute = DashboardLayoutImport.update({
  id: '/_dashboard-layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TestIndexRoute = TestIndexImport.update({
  path: '/test/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardLayoutTicketsIndexRoute =
  DashboardLayoutTicketsIndexImport.update({
    path: '/tickets/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutProjectsIndexRoute =
  DashboardLayoutProjectsIndexImport.update({
    path: '/projects/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutDashboardIndexRoute =
  DashboardLayoutDashboardIndexImport.update({
    path: '/dashboard/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutAccountsIndexRoute =
  DashboardLayoutAccountsIndexImport.update({
    path: '/accounts/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsDisabledRoute =
  DashboardLayoutTicketsDisabledImport.update({
    path: '/tickets/disabled',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsCreateRoute =
  DashboardLayoutTicketsCreateImport.update({
    path: '/tickets/create',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsIdRoute = DashboardLayoutTicketsIdImport.update({
  path: '/tickets/$id',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const DashboardLayoutProjectsDisabledRoute =
  DashboardLayoutProjectsDisabledImport.update({
    path: '/projects/disabled',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutProjectsCreateRoute =
  DashboardLayoutProjectsCreateImport.update({
    path: '/projects/create',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutProjectsIdRoute = DashboardLayoutProjectsIdImport.update({
  path: '/projects/$id',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const DashboardLayoutAccountsEmailRoute =
  DashboardLayoutAccountsEmailImport.update({
    path: '/accounts/email',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutAccountsCreateRoute =
  DashboardLayoutAccountsCreateImport.update({
    path: '/accounts/create',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutAccountsIdRoute = DashboardLayoutAccountsIdImport.update({
  path: '/accounts/$id',
  getParentRoute: () => DashboardLayoutRoute,
} as any)

const DashboardLayoutTicketsVouchersIndexRoute =
  DashboardLayoutTicketsVouchersIndexImport.update({
    path: '/tickets/vouchers/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsOrdersIndexRoute =
  DashboardLayoutTicketsOrdersIndexImport.update({
    path: '/tickets/orders/',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsVouchersDisabledRoute =
  DashboardLayoutTicketsVouchersDisabledImport.update({
    path: '/tickets/vouchers/disabled',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsVouchersCreateRoute =
  DashboardLayoutTicketsVouchersCreateImport.update({
    path: '/tickets/vouchers/create',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsVouchersIdRoute =
  DashboardLayoutTicketsVouchersIdImport.update({
    path: '/tickets/vouchers/$id',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsOrdersCreateRoute =
  DashboardLayoutTicketsOrdersCreateImport.update({
    path: '/tickets/orders/create',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

const DashboardLayoutTicketsOrdersIdRoute =
  DashboardLayoutTicketsOrdersIdImport.update({
    path: '/tickets/orders/$id',
    getParentRoute: () => DashboardLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard-layout': {
      preLoaderRoute: typeof DashboardLayoutImport
      parentRoute: typeof rootRoute
    }
    '/test/': {
      preLoaderRoute: typeof TestIndexImport
      parentRoute: typeof rootRoute
    }
    '/_dashboard-layout/accounts/$id': {
      preLoaderRoute: typeof DashboardLayoutAccountsIdImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/accounts/create': {
      preLoaderRoute: typeof DashboardLayoutAccountsCreateImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/accounts/email': {
      preLoaderRoute: typeof DashboardLayoutAccountsEmailImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/projects/$id': {
      preLoaderRoute: typeof DashboardLayoutProjectsIdImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/projects/create': {
      preLoaderRoute: typeof DashboardLayoutProjectsCreateImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/projects/disabled': {
      preLoaderRoute: typeof DashboardLayoutProjectsDisabledImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/$id': {
      preLoaderRoute: typeof DashboardLayoutTicketsIdImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/create': {
      preLoaderRoute: typeof DashboardLayoutTicketsCreateImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/disabled': {
      preLoaderRoute: typeof DashboardLayoutTicketsDisabledImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/accounts/': {
      preLoaderRoute: typeof DashboardLayoutAccountsIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/dashboard/': {
      preLoaderRoute: typeof DashboardLayoutDashboardIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/projects/': {
      preLoaderRoute: typeof DashboardLayoutProjectsIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/': {
      preLoaderRoute: typeof DashboardLayoutTicketsIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/orders/$id': {
      preLoaderRoute: typeof DashboardLayoutTicketsOrdersIdImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/orders/create': {
      preLoaderRoute: typeof DashboardLayoutTicketsOrdersCreateImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/vouchers/$id': {
      preLoaderRoute: typeof DashboardLayoutTicketsVouchersIdImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/vouchers/create': {
      preLoaderRoute: typeof DashboardLayoutTicketsVouchersCreateImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/vouchers/disabled': {
      preLoaderRoute: typeof DashboardLayoutTicketsVouchersDisabledImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/orders/': {
      preLoaderRoute: typeof DashboardLayoutTicketsOrdersIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
    '/_dashboard-layout/tickets/vouchers/': {
      preLoaderRoute: typeof DashboardLayoutTicketsVouchersIndexImport
      parentRoute: typeof DashboardLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  DashboardLayoutRoute.addChildren([
    DashboardLayoutAccountsIdRoute,
    DashboardLayoutAccountsCreateRoute,
    DashboardLayoutAccountsEmailRoute,
    DashboardLayoutProjectsIdRoute,
    DashboardLayoutProjectsCreateRoute,
    DashboardLayoutProjectsDisabledRoute,
    DashboardLayoutTicketsIdRoute,
    DashboardLayoutTicketsCreateRoute,
    DashboardLayoutTicketsDisabledRoute,
    DashboardLayoutAccountsIndexRoute,
    DashboardLayoutDashboardIndexRoute,
    DashboardLayoutProjectsIndexRoute,
    DashboardLayoutTicketsIndexRoute,
    DashboardLayoutTicketsOrdersIdRoute,
    DashboardLayoutTicketsOrdersCreateRoute,
    DashboardLayoutTicketsVouchersIdRoute,
    DashboardLayoutTicketsVouchersCreateRoute,
    DashboardLayoutTicketsVouchersDisabledRoute,
    DashboardLayoutTicketsOrdersIndexRoute,
    DashboardLayoutTicketsVouchersIndexRoute,
  ]),
  TestIndexRoute,
])

/* prettier-ignore-end */
