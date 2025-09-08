import { createContext, useState } from 'react';

import { IEnumContextType, EnumProviderProps } from './types';

export const EnumContext = createContext<IEnumContextType>({} as IEnumContextType);

export const EnumProvider = ({ children }: EnumProviderProps) => {
    const [enums, setEnums] = useState({});
    
    return (
        <EnumContext.Provider value={{enums, setEnums}}>
            {children}
        </EnumContext.Provider>
    )
}