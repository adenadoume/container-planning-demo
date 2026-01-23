import { Refine } from "@refinedev/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { notificationProvider } from "@refinedev/antd";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import "@refinedev/antd/dist/reset.css";

import { supabase } from "./services/supabase";

// Container Items Pages
import { ContainerItemsListWithStats } from "./pages/container-items/ListWithStats";
import { ContainerItemsCreate } from "./pages/container-items/Create";
import { ContainerItemsEdit } from "./pages/container-items/Edit";
import { ContainerItemsShow } from "./pages/container-items/Show";

// Suppliers Pages
import { SuppliersList } from "./pages/suppliers/List";
import { SuppliersCreate } from "./pages/suppliers/Create";
import { SuppliersEdit } from "./pages/suppliers/Edit";
import { SuppliersShow } from "./pages/suppliers/Show";

// Arrivals Pages
import { ArrivalsList } from "./pages/arrivals/List";

// ENTYPO PARALAVIS Pages
import { EntypoParaliavisList } from "./pages/entypo-paralavis/List";

// Charts Pages
import { ChartsList } from "./pages/charts/List";

// API Connections Pages
import { ApiConnectionsList } from "./pages/api-connections/List";

// Custom Layout
import { Layout } from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Refine
          dataProvider={dataProvider(supabase)}
          liveProvider={liveProvider(supabase)}
          notificationProvider={notificationProvider}
          options={{
            reactQuery: {
              clientConfig: {
                defaultOptions: {
                  queries: {
                    networkMode: 'always',
                    retry: 1,
                    refetchOnWindowFocus: false,
                  },
                },
              },
            },
            liveMode: "auto",
            disableTelemetry: true,
          }}
          resources={[
            {
              name: "container_items",
              list: "/container-items",
              create: "/container-items/create",
              edit: "/container-items/edit/:id",
              show: "/container-items/show/:id",
              meta: {
                label: "Container Items",
              },
            },
            {
              name: "suppliers",
              list: "/suppliers",
              create: "/suppliers/create",
              edit: "/suppliers/edit/:id",
              show: "/suppliers/show/:id",
              meta: {
                label: "Suppliers",
              },
            },
            {
              name: "arrivals",
              list: "/arrivals",
              meta: {
                label: "Arrivals",
              },
            },
            {
              name: "entypo_paralavis",
              list: "/entypo-paralavis",
              meta: {
                label: "ENTYPO PARALAVIS",
              },
            },
            {
              name: "charts",
              list: "/charts",
              meta: {
                label: "Charts",
              },
            },
            {
              name: "api_connections",
              list: "/api-connections",
              meta: {
                label: "API Connections",
              },
            },
          ]}
        >
          <Routes>
            {/* Container Items - No Layout (has own design) */}
            <Route path="/container-items">
              <Route index element={<ContainerItemsListWithStats />} />
              <Route path=":container" element={<ContainerItemsListWithStats />} />
              <Route
                path="create"
                element={
                  <Layout>
                    <ContainerItemsCreate />
                  </Layout>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <Layout>
                    <ContainerItemsEdit />
                  </Layout>
                }
              />
              <Route
                path="show/:id"
                element={
                  <Layout>
                    <ContainerItemsShow />
                  </Layout>
                }
              />
            </Route>
            
            {/* Direct Container URLs (redirect to proper format) */}
            <Route path="/DEMO-001" element={<Navigate to="/container-items/DEMO-001" replace />} />
            <Route path="/DEMO-001-SOUTH" element={<Navigate to="/container-items/DEMO-001" replace />} />
            <Route path="/DEMO-002" element={<Navigate to="/container-items/DEMO-002" replace />} />
            <Route path="/DEMO-002-NORTH" element={<Navigate to="/container-items/DEMO-002" replace />} />
            <Route path="/DEMO-003" element={<Navigate to="/container-items/DEMO-003" replace />} />
            <Route path="/DEMO-003-SOUTH" element={<Navigate to="/container-items/DEMO-003" replace />} />
            
            {/* Direct Page URLs (case-insensitive) */}
            <Route path="/CHARTS" element={<Navigate to="/charts" replace />} />
            <Route path="/API-CONNECTIONS" element={<Navigate to="/api-connections" replace />} />
            <Route path="/SUPPLIER-LIST" element={<Navigate to="/suppliers" replace />} />
            <Route path="/Suppliers" element={<Navigate to="/suppliers" replace />} />
            <Route path="/ARRIVALS" element={<Navigate to="/arrivals" replace />} />

            {/* Suppliers - No sidebar, just dropdown */}
            <Route path="/suppliers">
              <Route index element={<SuppliersList />} />
              <Route
                path="create"
                element={
                  <Layout>
                    <SuppliersCreate />
                  </Layout>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <Layout>
                    <SuppliersEdit />
                  </Layout>
                }
              />
              <Route
                path="show/:id"
                element={
                  <Layout>
                    <SuppliersShow />
                  </Layout>
                }
              />
            </Route>

            {/* Arrivals - No sidebar, just dropdown */}
            <Route path="/arrivals">
              <Route index element={<ArrivalsList />} />
            </Route>

            {/* ENTYPO PARALAVIS - No sidebar, just dropdown */}
            <Route path="/entypo-paralavis">
              <Route index element={<EntypoParaliavisList />} />
            </Route>

            {/* Charts - No sidebar, just dropdown */}
            <Route path="/charts">
              <Route index element={<ChartsList />} />
            </Route>

            {/* API Connections - No sidebar, just dropdown */}
            <Route path="/api-connections">
              <Route index element={<ApiConnectionsList />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/container-items/DEMO-001" replace />} />
          </Routes>
        </Refine>
    </BrowserRouter>
  );
}

export default App;
