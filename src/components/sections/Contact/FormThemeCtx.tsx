import * as React from "react";
import { LIGHT_COLORS } from "@/components/sections/Contact/contact.constants";
import {FormColors} from "@/components/sections/Contact/contact.types";

export const FormThemeCtx = React.createContext<FormColors>(LIGHT_COLORS);
export const useFormTheme = () => React.useContext(FormThemeCtx);
