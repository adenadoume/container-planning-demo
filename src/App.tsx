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
            <Route path="/DEMO-002" element={<Navigate to="/container-items/DEMO-002" replace />} />
            <Route path="/DEMO-004" element={<Navigate to="/container-items/DEMO-004" replace />} />
            <Route path="/DEMO-005" element={<Navigate to="/container-items/DEMO-005" replace />} />
            <Route path="/Suppliers" element={<Navigate to="/suppliers" replace />} />

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

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/container-items" replace />} />
          </Routes>
        </Refine>
    </BrowserRouter>
  );
}

export default App;
