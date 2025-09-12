import { useState, useCallback, useEffect } from 'react';

import { getEnumerators } from "@services/enum/icorebanking-vi-crediboard/enumerators";
import { EnumeratorsResponse } from '@services/enum/icorebanking-vi-crediboard/enumerators/types';

import { EnumContext } from './context'; 
import { EnumProviderProps, TransformedEnums } from './types';
import { paths } from "./config";

export const EnumProvider = ({ children }: EnumProviderProps) => {
    const [enums, setEnums] = useState({});
    const [language, setLanguage] = useState("");

    useEffect(() => {
        const browserLanguage = navigator.language;
        const splitLanguage = browserLanguage.split("-");

        if (splitLanguage.length === 2) {
            setLanguage(splitLanguage[0]);
        }
    }, []);

    const getEnums = useCallback(async (businessUnitPublicCode: string) => {
        const data: EnumeratorsResponse | null = await getEnumerators(businessUnitPublicCode, paths.moneyDestination.xAction, paths.moneyDestination.path);

        if (!data) {
            setEnums({});
            return;
        }

        const transformedEnums = Object.keys(data).reduce((transformedEnums, enumName) => {
            const enumItems: Record<string, string> = {};

            data[enumName].forEach(item => {
                const translatedText = item.i18nValue?.[language];
                enumItems[item.code] = translatedText || "";
            });

            transformedEnums[enumName] = enumItems;
            return transformedEnums;
        }, {} as TransformedEnums);

        setEnums(transformedEnums);

    }, [language]);

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