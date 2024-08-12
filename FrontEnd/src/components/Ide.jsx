// // import React, { useEffect } from "react";
// // import { useRef, useState } from "react";
// // import { Box, HStack } from "@chakra-ui/react";
// // import { Editor } from "@monaco-editor/react";
// // import LanguageSelector from "./LanguageSelector";
// // import { CODE_SNIPPETS } from "../constants";
// // import Output from "./Output";
// // import { debounce } from "lodash";
// // import { ACTIONS } from "../Actions";
// // export default function Ide({ socketRef, roomId }) {
// //   console.log("socketRef", socketRef.current, roomId);
// //   const editorRef = useRef();
// //   const [value, setValue] = useState("");
// //   const [language, setLanguage] = useState("javascript");

// //   // const onMount = (editor) => {
// //   //   editorRef.current = editor;
// //   //   editor.focus();
// //   // };
// //   const onMount = (editor) => {
// //     editorRef.current = editor;
// //     console.log("hi", editor.getValue);
// //     editor.focus();
// //     console.log("mount");
// //     // Setup change event listener

// //     editor.onDidChangeModelContent((changes) => {
// //       console.log("hioujk");
// //       const code = editor.getValue();
// //       const { origin } = changes;
// //       console.log("orifin", origin);
// //       console.log("code", code);
// //       setValue(code);
// //       console.log("haa bhai krre hai");
// //       if (origin !== "setValue") {
// //         socketRef.current.emit(ACTIONS.CODE_CHANGE, {
// //           roomId,
// //           code,
// //         });
// //       }
// //     });
// //     console.log("end");
// //   };
// //   const onSelect = (language) => {
// //     setLanguage(language);
// //     setValue(CODE_SNIPPETS[language]);
// //     //   if (editorRef.current) {
// //     //     editorRef.current.setValue(CODE_SNIPPETS[language]);
// //     // }

// //     socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
// //       roomId,
// //       language,
// //     });
// //   };

// //   useEffect(() => {
// //     if (socketRef.current) {
// //       const handleCodeChange = ({ code }) => {
// //         if (editorRef.current && code !== editorRef.current.getValue()) {
// //           editorRef.current.setValue(code);
// //         }
// //       };

// //       const handleLanguageChange = ({ language }) => {
// //         if (
// //           editorRef.current &&
// //           language !== editorRef.current.getModel().getLanguageId()
// //         ) {
// //           editorRef.current.updateOptions({ language });
// //           setLanguage(language);
// //         }
// //       };

// //       socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);

// //       socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
// //     }
// //     return () => {
// //       socketRef.current.off(ACTIONS.CODE_CHANGE);
// //     };
// //   }, [socketRef.current]);
// //   return (
// //     <div>
// //       <Box>
// //         <HStack spacing={4}>
// //           <Box w="50%">
// //             <LanguageSelector language={language} onSelect={onSelect} />
// //             <Editor
// //               options={{
// //                 minimap: {
// //                   enabled: false,
// //                 },
// //               }}
// //               height="75vh"
// //               theme="vs-dark"
// //               language={language}
// //               defaultValue={CODE_SNIPPETS[language]}
// //               onMount={onMount}
// //               value={value}
// //               onChange={(value) => setValue(value)}
// //             />
// //           </Box>
// //           <Output
// //             editorRef={editorRef}
// //             language={language}
// //             socketRef={socketRef}
// //             roomId={roomId}
// //             h="auto"
// //           />
// //         </HStack>
// //       </Box>
// //     </div>
// //   );
// // }

// //---------------------------------

import React, { useEffect, useRef, useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { debounce } from "lodash";
import { ACTIONS } from "../Actions";

export default function Ide({ socketRef, roomId , onCodeChange  }) {
  const editorRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");


  useEffect(() => {
    // Handler to update the state based on window size
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };
  
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
  
    // Call handleResize initially to set the correct state on mount
    handleResize();
  
    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Debounce function to limit the frequency of code change emission
  const debouncedEmitCodeChange = useRef(
   
     debounce( async (code) => {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code,
      });
    }, 1000)

   
  ).current;

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    // Setup change event listener with debounced emission
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      if (code !== value) {
        // setValue(code);
        onCodeChange(code);
        debouncedEmitCodeChange(code);
        setValue(code);
      }
      
    });
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
      roomId,
      language,
    });
  };

  

  useEffect(() => {
    if (socketRef.current) {
      // function debounce(func, wait) {
      //   let timeout;
      //   return function(...args) {
      //     clearTimeout(timeout);
      //     timeout = setTimeout(() => func(...args), wait);
      //   };
      // }
      
      const handleCodeChange = ({ code }) => {
        if (editorRef.current && code !== editorRef.current.getValue()) {
          console.log("haan haan bhai" , editorRef.current.getValue(), " code " , code)
           // editorRef.current.setValue(code);
            editorRef.current.updateOptions({code});
           setValue(code)
          // console.log("haan haan bhai" , editorRef.current.getValue(), " code " , code)
         
       
        }
      };


      //  const handleCodeChange = debounce(({ code }) => {
      //   if (editorRef.current && code !== editorRef.current.getValue()) {
      //     console.log("haan haan bhai", editorRef.current.getValue(), "code", code);
      //     // editorRef.current.setValue(code);
      //     editorRef.current.updateOptions({ code });
      //     setValue(code);
      //     // console.log("haan haan bhai", editorRef.current.getValue(), "code", code);
      //   }
      // }, 500);

      const handleLanguageChange = ({ language }) => {
        console.log("lang" , editorRef.current.getModel().getLanguageId() )
        if (
          editorRef.current &&
          language !== editorRef.current.getModel().getLanguageId()
        ) {
          editorRef.current.updateOptions({ language });
          setLanguage(language);
        }
      };

      // const handleRefreshBrowser = () => {
      //   window.location.reload();
      // };

      // socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
     // socketRef.current.on('REFRESH_BROWSER', handleRefreshBrowser);

        // Notify the server when about to refresh
    // const handleBeforeUnload = () => {
    //   socketRef.current.emit('USER_REFRESH', roomId);
    // };

  //  window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        socketRef.current.off(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
       // socketRef.current.off('REFRESH_BROWSER');
      //  window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [socketRef.current]);

  return (
    // <div className="container-fluid p-4 h-screen ">
    //   <div className="row h-full">
    //     <div className="col-md-12 d-flex flex-column h-100">
    //       <Box className="p-3 border rounded bg-dark">
    //         <HStack spacing={4} className="h-100">
    //           <Box className="w-100">
    //             <LanguageSelector language={language} onSelect={onSelect} value = {value} setValue = {setValue} />
    //             <Editor
    //               options={{
    //                 minimap: {
    //                   enabled: false,
    //                 },
    //                 smoothScrolling: true,
    //                 scrollBeyondLastLine: false
    //               }}
    //               height="75vh"
    //               theme="vs-dark"
    //               language={language}
    //               defaultValue={CODE_SNIPPETS[language]}
    //               onMount={onMount}
    //               value={value}
    //               onChange={(value) => setValue(value)}
    //               className="border rounded p-2" // Adds border and padding
    //             />
    //           </Box>
    //           <Output
    //             editorRef={editorRef}
    //             language={language}
    //             socketRef={socketRef}
    //             roomId={roomId}
    //             className=" rounded p-3 w-100" // Adds border, padding, and full width
    //           />
    //         </HStack>
    //       </Box>
    //     </div>
    //   </div>
    // </div>

  //   <div className="container-fluid  p-4 h-screen bg-gray-900 text-gray-100">
  //   <Box className="p-3 border rounded bg-dark h-full">
  //     <HStack spacing={4} className="h-full flex-col lg:flex-row  ">
  //       <Box className="w-full lg:w-2/3 flex flex-col">
  //         <LanguageSelector language={language} onSelect={onSelect} value={value} setValue={setValue} />
  //         <Editor
  //           options={{
  //             minimap: {
  //               enabled: false,
  //             },
  //             smoothScrolling: true,
  //             scrollBeyondLastLine: false
  //           }}
  //           height="75vh" // Adjusted height for smaller screens
  //           theme="vs-dark"
  //           language={language}
  //           defaultValue={CODE_SNIPPETS[language]}
  //           onMount={onMount}
  //           value={value}
  //           onChange={(value) => setValue(value)}
  //           className="border rounded p-2" // Adds border and padding
  //         />
  //       </Box>
  //       <Output
  //         editorRef={editorRef}
  //         language={language}
  //         socketRef={socketRef}
  //         roomId={roomId}
  //         className="rounded p-3 w-full lg:w-1/3 mt-4 lg:mt-0" // Adjusted to be below the editor on smaller screens
  //       />
  //     </HStack>
  //   </Box>
  // </div>

  <div className="p-4 h-screen bg-gray-900 text-gray-100">
  <Box className="p-3 border rounded bg-gray-800 max-sm:h-[1000px] flex flex-col lg:flex-row items-center ">
    <div className="flex flex-col flex-grow lg:w-3/4 sm:w-full ">
      <LanguageSelector language={language} onSelect={onSelect} value={value} setValue={setValue} />
      <Editor
        options={{
          minimap: {
            enabled: false,
          },
          smoothScrolling: true,
          scrollBeyondLastLine: false
        }}
        height="75vh" // Adjust height as needed
        width= {isMobile ? "100vw" : "45vw"}
        theme=""
        language={language}
        defaultValue={CODE_SNIPPETS[language]}
        onMount={onMount}
        value={value}
        onChange={(value) => setValue(value)}
        className="border rounded p-2"
      />
    </div>
    

    
      <Output
        editorRef={editorRef}
        language={language}
        socketRef={socketRef}
        roomId={roomId}
        className="rounded p-3 w-full lg:w-1/3 mt-4 lg:mt-0"
      />
    
  </Box>
</div>
  );
}





import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { debounce } from "lodash";
import { ACTIONS } from "../Actions";

export default function Ide({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  // Handler to update the state based on window size
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
  }, []);

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Initial call to handleResize
    handleResize();

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  // Debounced function for emitting code changes
  const debouncedEmitCodeChange = useRef(
    debounce((code) => {
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
          roomId,
          code,
        });
      }
    })
  ).current;

  const onMount = useCallback(
    (editor) => {
      editorRef.current = editor;
      editor.focus();

      // Setup change event listener with debounced emission
      editor.onDidChangeModelContent(() => {
        const code = editor.getValue();
        if (code !== value) {
          // Update local state and emit code change
          setValue(code);
          onCodeChange(code);
          debouncedEmitCodeChange(code);
        }
      });
    },
    [debouncedEmitCodeChange, onCodeChange, value]
  );

  const onSelect = useCallback(
    (language) => {
      setLanguage(language);
      const initialCode = CODE_SNIPPETS[language] || "";
      setValue(initialCode);
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
          roomId,
          language,
        });
      }
    },
    [roomId, socketRef.current]
  );

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code }) => {
        console.log("Received Code:", code);
        console.log("Current Editor Value:", editorRef.current.getValue());
        if (editorRef.current && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
          setValue(code);
        }
        console.log("Updated Editor Value:", editorRef.current.getValue());
      };
      

    
      

      const handleLanguageChange = ({ language }) => {
        if (
          editorRef.current &&
          language !== editorRef.current.getModel().getLanguageId()
        ) {
          editorRef.current.updateOptions({ language });
          setLanguage(language);
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
      socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);

      // Reconnection logic
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected, attempting to reconnect...");
        socketRef.current.connect();
      });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        socketRef.current.off(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
      };
    }
  }, [socketRef.current]);

  return (
    <div className="p-4 h-screen bg-gray-900 text-gray-100">
      <Box className="p-3 border rounded bg-gray-800 max-sm:h-[1000px] flex flex-col lg:flex-row items-center">
        <div className="flex flex-col flex-grow lg:w-3/4 sm:w-full">
          <LanguageSelector
            language={language}
            onSelect={onSelect}
            value={value}
            setValue={setValue}
          />
          <Editor
            options={{
              minimap: { enabled: false },
              smoothScrolling: true,
              scrollBeyondLastLine: false,
            }}
            height="75vh" // Adjust height as needed
            width={isMobile ? "100vw" : "45vw"}
            theme="vs-dark"
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            className="border rounded p-2"
          />
        </div>
        <Output
          editorRef={editorRef}
          language={language}
          socketRef={socketRef}
          roomId={roomId}
          className="rounded p-3 w-full lg:w-1/3 mt-4 lg:mt-0"
        />
      </Box>
    </div>
  );
}

