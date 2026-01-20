import { useSelector } from "react-redux";

import { getUser } from "./userSlice";

function UserName() {
  const username = useSelector(getUser); //get data from redux
  if (!username) return null;
  return (
    <div className="text-sm font-semibold hidden md:block">{username}</div>
  );
}

export default UserName;
