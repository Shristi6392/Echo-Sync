import { useContext } from "react";
import { AuthContextInstance } from "./AuthContext";

export const useAuth = () => useContext(AuthContextInstance);
