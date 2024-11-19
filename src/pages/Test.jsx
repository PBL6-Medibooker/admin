import React, {useState} from 'react';
import {useTranslation} from "react-i18next";
import {ThemeWrapper, ToggleSwitch, ToggleWrapper} from "../components/style";

const Test = () => {
    const {t, i18n} = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState("vi");

    return (
        <>
            <ThemeWrapper>
                <ToggleWrapper>
                    <ToggleSwitch
                        onClick={() => {
                            setCurrentLanguage(currentLanguage === "vi" ? "en" : "vi");
                            i18n.changeLanguage(currentLanguage === "vi" ? "en" : "vn");
                        }}
                        type="checkbox" role="switch" />
                </ToggleWrapper>
            </ThemeWrapper>

            <div className="container text-center">
                <h1 className="my-3">React i18n</h1>
                <button
                    className="btn btn-primary me-2"
                    onClick={() => {
                        setCurrentLanguage(currentLanguage === "en" ? "vi" : "en");
                        i18n.changeLanguage(currentLanguage === "en" ? "vi" : "en");
                    }}
                >
                    Change language EN - VI
                </button>
                <span className="badge rounded-pill text-bg-danger me-1">
          {t("common.button.search")}
        </span>
                <span className="badge rounded-pill text-bg-danger me-1">
          {t("common.button.cancel")}
        </span>
                <span className="badge rounded-pill text-bg-danger me-1">
          {t("common.button.delete")}
        </span>
                <span className="badge rounded-pill text-bg-danger me-1">
          {t("common.button.save")}
        </span>
            </div>
        </>
    );
}

export default Test;
