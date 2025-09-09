import { createContext, useState, useCallback } from 'react';

import { getEnumerators } from "@services/enum/icorebanking-vi-crediboard/enumerators";
import { EnumeratorsResponse } from '@services/enum/icorebanking-vi-crediboard/enumerators/types';

import { IEnumContextType, EnumProviderProps, TransformedEnums } from './types';

export const EnumContext = createContext<IEnumContextType>({} as IEnumContextType);

export const EnumProvider = ({ children }: EnumProviderProps) => {
    const [enums, setEnums] = useState({});

    const browserLanguage = navigator.language;
    const splitLanguage = browserLanguage.split("-");

    const getEnums = useCallback(async (businessUnitPublicCode: string) => {
        const data: EnumeratorsResponse | null = await getEnumerators(businessUnitPublicCode);

        if (!data) {
            setEnums({});
            return;
        }

        const transformedEnums = Object.keys(data).reduce((transformedEnums, enumName) => {
            const enumItems: Record<string, string> = {};

            data[enumName].forEach(item => {
                const translatedText = item.I18nDescription?.[splitLanguage[0]];
                enumItems[item.Code] = translatedText || "";
            });

            transformedEnums[enumName] = enumItems;
            return transformedEnums;
        }, {} as TransformedEnums);

        setEnums(transformedEnums);

    }, [browserLanguage]);

    const contextValue = {
        enums,
        getEnums
    };

    return (
        <EnumContext.Provider value={contextValue}>
            {children}
        </EnumContext.Provider>
    )
}