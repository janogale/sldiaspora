import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import DepartmentStructureContent from "./components/DepartmentStructureContent";

export const metadata = {
  title: "Department Structure | Somaliland Diaspora Affairs",
  description:
    "Official structure and terms of reference for the Somaliland Diaspora Affairs Department, including leadership, sections, and units.",
};

export default function DepartmentStructure() {
  return (
    <>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="Department Structure" />
      <DepartmentStructureContent />
    </>
  );
}
