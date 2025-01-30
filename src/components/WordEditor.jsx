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
    localStorage.setItem("scenes", JSON.stringify(scenes));
  }, [scenes]);

  const [scenes, setScenes] = useState(getStoredScenes);
  const inputRefs = useRef({});
  const [selectedButton, setSelectedButton] = useState("Description");

  // Save scenes to localStorage whenever scenes state changes
  useEffect(() => {
    localStorage.setItem("scenes", JSON.stringify(scenes));
  }, [scenes]);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);

    // Get the currently focused element
    const activeElement = document.activeElement;

    // Find which scene is currently active based on the focused element's ref
    let activeSceneIndex = -1;

    Object.keys(inputRefs.current).forEach((key) => {
      if (inputRefs.current[key] === activeElement) {
        // Extract scene index from the ref key (format: scene-{index}-type-{contentIndex})
        const match = key.match(/scene-(\d+)/);
        if (match) {
          activeSceneIndex = parseInt(match[1]);
        }
      }
    });

    setScenes((prevScenes) =>
      prevScenes.map((scene, index) => {
        // Only update the scene that is currently active
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
            content: [...(scene.content || []), newContent], // Ensure content is always an array
          };
        }
        // Return other scenes unchanged
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
    
        // Get references to all inputs/textareas in order
        const allInputRefs = Object.keys(inputRefs.current)
          .sort((a, b) => {
            const [sceneA, contentA] = a.match(/scene-(\d+).*?-(\d+)/).slice(1);
            const [sceneB, contentB] = b.match(/scene-(\d+).*?-(\d+)/).slice(1);
            return sceneA === sceneB ? contentA - contentB : sceneA - sceneB;
          });
    
        // Find current input index
        const currentInputKey = allInputRefs.find(
          key => inputRefs.current[key] === input
        );
        const currentIndex = allInputRefs.indexOf(currentInputKey);
    
        setScenes(prevScenes => {
          const updatedScenes = prevScenes.map((scene, index) => {
            if (index === sceneIndex) {
              const newContent = scene.content.filter((_, idx) => idx !== contentIndex);
              return {
                ...scene,
                content: newContent
              };
            }
            return scene;
          });
          
          // Filter out scenes with empty content
          return updatedScenes.filter(scene => scene.content.length > 0);
        });
    
        // Focus the previous input if available
        setTimeout(() => {
          if (currentIndex > 0) {
            const prevInputKey = allInputRefs[currentIndex - 1];
            const prevInput = inputRefs.current[prevInputKey];
            if (prevInput) {
              prevInput.focus();
              // Place cursor at the end of the previous input
              if (prevInput.tagName.toLowerCase() === 'textarea') {
                const length = prevInput.value.length;
                prevInput.setSelectionRange(length, length);
              }
            }
          }
        }, 0);
    
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
        if (selectedButton === "Characters") {
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
          setSelectedButton("Dialog");
          handleButtonClick("Dialog");
          // Focus the dialog textarea
          setTimeout(() => {
            const dialogInput =
              inputRefs.current[
                `scene-${sceneIndex}-dialog-${contentIndex + 1}`
              ];
            if (dialogInput) dialogInput.focus();
          }, 0);
        } else if (selectedButton === "Dialog") {
          setSelectedButton("Characters");
          handleButtonClick("Characters");
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Buttons */}
      <div className="w-full flex justify-center pt-5 gap-3 mb-4 px-6">
        <button
          className={`border text-xl border-black rounded-lg px-4 py-2 bg-white text-black`}
          onClick={handleAddScene}
        >
          Add Scene
        </button>
        <button
          className={`border text-xl border-black rounded-lg px-4 py-2 ${
            selectedButton === "Description"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Description")}
        >
          Description
        </button>
        <button
          className={`border text-xl border-black rounded-lg px-4 py-2 ${
            selectedButton === "Characters"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Characters")}
        >
          Characters
        </button>
        <button
          className={`border text-xl border-black rounded-lg px-4 py-2 ${
            selectedButton === "Dialog"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
          onClick={() => handleButtonClick("Dialog")}
        >
          Dialog
        </button>
      </div>

      {/* Scenes */}
      <div className="w-full flex justify-center flex-col items-center space-y-8">
        {scenes.map((scene, sceneIndex) => (
          <div key={scene.id} className="w-11/12 bg-white rounded-lg lg:w-2/3">
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
                    className="w-full p-4  text-2xl outline-none overflow-hidden resize-none"
                    rows={1}
                    placeholder="Type your description..."
                    value={content.description}
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
                          e.preventDefault(); // Prevent default behavior
                      
                          // Insert a newline at the current cursor position
                          const cursorPosition = e.target.selectionStart;
                          const currentValue = e.target.value;
                          const newValue =
                            currentValue.slice(0, cursorPosition) +
                            "\n" +
                            currentValue.slice(cursorPosition);
                      
                          handleContentChange(sceneIndex, contentIndex, "description", newValue);
                      
                          // Set cursor position after the new line
                          setTimeout(() => {
                            e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
                          }, 0);
                      
                          // Increase the row count by 1 manually
                          e.target.rows += 1;
                        }
                      }}
                      onInput={(e) => {
                        e.target.style.height = "auto"; // Reset height
                        e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height dynamically
                      }}
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
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordEditor;
