import BreadCamp from "../components/BreadCamp";
import Header2 from "../components/header2";
import DepartmentStructureContent from "./components/DepartmentStructureContent";

export const metadata = {
  title: "Department Structure | Somaliland Diaspora Affairs",
  description:
    "Official structure and terms of reference for the Somaliland Diaspora Affairs Department, including leadership, sections, and units.",
};

export default function DepartmentStructure() {
  return (
    <>
      <Header2 />
      <BreadCamp title="Department Structure" />
      <DepartmentStructureContent />
    </>
  );
}
