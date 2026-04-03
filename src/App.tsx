import { Refine, WelcomePage } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/tasks/TaskList";
import TaskCreate from "./pages/tasks/TaskCreate";
import { Home, ClipboardList, List } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import { dataProvider } from "./providers/data";


function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "4mEOk1-5lrMPO-OBSaQ7",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: { label: "Index", icon: <Home /> },
                },
                {
                  name: "tasks",
                  list: "/tasks",
                  create: "/tasks/create",
                  meta: { label: "Tasks", icon: <ClipboardList /> },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                <Route path="/" element={<Dashboard />}/>
                  <Route path="tasks">
                    <Route index element={<TaskList />}/>
                    <Route path="create" element={<TaskCreate />}/>
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
