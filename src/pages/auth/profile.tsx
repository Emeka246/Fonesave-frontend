import { CardPersonal } from "./partials/card-personal";
import { CardSecurity } from "./partials/card-security";
import { CardDangerZone } from "./partials/card-danger-zone";

export default function ProfilePage({}: React.ComponentProps<"div">) {
  return (
    <div className="flex flex-col gap-7" >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
      </div>
      <CardPersonal />
         <CardSecurity />
         <CardDangerZone />


    </div>
  );
}