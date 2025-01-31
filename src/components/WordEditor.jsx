import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";

const WordEditor = () => {
  const getStoredScenes = () => {
    const storedScenes = localStorage.getItem("scenes");
    if (storedScenes) {
      try {
        const parsedScenes = JSON.parse(storedScenes);
        // Ensure each scene has a valid 'content' array
        return parsedScenes.map((scene) => ({
          ...scene,
          content: Array.isArray(scene.content) ? scene.content : [], // Fallback to empty array if content is invalid
        }));
      } catch (error) {
        console.error("Error parsing scenes from localStorage", error);
        // Return default state if JSON parsing fails
        return [
          {
            id: 1,
            title: "EXT. SOMEWHERE - DAY",
            characters: [],
            content: [
              {
                description: "", // Initially, only the description exists
              },
            ],
            isExpanded: true,
          },
        ];
      }
    } else {
      // Return default state if no scenes are stored in localStorage
      return [
        {
          id: 1,
          title: "EXT. SOMEWHERE - DAY",
          characters: [],
          content: [
            {
              description: "", // Initially, only the description exists
            },
          ],
          isExpanded: true,
        },
      ];
    }
  };
  const [scenes, setScenes] = useState(getStoredScenes);

  useEffect(() => {
    // Function to adjust a single textarea's height
    const adjustTextareaHeight = (textarea) => {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    // Adjust all textareas in the component
    Object.values(inputRefs.current).forEach((element) => {
      if (element && element.tagName.toLowerCase() === 'textarea') {
        adjustTextareaHeight(element);
      }
    });
  }, [scenes]);
  useEffect(() => {
    localStorage.setItem("scenes", JSON.stringify(scenes));
  }, [scenes]);

  const inputRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState("Description");



  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  
    const activeElement = document.activeElement;
  
    let activeSceneIndex = -1;
    Object.keys(inputRefs.current).forEach((key) => {
      if (inputRefs.current[key] === activeElement) {
        const match = key.match(/scene-(\d+)/);
        if (match) {
          activeSceneIndex = parseInt(match[1]);
        }
      }
    });
  
    setScenes((prevScenes) =>
      prevScenes.map((scene, index) => {
        if (index === activeSceneIndex) {
          let newContent = {};
          if (buttonName === "Dialog") {
            newContent = { dialog: "" };
          } else if (buttonName === "Characters") {
            newContent = { characters: "" };
          } else if (buttonName === "Description") {
            newContent = { description: "" };
          }
  
          return {
            ...scene,
            content: [...scene.content, newContent],
          };
        }
        return scene;
      })
    );
  };
  const handleContentChange = (sceneIndex, contentIndex, field, value) => {
    setScenes((prevScenes) =>
      prevScenes.map((scene, index) =>
        index === sceneIndex
          ? {
              ...scene,
              content: scene.content.map((content, idx) =>
                idx === contentIndex
                  ? {
                      ...content,
                      [field]: value,
                    }
                  : content
              ),
            }
          : scene
      )
    );

    // Adjust height after content change
    setTimeout(() => {
      const textarea = inputRefs.current[`scene-${sceneIndex}-${field}-${contentIndex}`];
      if (textarea && textarea.tagName.toLowerCase() === 'textarea') {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, 0);
  };

  const handleAddScene = () => {
    const newScene = {
      id: scenes.length + 1,
      title: `EXT. NEW SCENE - DAY`,
      characters: [],
      content: [
        {
          description: "",
        },
      ],
      isExpanded: true,
    };

    setScenes((prevScenes) => [...prevScenes, newScene]);

    // Focus the description textarea of the new scene after it's added
    setTimeout(() => {
      const newSceneIndex = scenes.length;
      const newTextarea =
        inputRefs.current[`scene-${newSceneIndex}-description-0`];
      if (newTextarea) {
        newTextarea.focus();
      }
    }, 0);
  };

  const handleDeleteScene = (sceneId) => {
    setScenes((prevScenes) => {
      const updatedScenes = prevScenes.filter((scene) => scene.id !== sceneId);
      localStorage.setItem("scenes", JSON.stringify(updatedScenes));
      return updatedScenes;
    });
  };

  const handleKeyDown = (event, sceneIndex, contentIndex) => {
    const input = event.target;
    if (event.key === "Backspace" && input.value === "") {
      event.preventDefault();
    
      // Don't delete if this is the only content in the scene
      const currentScene = scenes[sceneIndex];
      if (currentScene.content.length === 1) {
        return;
      }
    
      // Get references to all inputs in order
      const allInputRefs = Object.keys(inputRefs.current)
        .sort((a, b) => {
          const [sceneA, contentA] = a.split('-').slice(1);
          const [sceneB, contentB] = b.split('-').slice(1);
          return sceneA === sceneB ? contentA - contentB : sceneA - sceneB;
        });
    console.log(allInputRefs,'11111111111111111111111111')
      // Find current input index
      const currentInputKey = allInputRefs.find(
        (key) => inputRefs.current[key] === input
      );
      const currentIndex = allInputRefs.indexOf(currentInputKey);
    
      // Update selected button based on previous input type
      if (currentIndex > 0) {
        const prevInputKey = allInputRefs[currentIndex - 1];
        const type = prevInputKey.split('-')[2]; // Get input type from key
        setSelectedButton(type.charAt(0).toUpperCase() + type.slice(1));
      }
    
      // Update scenes state
      setScenes((prevScenes) => {
        const newScenes = prevScenes.map((scene, idx) => {
          if (idx === sceneIndex) {
            const newContent = scene.content.filter((_, i) => i !== contentIndex);
            return { ...scene, content: newContent };
          }
          return scene;
        });
        
        // Remove empty scenes
        return newScenes.filter(scene => scene.content.length > 0);
      });
    
      // Focus previous input
      setTimeout(() => {
        if (currentIndex > 0) {
          const prevInputKey = allInputRefs[currentIndex - 1];
          const prevInput = inputRefs.current[prevInputKey];
          
          if (prevInput) {
            prevInput.focus();
            if (prevInput.tagName.toLowerCase() === "textarea") {
              prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
            }
          }
        }
      }, 0);
      
      return;
    }
    if (event.key === "Tab" && event.shiftKey) {
      event.preventDefault();
  
      // Only create a new description if the selected button is Characters or Dialog
      if (selectedButton === "Characters" || selectedButton === "Dialog") {
        setSelectedButton("Description");
        setScenes((prevScenes) =>
          prevScenes.map((scene, index) => {
            if (index === sceneIndex) {
              const newContent = [...scene.content];
  
              // Insert a new characters object after the current dialog input
              if (selectedButton === "Characters" || selectedButton === "Dialog" && input.value.trim() !== "") {
                const insertIndex = contentIndex + 1;
                newContent.splice(insertIndex, 0, { description: "" });
  
                return { ...scene, content: newContent };
              }
            }
            return scene;
          })
        );
  
        // Focus the newly created description textarea
        setTimeout(() => {
          const descriptionInput = inputRefs.current[
            `scene-${sceneIndex}-description-${contentIndex + 1}`
          ];
          if (descriptionInput) descriptionInput.focus();
        }, 0);
      }
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      setSelectedButton("Characters");
      handleButtonClick("Characters");
      // Focus the newly created characters input
      setTimeout(() => {
        const charInput =
          inputRefs.current[
            `scene-${sceneIndex}-characters-${contentIndex + 1}`
          ];
        if (charInput) charInput.focus();
      }, 0);
    } else if (event.key === "Enter") {
      // Only prevent default and switch mode if shift+enter is not pressed
      if (!event.shiftKey && selectedButton !== "Description") {
        event.preventDefault();
        if (selectedButton === "Characters" && input.value.trim() !== "") {
          // Only proceed if there's a value in the characters input
          setScenes((prevScenes) =>
            prevScenes.map((scene, index) =>
              index === sceneIndex
                ? {
                    ...scene,
                    characters: scene.characters.includes(input.value.trim())
                      ? scene.characters
                      : [...scene.characters, input.value.trim()],
                  }
                : scene
            )
          );
          setScenes((prevScenes) =>
            prevScenes.map((scene, index) => {
              if (index === sceneIndex) {
                const newContent = [...scene.content];
    
                // Insert a new dialog object after the current character input
                if (selectedButton === "Characters" && input.value.trim() !== "") {
                  const insertIndex = contentIndex + 1;
                  newContent.splice(insertIndex, 0, { dialog: "" });
    
                  return { ...scene, content: newContent };
                }
              }
              return scene;
            })
          );
          setSelectedButton("Dialog");
          // Focus the dialog textarea
          setTimeout(() => {
            const dialogInput = inputRefs.current[`scene-${sceneIndex}-dialog-${contentIndex + 1}`];
            if (dialogInput) dialogInput.focus();
          }, 0);
        } else if (selectedButton === "Dialog" && input.value.trim() !== "") {
          setScenes((prevScenes) =>
            prevScenes.map((scene, index) => {
              if (index === sceneIndex) {
                const newContent = [...scene.content];
    
                // Insert a new characters object after the current dialog input
                if (selectedButton === "Dialog" && input.value.trim() !== "") {
                  const insertIndex = contentIndex + 1;
                  newContent.splice(insertIndex, 0, { characters: "" });
    
                  return { ...scene, content: newContent };
                }
              }
              return scene;
            })
          );
          setSelectedButton("Characters");
          // Focus the characters input
          setTimeout(() => {
            const charInput =
              inputRefs.current[
                `scene-${sceneIndex}-characters-${contentIndex + 1}`
              ];
            if (charInput) charInput.focus();
          }, 0);
        }
      }
    }
  };

  const removeCharacter = (sceneIndex, charIndex) => {
    setScenes(scenes.map((scene, index) => 
      index === sceneIndex 
        ? { 
            ...scene, 
            characters: scene.characters.filter((_, i) => i !== charIndex)
          }
        : scene
    ));
  };



  return (
    <div className="min-h-screen bg-gray-100  ">
      <div className="flex w-full justify-center pt-4">
        <input type="text" className="text-5xl font-semibold bg-transparent outline-none w-2/3 text-center border-b-4 border-black border-opacity-30 mb-6 py-2" defaultValue={"Enter Your Filim Name "} />
      </div>
      <div className="flex">
      {/* Buttons */}
      <div className="w-1/4  flex flex-col mt-3 p-4 gap-3 fixed top-[27%] left-4 ">
       <div className="flex flex-col p-4 border border-opacity-20 space-y-3 bg-gray-100 border-black rounded-xl">
        <div
          className={`border  border-black  border-opacity-30  rounded-lg px-4 py-2 ${
            selectedButton === "Description"
              ? "bg-pink-100 text-black font-semibold"
              : "bg-white text-black font-medium"
          }`}
       
        >
         <p className="text-xl font-semibold p-1">Scene Action</p><hr className="border-black border-opacity-20" />
         <div className="p-2">
          <p className="text-lg">Press Keyboard Shift+Tab</p>
         </div>
        </div>
        <div
          className={`border  border-black border-opacity-30  rounded-lg px-4 py-2 ${
            selectedButton === "Characters"
              ? "bg-pink-100 text-black font-semibold"
              : "bg-white text-black font-medium"
          }`}
   
        >
          <p className="text-xl font-semibold p-1">Add Character</p><hr className="border-black border-opacity-20" />
          <div className="p-2">
          <p className="text-lg">Press Keyboard Tab</p>
         </div>
        </div>
        <div
          className={`border  border-black border-opacity-30  rounded-lg px-4 py-2 ${
            selectedButton === "Dialog"
              ? "bg-pink-100 text-black font-semibold"
              : "bg-white text-black font-medium"
          }`}
     
        >
          <p className="text-xl font-semibold p-1">Add Dailog</p><hr className="border-black border-opacity-20" />
          <div className="p-2">
          <p className="text-lg">Type Character & Press Enter</p>
         </div>
        </div>
        </div>
      </div>

      {/* Scenes */}
      <div className="w-3/4  px-12 mt-7 flex ml-[25%]  flex-col space-y-8  "
      
      >
        {scenes.map((scene, sceneIndex) => (
          <div key={scene.id} className="w-full  bg-white rounded-lg ">
            <div className="w-full bg-pink-100 p-4 mb-6 rounded-md shadow-md">
              <div className="flex items-center gap-2 justify-between mb-3">
                <span className="text-2xl bg-gray-200 py-1 px-3 rounded-md">
                  {scene.id}
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent text-4xl font-semibold outline-none"
                  defaultValue={scene.title}
                />
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-full">
                    {scene.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {scenes.length > 1 && (
                    <button
                      className="p-2 hover:bg-red-200 rounded-full text-red-500"
                      onClick={() => handleDeleteScene(scene.id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>

              {/* Characters Section */}
              <div className="mb-4 mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-2xl font-medium">Characters:</span>
                {scene.characters.map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="text-2xl font-bold text-white bg-gray-400 px-2 py-1 rounded-full flex items-center gap-2"
                  >
                    {char}
                    <button  onClick={() => removeCharacter(sceneIndex, charIndex)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              
              </div>
            </div>

            {/* Scene Content - Show only selected content */}
            {scene.content.map((content, contentIndex) => (
              <div key={contentIndex}>
                {/* Render Description Textarea */}
                {content.description !== undefined && (
                <textarea
                ref={(el) =>
                  (inputRefs.current[
                    `scene-${sceneIndex}-description-${contentIndex}`
                  ] = el)
                }
                className="w-full p-4 text-2xl outline-none resize-none"
                value={content.description}
                placeholder="Type Your Content Here...................."
                onChange={(e) =>
                  handleContentChange(
                    sceneIndex,
                    contentIndex,
                    "description",
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Tab") {
                    handleKeyDown(e, sceneIndex, contentIndex);
                  } else if (e.key === "Enter" && !e.shiftKey) {
                    // Check if the textarea is not empty
                    if (e.target.value.trim() !== "") {
                      e.preventDefault(); // Prevent default behavior (new line)
                      const cursorPosition = e.target.selectionStart;
                      const currentValue = e.target.value;
                      const newValue =
                        currentValue.slice(0, cursorPosition) +
                        "\n" +
                        currentValue.slice(cursorPosition);
                      handleContentChange(sceneIndex, contentIndex, "description", newValue);
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
                      }, 0);
                    } else {
                      e.preventDefault(); // Prevent default behavior if the textarea is empty
                    }
                  }else if(e.key === "Backspace" && e.target.value === ""){
                    handleKeyDown(e, sceneIndex, contentIndex);
                  }
                }}
                onFocus={() => setSelectedButton("Description")}
              />
                )}

                {/* Render Characters Input */}
                {content.characters !== undefined && (
                  <div className="w-full flex justify-center">
                    <input
                      ref={(el) =>
                        (inputRefs.current[
                          `scene-${sceneIndex}-characters-${contentIndex}`
                        ] = el)
                      }
                      type="text"
                      className="w-1/2 text-3xl text-center p-2 outline-none"
                      placeholder="Type your characters..."
                      value={content.characters}
                      onChange={(e) =>
                        handleContentChange(
                          sceneIndex,
                          contentIndex,
                          "characters",
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, sceneIndex, contentIndex)
                      }
                      onFocus={() => setSelectedButton("Characters")}
                    />
                  </div>
                )}

                {/* Render Dialog Textarea */}
                {content.dialog !== undefined && (
                  <div className="w-full flex justify-center ">
                    <textarea
                      ref={(el) =>
                        (inputRefs.current[
                          `scene-${sceneIndex}-dialog-${contentIndex}`
                        ] = el)
                      }
                      className="w-3/5 text-2xl overflow-hidden p-2 outline-none resize-none"
                      rows={2}
                      placeholder="Type your dialog..."
                      value={content.dialog}
                      onChange={(e) =>
                        handleContentChange(
                          sceneIndex,
                          contentIndex,
                          "dialog",
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, sceneIndex, contentIndex)
                      }
                      onInput={(e) => {
                        e.target.style.height = "auto"; // Reset height
                        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
                      }}
                      onFocus={() => setSelectedButton("Dialog")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      <div className="mt-7 flex justify-center pb-8">
      <button
          className={`border text-xl font-bold border-black border-opacity-30 hover:bg-gray-300 rounded-lg px-4 py-2 bg-white text-black`}
          onClick={handleAddScene}
        >
          Add Scene
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default WordEditor;
