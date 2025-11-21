import {CardInfoPatient} from "./components/CardInfoPatient";

export const PatientDashboard = () => {
  return (
    <div className="px-6 w-full flex justify-center mt-7 lg:items-center">
      <div className="w-full max-w-[369px] flex flex-col items-center lg:items-start lg:max-w-[954px]">
        <CardInfoPatient />
      </div>
    </div>
  );
};
