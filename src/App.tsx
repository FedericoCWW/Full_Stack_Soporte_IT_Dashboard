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
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import { Home, ClipboardList, GraduationCap } from "lucide-react";
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
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  meta: { label: "Classes", icon: <GraduationCap /> },
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
                  <Route path="classes">
                    <Route index element={<ClassesList />}/>
                    <Route path="create" element={<ClassesCreate />}/>
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
