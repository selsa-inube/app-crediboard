import { createContext } from 'react';
import { IEnumContextType } from './types';

export const EnumContext = createContext<IEnumContextType>({} as IEnumContextType);