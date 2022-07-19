import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";

const javascriptDefault = `// some comment`;

const Landing = () => {
    // localStorage.removeItem("localStatus");
    const localStatus = useState(JSON.parse(localStorage.getItem("localStatus")));
    const [once, setOnce] = useState(true);
    const [code, setCode] = useState(localStatus);
    const [customInput, setCustomInput] = useState("judge0");
    const [outputDetails, setOutputDetails] = useState(null);
    const [processing, setProcessing] = useState(null);
    const [theme, setTheme] = useState("cobalt");
    const [language, setLanguage] = useState(languageOptions[0]);

    const enterPress = useKeyPress("Enter");
    const ctrlPress = useKeyPress("Control");
    const onChange = (action, data) => {
        switch (action) {
            case "code": {
                setCode(data);
                localStorage.setItem("localStatus", JSON.stringify({ "language": language, "code": data, "theme": theme }));
                break;
            }
            default: {
                console.warn("case not handled!", action, data);
            }
        }
    };

    // if(localStatus && once){
    //     console.log("here", localStatus[0].code);
    //     onChange("code", localStatus[0].code);
    //     setLanguage(localStatus[0].language);
    //     setTheme(localStatus[0].theme);
    //     setOnce(false);
    // }

    const onSelectChange = (sl) => {
        console.log("selected Option...", sl);
        setLanguage(sl);
    };

    useEffect(() => {
        if (enterPress && ctrlPress) {
            console.log("enterPress", enterPress);
            console.log("ctrlPress", ctrlPress);
            handleCompile();
        }
    }, [ctrlPress, enterPress]);
    
    const handleCompile = () => {
        // We will come to the implementation later in the code
        setProcessing(true);

        const formData = {
            language_id: language.id,
            // encode source code in base64
            source_code: window.btoa(code),
            stdin: window.btoa(customInput),
        };
        console.log(formData);
        console.log('"I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=","stdin":"SnVkZ2Uw"');
        const options = {
            method: 'POST',
            url: 'https://judge0-extra-ce.p.rapidapi.com/submissions',
            params: {base64_encoded: 'true', wait: 'false', fields: '*'},
            headers: {
              'content-type': 'application/json',
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': '0a43f81b14msh8d769c5f4b29ff0p1c408djsn1a519783a90c',
              'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com'
            },
            data: JSON.stringify(formData)
            // data:'{"language_id":1,"source_code":"I2luY2x1ZGUgPHN0ZGlvLmg+CgppbnQgbWFpbih2b2lkKSB7CiAgY2hhciBuYW1lWzEwXTsKICBzY2FuZigiJXMiLCBuYW1lKTsKICBwcmludGYoImhlbGxvLCAlc1xuIiwgbmFtZSk7CiAgcmV0dXJuIDA7Cn0=","stdin":"SnVkZ2Uw"}'
          };
        console.log(options);
        axios
            .request(options)
            .then(function (response) {
                console.log("res.data", response.data);
                const token = response.data.token;
                checkStatus(token);
            })
            .catch((err) => {
                let error = err.response ? err.response.data : err;
                setProcessing(false);
                console.log(error);
            });
    };

    const checkStatus = async (token) => {
        // We will come to the implementation later in the code
        const options = {
            method: 'GET',
            url: 'https://judge0-extra-ce.p.rapidapi.com/submissions/'+token ,
            params: { base64_encoded: 'true', fields: '*' },
            headers: {
                'X-RapidAPI-Key': '0a43f81b14msh8d769c5f4b29ff0p1c408djsn1a519783a90c',
                'X-RapidAPI-Host': 'judge0-extra-ce.p.rapidapi.com'
            }
        };
        axios.request(options).then(function (response) {
           
            // setCode(window.atob(response.data.source_code));
            setOutputDetails(response.data);
            if(response.data.status.id<3)return checkStatus(token);
            console.log(window.atob(response.data.stdin), "stdin")
            setProcessing(false);
        }).catch(function (error) {
            console.error(error);
            setProcessing(false);
        });
    };

    function handleThemeChange(th) {
        const theme = th;
        console.log("theme...", theme);

        if (["light", "vs-dark"].includes(theme.value)) {
            setTheme(theme);
        } else {
            defineTheme(theme.value).then((_) => setTheme(theme));
        }

        // We will come to the implementation later in the code
    }
    useEffect(() => {
        defineTheme("oceanic-next").then((_) =>
            setTheme({ value: "oceanic-next", label: "Oceanic Next" })
        );
    }, []);

    const showSuccessToast = (msg) => {
        toast.success(msg || `Compiled Successfully!`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    const showErrorToast = (msg) => {
        toast.error(msg || `Something went wrong! Please try again.`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
            <div className="flex flex-row" style={{ display: "flex", flexDirection: "row" }}>
                <div className="px-4 py-2" style={{ width: "50%", maxWidth: "250px", minWidth: "200px" }}>
                    <LanguagesDropdown onSelectChange={onSelectChange} />
                </div>
                <div className="px-4 py-2" style={{ width: "50%", maxWidth: "250px", minWidth: "200px" }}>

                    <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", space: "x-4" }}>
                <div className="flex flex-col w-full h-full justify-start items-end"
                    style={{ height: '100%', width: '100%' }}
                >
                    <CodeEditorWindow
                        code={code}
                        onChange={onChange}
                        language={language?.value}
                        theme={theme.value}
                    />
                    {/* {code} */}
                </div>

                <div className="right-container flex flex-shrink-0 w-[30%] flex-col"
                    style={{ display: 'flex', flexShrink: "0", width: "30%", flexDirection: "column" }}
                >
                    <OutputWindow outputDetails={outputDetails} />
                    <div className="flex flex-col items-end">
                        <CustomInput
                            customInput={customInput}
                            setCustomInput={setCustomInput}
                        />
                        <button
                            onClick={handleCompile}
                            disabled={!code}
                        // className={classnames(
                        //     "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                        //     !code ? "opacity-50" : ""
                        // )}
                        >
                            {processing ? "Processing..." : "Compile and Execute"}
                        </button>
                    </div>
                    {outputDetails && <OutputDetails outputDetails={outputDetails} />}
                </div>
            </div>


            <Footer />

        </>
    );
};
export default Landing;