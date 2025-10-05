import { Link } from "react-router-dom";
import { ComponentProps } from 'react'
export function SiteCopyright(props: ComponentProps<"div">) {
  return (
    <div {...props} className="text-center text-xs text-balance *:hover:[a]:underline space-x-6">
     <span>
      © {new Date().getFullYear()} FonSave.
     </span>
     <Link to="#">Terms of Service</Link>
     <Link to="#">Privacy Policy</Link>
    </div>
  );
}