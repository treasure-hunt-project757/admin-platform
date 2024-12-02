import { createBrowserRouter } from "react-router-dom";
import {
  LoginPage,
  NewSectorPage,
  Base,
  SectorDetails,
  SectorsPage,
  LocationPage,
  TasksPage,
  GamesPage,
} from "../pages";
import { Outlet } from "react-router-dom";
import AddTask from "../pages/Tasks/AddTask/AddTask";
import TaskDetails from "../pages/Tasks/TaskDetails/TaskDetails";
import AddLocation from "../pages/Location/AddLocation/AddLocation";
import EditLocation from "../pages/Location/EditLocation/EditLocation";
import LocationDetails from "../pages/Location/LocationDetails/LocationDetails";
import EditTask from "../pages/Tasks/EditTask/EditTask";
import AddObjectLocation from "../pages/ObjectLocation/AddObjectLocation/AddObjectLocation";
import ObjectDetails from "../pages/ObjectLocation/ObjectDetails/ObjectDetails";
import ObjectsPage from "../pages/ObjectLocation/ObjectsPage";
import AddGame from "../pages/Games/AddGame/AddGame";
import AddUnit from "../pages/Games/AddUnit/AddUnit";
import ChoosableTaskPage from "../pages/Games/AddUnit/ChoosableTask/ChooseTask";
import UnitsPage from "../pages/Games/UnitPage/UnitsPage";
import ChoosableLocationPage from "../pages/Games/AddUnit/ChoosableObject/ChooseLocationPage";
import ChoosableObjectsPage from "../pages/Games/AddUnit/ChoosableObject/ChooseObjectsPage";
import EditUnit from "../pages/Games/EditUnit/EditUnit";
import GameDetails from "../pages/Games/GameDetails/GameDetails";
import UnitsPageView from "../pages/Games/UnitsPage-View/UnitsPageView";
import UnitDetailsView from "../pages/Games/UnitDetailsView/UnitDetailsView";
import EditSector from "../pages/Sectors/EditSector/EditSector";
import EditObject from "../pages/ObjectLocation/EditObject/EditObject";
import EditGame from "../pages/Games/EditGame/EditGame";
import EditGameUnitsPage from "../pages/Games/EditGame/EditGameUnitsPage/EditGameUnitsPage";
import EditEditUnit from "../pages/Games/EditGame/Edit-EditUnit/Edit-EditUnit";
import EditAddUnit from "../pages/Games/EditGame/Edit-Addunit/Edit-AddUnit";
import DuplicateTask from "../pages/Tasks/DuplicateTask/DuplicateTask";
import TaskDetailsAddGame from "../pages/Games/AddUnit/TaskDetailsAddGame/TaskDetailsAddGame";
import ObjectGames from "../pages/ObjectLocation/ObjectDetails/ObjectGames";

function Layout() {
  return (
    <>
      <Base>
        <Outlet />
      </Base>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/AddSector",
    element: <NewSectorPage />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/SectorDetails/:sector",
        element: <SectorDetails />,
      },
      {
        path: "/Sectors",
        element: <SectorsPage />,
      },
      {
        path: "/Locations",
        element: <LocationPage />,
      },
      {
        path: "/EditLocation",
        element: <EditLocation />,
      },
      {
        path: "/Tasks",
        element: <TasksPage />,
      },
      {
        path: "/Games",
        element: <GamesPage />,
      },
      {
        path: "/EditTask",
        element: <EditTask />,
      },
      {
        path: "/DuplicateTask",
        element: <DuplicateTask />,
      },
      {
        path: "/EditSector",
        element: <EditSector />,
      },
      {
        path: "/AddTask",
        element: <AddTask />,
      },
      {
        path: "/AddLocation",
        element: <AddLocation />,
      },
      {
        path: "/TaskDetails/:task",
        element: <TaskDetails />,
      },
      {
        path: "/LocationDetails/:location",
        element: <LocationDetails />,
      },
      {
        path: "/AddLocation/:location",
        element: <AddObjectLocation />,
      },
      {
        path: "/AddObjectLocation",
        element: <AddObjectLocation />,
      },
      {
        path: "/ObjectDetails/:objectID",
        element: <ObjectDetails />,
      },
      {
        path: "/EditObject/:locationID",
        element: <EditObject />,
      },

      {
        path: "/AddGame",
        element: <AddGame />,
      },
      {
        path: "/EditGame",
        element: <EditGame />,
      },
      {
        path: "/AddUnit",
        element: <AddUnit />,
      },
      {
        path: "/ChooseTask-edit",
        element: <ChoosableTaskPage fromParent="EditUnit" />,
      },
      {
        path: "/ChooseTask-add",
        element: <ChoosableTaskPage fromParent="AddUnit" />,
      },
      {
        path: "/ChooseLocation-edit",
        element: <ChoosableLocationPage fromParent="EditUnit" />,
      },
      {
        path: "/ChooseLocation-add",
        element: <ChoosableLocationPage fromParent="AddUnit" />,
      },
      {
        path: "/ChooseObject-edit/:locationID",
        element: <ChoosableObjectsPage fromParent="EditUnit" />,
      },
      {
        path: "/ChooseObject-add/:locationID",
        element: <ChoosableObjectsPage fromParent="AddUnit" />,
      },
      {
        path: "/UnitsPage",
        element: <UnitsPage />,
      },
      {
        path: "/EditGameUnitsPage",
        element: <EditGameUnitsPage />,
      },
      {
        path: "/EditUnit",
        element: <EditUnit />,
      },
      {
        path: "/Edit-EditUnit",
        element: <EditEditUnit />,
      },
      {
        path: "/Edit-AddUnit",
        element: <EditAddUnit />,
      },
      {
        path: "/ObjectsPage/:locationID",
        element: <ObjectsPage />,
      },
      {
        path: "/GameDetails/:game",
        element: <GameDetails />,
      },
      {
        path: "/UnitsPageView",
        element: <UnitsPageView />,
      },
      {
        path: "/UnitDetailsView",
        element: <UnitDetailsView />,
      },
      {
        path: "/edit-ChooseTask-edit",
        element: <ChoosableTaskPage fromParent="Edit-EditUnit" />,
      },
      {
        path: "/edit-ChooseTask-add",
        element: <ChoosableTaskPage fromParent="Edit-AddUnit" />,
      },
      {
        path: "/edit-ChooseLocation-edit",
        element: <ChoosableLocationPage fromParent="Edit-EditUnit" />,
      },
      {
        path: "/edit-ChooseLocation-add",
        element: <ChoosableLocationPage fromParent="Edit-AddUnit" />,
      },
      {
        path: "/edit-ChooseObject-edit/:locationID",
        element: <ChoosableObjectsPage fromParent="Edit-EditUnit" />,
      },
      {
        path: "/edit-ChooseObject-add/:locationID",
        element: <ChoosableObjectsPage fromParent="Edit-AddUnit" />,
      },
      {
        path: "/TaskDetailsAddGame",
        element: <TaskDetailsAddGame />,
      },
      {
        path: "/ObjectGames",
        element: <ObjectGames />,
      },
    ],
  },
]);

export default router;
